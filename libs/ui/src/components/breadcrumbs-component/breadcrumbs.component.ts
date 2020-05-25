import { ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsService } from '@ng-frrri/router-middleware';
import { Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'frrri-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();
    protected service = this.injector.get(BreadcrumbsService);

    all$ = this.service.all$.pipe(this.untilDestroyed());
    activeId$ = this.service.activeId$.pipe(this.untilDestroyed());

    constructor(protected injector: Injector) { }

    ngOnInit(): void { }

    private untilDestroyed<In>() {
        return pipe(
            takeUntil(this.destroy$),
        ) as UnaryFunction<Observable<In>, Observable<In>>;
    }

    trackByKey(key: string = 'id') {
        return (index: number, item: any) => {
            return item[key] ?? index;
        };
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
