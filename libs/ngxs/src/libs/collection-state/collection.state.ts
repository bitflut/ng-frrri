import { Injectable, InjectFlags, InjectionToken, Injector } from '@angular/core';
import { GetManyOptions, OperationContext } from '@ng-frrri/ngxs/internal';
import { FRRRI_STATES_REGISTRY } from '@ng-frrri/router-middleware';
import { populate } from '@ng-frrri/router-middleware/operators';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { EntityIdType, NgxsEntityCollections } from '@ngxs-labs/data/typings';
import { flatten, uniq, uniqBy } from 'lodash';
import { EMPTY, forkJoin, isObservable, Observable, of, pipe, throwError, UnaryFunction } from 'rxjs';
import { catchError, delay, map, mapTo, mergeMap, switchMap, tap, timeout } from 'rxjs/operators';
import { CollectionStateOptions } from './colleciton-state-options.interface';
import { CollectionService } from './collection-service.interface';
import { COLLECTION_OPTIONS_TOKEN } from './constants';

export type CollectionReducer<Entity = {}, IdType extends EntityIdType = EntityIdType> = NgxsEntityCollections<Entity, IdType> & {
    ids: EntityIdType[];
    entities: { [key in EntityIdType]: Entity };
    loaded: boolean;
    loading: { [key in OperationContext]: boolean | undefined };
    error: { [key in OperationContext]: string | undefined };
    active: Entity;
};

