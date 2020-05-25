import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FRRRI_STATES_REGISTRY, StatesRegistry } from '@ng-frrri/router-middleware';
import { Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'frrri-many',
    templateUrl: './many.component.html',
    styleUrls: ['./many.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManyComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    @Input() path: string;
    protected facade: any;

    all$: Observable<any[]>;
    loaded$: Observable<boolean>;
    loading$: Observable<boolean>;
    loadingFirst$: Observable<boolean>;
    loadingNext$: Observable<boolean>;
    error$: Observable<string | undefined>;
    empty$: Observable<boolean>;
    next$?: Observable<any | false>;
    activeId$?: Observable<string | number | undefined>;

    constructor(
        @Optional() @Inject(FRRRI_STATES_REGISTRY) private statesRegistryService: StatesRegistry,
    ) { }

    ngOnInit(): void {
        if (!this.path) {
            throw new Error('Missing input `path` (<lya-many path="cache.posts">)');
        }

        try {
            this.facade = this.statesRegistryService.getByPath(this.path);
            if (!this.facade) { throw new Error(); }
        } catch (e) {
            throw new Error(`<lya-many> could not find path \`${this.path}\` in registered states`);
        }

        this.all$ = this.facade.all$.pipe(this.untilDestroyed());
        this.loaded$ = this.facade.loaded$.pipe(this.untilDestroyed());
        this.loading$ = this.facade.loadingMany$.pipe(this.untilDestroyed());
        this.error$ = this.facade.errorMany$.pipe(this.untilDestroyed());
        this.empty$ = this.facade.empty$.pipe(this.untilDestroyed());
        this.activeId$ = this.facade.activeId$.pipe(this.untilDestroyed());
        this.loadingNext$ = this.facade.loadingNext$.pipe(this.untilDestroyed());
        this.loadingFirst$ = this.facade.loadingFirst$.pipe(this.untilDestroyed());

        if ('next$' in this.facade) {
            this.next$ = this.facade.next$.pipe(this.untilDestroyed());
        }
    }

    loadNext() {
        if ('getNext' in this.facade) {
            this.facade.getNext().toPromise();
        } else {
            throw new Error(`The state provided for path \`${this.path}\` does not support \`getNext()\`. Consider extending your state with \`PaginatedCollectionState\` instead.`);
        }
    }

    activate(id: any) {
        if (typeof id === 'undefined') {
            throw new Error('Provide \`id\` for activate(id)');
        }
        this.facade.getActive(id).toPromise();
    }

    trackByKey(key?: string) {
        if (!key) {
            key = this.facade.primaryKey;
        }
        return (index: number, item: any) => {
            return item[key] ?? index;
        };
    }

    private untilDestroyed<In>() {
        return pipe(
            takeUntil(this.destroy$),
        ) as UnaryFunction<Observable<In>, Observable<In>>;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
