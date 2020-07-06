describe('PaginatedCollectionState', () => {

    it('should work', () => {
        expect(true).toBeTruthy();
    });

});

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { PaginatedCollectionState, PaginationInterceptor } from '@ng-frrri/ngxs/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule, State } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { PaginatedCollectionService } from './paginated-collection-service.interface';
import { CollectionReducer, CollectionService, CollectionStateOptions, NgxsMiddlewareModule, CollectionOptions } from '@ng-frrri/ngxs';
import { PaginatedCollectionOptions } from './paginated-collection-options.interface';
import { StateClass } from '@ngxs/store/internals';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { StateRepository } from '@ngxs-labs/data/decorators';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@Injectable()
export class TestCrudCollectionService<V = any, IdType = any> implements CollectionService<V, IdType> {
    getOne(stateOptions: CollectionStateOptions, id: IdType) { return of({} as V); }
    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions = {}): Observable<V[]> { return of([]); }
    patchOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }) { return (of({} as V)); }
    putOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V> { return of({} as V); }
    deleteOne(stateOptions: CollectionStateOptions, id: IdType): Observable<void> { return of(); }
    postOne(stateOptions: CollectionStateOptions, body: Partial<V>): Observable<V> { return of({} as V); }
}

@Injectable()
export class TestPaginatedCrudService<V = any> implements PaginatedCollectionService<V> {
    getMany(stateOptions: any, options: GetManyOptions & { size?: number } = {}) { return of([]); }
    getAll(stateOptions: any, options: GetManyOptions & { size?: number } = {}): Observable<V[]> { return of([]); }
    getNext(url: any) { return of([]); }
}

export function TestCrudCollection<T = CollectionReducer>(options: CollectionOptions<T>) {
    options = {
        ...options,
        baseUrl: options.baseUrl ?? '/api',
        endpoint: options.endpoint ?? options.name.toString(),
        defaults: {
            ...createEntityCollections(),
            active: undefined,
            loaded: false,
            loading: {},
            error: {},
            ...options.defaults,
        },
    } as CollectionOptions<T>;

    const stateFn = State(options);
    const stateRepositoryFn = StateRepository();
    return function (target: StateClass) {
        stateFn(target);
        stateRepositoryFn(target);
        target.prototype.serviceToken = TestCrudCollectionService;

        const stateOptions = {
            requestOptions: options.requestOptions,
            endpoint: options.endpoint!,
            baseUrl: options.baseUrl!,
        } as CollectionStateOptions;
        if (options.idKey) {
            stateOptions.idKey = options.idKey!;
        }
        target.prototype.stateOptions = stateOptions;
    };
}

export function TestPaginatedCollection<T = CollectionReducer>(options: PaginatedCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = TestCrudCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = TestPaginatedCrudService;
        crudCollectionFn(target);
    };
}

@TestPaginatedCollection({
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends PaginatedCollectionState<Post, number> {

    readonly paginatedServiceToken = TestPaginatedCrudService as any;
}

describe('PaginatedCollectionState', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxsDataPluginModule.forRoot(),
                NgxsMiddlewareModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState]),
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                    useClass: PaginationInterceptor,
                },
                TestPaginatedCrudService,
                TestCrudCollectionService,
            ],
        }).compileComponents();
    });

    it('should getMany', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
        TestCrudCollectionService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
        crudService: TestCrudCollectionService,
    ) => {
        expect(postsState.paginatedServiceToken).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        expect(postsState.stateOptions).toBeDefined();

        const spy = spyOn(service, 'getMany').and.callThrough();
        const spyCrud = spyOn(crudService, 'getMany').and.callThrough();
        postsState.getMany().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyCrud).toHaveBeenCalledTimes(0);
    }));

    it('should getNext', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
        TestCrudCollectionService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        expect(postsState.paginatedServiceToken).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        expect(postsState.stateOptions).toBeDefined();

        const spy = spyOn(service, 'getNext').and.callThrough();
        postsState.getNext().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should getAll', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
        TestCrudCollectionService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        expect(postsState.paginatedServiceToken).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        expect(postsState.stateOptions).toBeDefined();

        const spy = spyOn(service, 'getAll').and.callThrough();
        postsState.getAll().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    }));

});