@Injectable()
export class CollectionState<Entity = {}, IdType extends EntityIdType = string, Reducer extends CollectionReducer<Entity, IdType> = CollectionReducer<Entity, IdType>>
    extends NgxsDataEntityCollectionsRepository<Entity, IdType, Reducer> {

    readonly serviceToken: InjectionToken<CollectionService>;
    readonly stateOptions: CollectionStateOptions;

    protected service = this.injector.get<CollectionService<Entity, IdType>>(this.serviceToken);

    /** @Optional `statesRegistry` is only needed if population is used */
    private statesRegistry = this.injector.get(FRRRI_STATES_REGISTRY, null, InjectFlags.Optional);
    private populations: Array<ReturnType<typeof populate>>;

    constructor(protected injector: Injector) {
        super();
        const { idKey, baseUrl, endpoint, requestOptions } = this.stateOptions;
        const providerOptions = this.injector.get(COLLECTION_OPTIONS_TOKEN, {}, InjectFlags.Optional);

        this.primaryKey = idKey ?? providerOptions.idKey ?? this.primaryKey; // TODO: update in @ngxs-labs/data
        this.stateOptions.baseUrl = providerOptions.baseUrl ?? baseUrl;
        this.stateOptions.endpoint = providerOptions.endpoint ?? endpoint;

        if (providerOptions.requestOptions?.populateFactory) {
            this.stateOptions.populateFactory = providerOptions.requestOptions.populateFactory;
        }

        this.stateOptions.requestOptions = {
            collectionUrlFactory: () => `${this.stateOptions.baseUrl}/${this.stateOptions.endpoint}`,
            resourceUrlFactory: id => `${this.stateOptions.baseUrl}/${this.stateOptions.endpoint}/${id}`,
            ...providerOptions.requestOptions,
            ...requestOptions,
        };
    }

    public resetPopulations(): void {
        this.populations = undefined;
    }

    public registerPopulation(operation: ReturnType<typeof populate>) {
        this.populations = uniqBy(
            [
                ...this.populations ?? [],
                operation,
            ],
            p => p.statePath + p.toStatePath + p.idPath + p.idSource,
        );
    }

    @Computed()
    public get loading$() {
        return this.state$.pipe(map((value: Reducer) => value.loading));
    }

    @Computed()
    public get loadingAny$() {
        return this.state$.pipe(map((value: Reducer) => !!value.loading));
    }

    @Computed()
    public get loadingMany$() {
        return this.state$.pipe(map((value: Reducer) => value.loading[OperationContext.Many]));
    }

    @Computed()
    public get loadingOne$() {
        return this.state$.pipe(map((value: Reducer) => value.loading[OperationContext.One]));
    }

    @Computed()
    public get loaded$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded));
    }

    @Computed()
    public get loadingFirst$() {
        return this.state$.pipe(map((value: Reducer) => !value.loaded && value.loading[OperationContext.Many]));
    }

    @Computed()
    public get loadingNext$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded && value.loading[OperationContext.Many]));
    }

    @Computed()
    public get empty$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded && !value.ids.length));
    }

    @Computed()
    public get errors$() {
        return this.state$.pipe(map((value: Reducer) => Object.values(value?.error || {})));
    }

    @Computed()
    public get errorMany$() {
        return this.state$.pipe(map((value: Reducer) => value.error[OperationContext.Many]));
    }

    @Computed()
    public get errorOne$() {
        return this.state$.pipe(map((value: Reducer) => value.error[OperationContext.One]));
    }

    @Computed()
    public get all$(): Observable<Entity[]> {
        return this.state$.pipe(map((value: Reducer) => Object.values(value.entities)));
    }

    @Computed()
    public get one$() {
        return (id: IdType) => this.state$.pipe(map((value: Reducer) => {
            return id && value.entities[id.toString()];
        }));
    }

    @Computed()
    public get activeId$(): Observable<IdType> {
        return this.state$.pipe(map((value: Reducer) => value.active && value.active[this.primaryKey]));
    }

    @Computed()
    public get active$(): Observable<Entity> {
        return this.state$.pipe(map((value: Reducer) => (Object.keys(value.active ?? {}).length > 1 || undefined) && value.active));
    }

    @DataAction()
    public setLoading(
        @Payload('context') context: OperationContext,
        @Payload('loading') loading: boolean | undefined,
    ): void {
        const state = this.getState();
        this.ctx.patchState({
            loading: {
                ...state.loading,
                [context]: loading,
            },
            error: {
                ...state.error,
                [context]: loading ? undefined : state.error[context],
            },
        } as any);
    }

    @DataAction()
    public setLoaded(@Payload('loaded') loaded: boolean): void {
        this.ctx.patchState({ loaded } as any);
    }

    @DataAction()
    public setError(
        @Payload('context') context: OperationContext,
        @Payload('error') error: string,
    ): void {
        this.ctx.patchState({
            error: {
                ...this.ctx.getState().error,
                [context]: error,
            },
        } as any);
    }

    @DataAction()
    public setActive(@Payload('entity') entity?: Entity): void {
        this.ctx.patchState({ active: entity } as any);
    }

    @DataAction()
    public deactivate(id?: EntityIdType): void {
        if (typeof id !== 'undefined') {
            const isIdActive = this.ctx.getState().active?.[this.primaryKey].toString() === id.toString();
            if (!isIdActive) { return; }
        }
        this.ctx.patchState({ active: undefined } as any);
    }

    @DataAction()
    public getActive(@Payload('id') id: IdType) {
        this.ctx.patchState({ active: { [this.primaryKey]: id } } as any);
        return this.service.getOne(this.stateOptions, id)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    success: resource => this.getActiveSuccess(resource),
                }),
            );
    }

    @DataAction()
    protected getActiveSuccess(@Payload('response') entity: Entity) {
        this.ctx.patchState({ active: entity } as any);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public getMany(@Payload('options') options: GetManyOptions = {}) {
        return this.service.getMany(this.stateOptions, options)
            .pipe(
                this.requestPipe({
                    context: OperationContext.Many,
                    success: resource => this.getManySuccess(resource),
                }),
            );
    }

    /** Used for population */
    public getAll(options: GetManyOptions = {}) {
        return this.getMany(options);
    }

    @DataAction()
    protected getManySuccess(@Payload('response') entities: any) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    @DataAction()
    public getOne(@Payload('id') id: IdType) {
        return this.service.getOne(this.stateOptions, id)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    success: resource => this.getOneSuccess(resource),
                }),
            );
    }

    @DataAction()
    protected getOneSuccess(@Payload('response') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public patchOne(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        return this.service.patchOne(this.stateOptions, update.id, update.changes)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    success: resource => this.patchOneSuccess({ id: update.id, changes: resource }),
                }),
            );
    }

    @DataAction()
    protected patchOneSuccess(@Payload('response') update: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([update]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public patchOneOptimistic(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        const original = this.snapshot.entities[update.id];
        this.updateOne({ id: update.id, changes: update.changes });
        return this.service.patchOne(this.stateOptions, update.id, update.changes)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    optimisticUndo: () => this.patchOneOptimisticUndo({ id: update.id, changes: original }),
                }),
            );
    }

    @DataAction()
    protected patchOneOptimisticUndo(@Payload('undo') undoUpdate: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([undoUpdate]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public putOne(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        return this.service.putOne(this.stateOptions, update.id, update.changes)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    success: resource => this.putOneSuccess({ id: update.id, changes: resource }),
                }),
            );
    }

    @DataAction()
    protected putOneSuccess(@Payload('response') update: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([update]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public postOne(@Payload('entity') entity: Partial<Entity>) {
        return this.service.postOne(this.stateOptions, entity)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    success: resource => this.addEntityOne(resource),
                }),
            );
    }

    @DataAction()
    protected postOneSuccess(@Payload('response') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public postOneOptimistic(@Payload('entity') entity: Entity) {
        if (!entity[this.primaryKey]) {
            throw new Error('Entity id is required for optimistic actions');
        }
        this.addEntityOne(entity);
        return this.service.postOne(this.stateOptions, entity)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    optimisticUndo: () => this.postOneOptimisticUndo(entity[this.primaryKey]),
                }),
            );
    }

    @DataAction()
    protected postOneOptimisticUndo(@Payload('undo') id: IdType) {
        this.removeEntitiesMany([id]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public deleteOne(@Payload('id') id: IdType) {
        return this.service.deleteOne(this.stateOptions, id)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    populate: false,
                    success: data => this.deleteOneSuccess(id),
                }),
            );
    }

    @DataAction()
    protected deleteOneSuccess(@Payload('response') id: IdType) {
        this.removeEntitiesMany([id]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public deleteOneOptimistic(@Payload('id') id: IdType) {
        const original = this.snapshot.entities[id];
        this.removeEntitiesMany([id]);
        return this.service.deleteOne(this.stateOptions, id)
            .pipe(
                this.requestPipe({
                    context: OperationContext.One,
                    populate: false,
                    optimisticUndo: () => this.deleteOneOptimisticUndo(original),
                }),
            );
    }

    @DataAction()
    protected deleteOneOptimisticUndo(@Payload('undo') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    protected onSuccess(context: OperationContext) {
        this.ctx.patchState({
            loading: {
                ...this.ctx.getState().loading,
                [context]: undefined,
            },
            error: {
                ...this.ctx.getState().error,
                [context]: undefined,
            },
            loaded: true,
        } as any);
    }

    protected requestPipe<In, Out = In>(options: {
        context: OperationContext,
        /** Defaults to true */
        populate?: boolean,
        /** A pipe to prepend (e.g. `() => this.paginationPipe()`) */
        prepend?: () => UnaryFunction<Observable<Out>, Observable<Out>>,
        /** Function to run if optimistic action failed */
        optimisticUndo?: () => void,
        success?: (data: Out) => void,
    }) {
        options = {
            populate: true,
            ...options,
        };

        return pipe(
            this.requestOptionsPipe<In, Out>(options.context),
            options.prepend ? options.prepend() : tap(),
            options.populate ? this.populationPipe() : tap(),
            options.success ? tap(result => options.success(result)) : tap(),
            mergeMap(result => {
                if (typeof this['afterSuccess'] === 'function') {
                    const source = this['afterSuccess'](result, options.context);
                    if (source && isObservable(source)) {
                        return source.pipe(mapTo(result));
                    }
                }
                return of(result);
            }),
            options.optimisticUndo ? this.catchOptimistcUndoPipe(() => options.optimisticUndo()) : tap(),
            this.catchErrorPipe(options.context),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }

    protected catchOptimistcUndoPipe<In, Out = In>(undoFn: () => void) {
        return pipe(
            catchError((error) => {
                undoFn();
                return throwError(error);
            }),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }

    protected requestOptionsPipe<In, Out = In>(context: OperationContext) {
        this.ctx.patchState({
            loading: {
                ...this.ctx.getState().loading,
                [context]: true,
            },
            error: {
                ...this.ctx.getState().error,
                [context]: undefined,
            },
        } as any);

        return pipe(
            timeout(this.stateOptions.requestOptions?.timeout || 30000),
            this.stateOptions.requestOptions?.delay
                ? delay(this.stateOptions.requestOptions.delay)
                : tap(),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }

    private populate<In extends Array<any>>(entities: In, population: ReturnType<typeof populate>) {
        const facade = this.statesRegistry.getByPath(population.toStatePath);
        const isIdOnEntity = population.statePath === population.idSource;

        let idKey1: string;
        let idKey2: string;

        if (isIdOnEntity) {
            idKey1 = population.idPath;
            idKey2 = facade.primaryKey;
        } else {
            idKey1 = facade.primaryKey;
            idKey2 = population.idPath;
        }

        const entityIds: IdType[] = flatten(
            entities.map(entity => entity[idKey1]),
        );

        // Look if we already have these entities in our cache
        if (isIdOnEntity) {
            const entityIdsFiltered: IdType[] = entityIds.filter(id => !facade.ids.includes(id as any));
            if (!entityIdsFiltered.length) { return of([]); }
        }

        const defaultFactory = (ids: IdType[], path: string) => ({ [path]: uniq(ids.map(id => id.toString())) });
        const factory = population.factory || this.stateOptions.populateFactory || defaultFactory;
        return facade.getAll({
            params: {
                ...population.params,
                ...factory(entityIds, idKey2),
            },
        });
    }

    protected populationPipe<In>(): UnaryFunction<Observable<In>, Observable<In>> {
        return pipe(
            switchMap(result => {
                const hasPopulations = this.populations?.length;
                if (!hasPopulations) { return of(result); }

                const operation = Array.isArray(result) ? OperationContext.Many : OperationContext.One;
                const populations = this.populations.filter(p => !p.operations || p.operations.includes(operation));
                if (!populations.length) { return of(result); }

                const entities: In[] = Array.isArray(result) ? result : [result];
                return forkJoin(
                    populations.map(p => this.populate(entities, p)),
                ).pipe(mapTo(result));
            }),
        );
    }

    protected catchErrorPipe<In, Out = In>(context: OperationContext) {
        return pipe(
            catchError(error => {
                this.ctx.patchState({
                    loading: {
                        ...this.ctx.getState().loading,
                        [context]: undefined,
                    },
                } as any);
                this.setError(context, error?.message || JSON.stringify(error));
                return EMPTY;
            }),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }
}
