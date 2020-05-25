import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';
import { FRRRI_STATES_REGISTRY, StatesRegistry } from '@ng-frrri/router-middleware';
import { BehaviorSubject, combineLatest, Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'frrri-one',
    templateUrl: './one.component.html',
    styleUrls: ['./one.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneComponent implements OnInit, OnDestroy, OnChanges {

    @Input() path: string;
    @Input() id: string;
    private idSubject$$ = new BehaviorSubject<string>(undefined);
    private destroy$ = new Subject<void>();
    protected facade: any;

    one$: Observable<any>;
    oneId$: Observable<string | number | undefined>;
    loading$: Observable<boolean>;
    error$: Observable<string>;

    constructor(
        @Optional() @Inject(FRRRI_STATES_REGISTRY) private statesRegistry: StatesRegistry,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            this.idSubject$$.next(changes['id'].currentValue);
        }
    }

    ngOnInit(): void {
        if (!this.path) {
            throw new Error('Missing input `path` (<lya-one path="cache.posts">)');
        }

        try {
            this.facade = this.statesRegistry.getByPath(this.path);
            if (!this.facade) { throw new Error(); }
        } catch (e) {
            throw new Error(`<lya-one> could not find path \`${this.path}\` in registered states`);
        }

        this.one$ = combineLatest([
            this.facade.entities$,
            this.idSubject$$.asObservable(),
        ])
            .pipe(
                this.untilDestroyed(),
                map(([entities, id]) => {
                    if (!id) { return; }
                    return entities[id];
                }),
            );
        this.loading$ = this.facade.loadingOne$.pipe(this.untilDestroyed());
        this.error$ = this.facade.errorOne$.pipe(this.untilDestroyed());
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
