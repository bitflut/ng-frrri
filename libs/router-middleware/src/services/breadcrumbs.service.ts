import { Injectable, InjectFlags } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { activeBreadcrumb, OperatorType } from '@ng-frrri/router-middleware/operators';
import { BehaviorSubject, EMPTY, ReplaySubject } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { FRRRI_OPERATIONS, FRRRI_STATES_REGISTRY } from '../constants';
import { NavigationEndPlatform } from '../platforms/navigation-end.platform';

@Injectable()
export class BreadcrumbsService extends NavigationEndPlatform {

    private activeId$$ = new ReplaySubject(1);
    activeId$ = this.activeId$$.asObservable();

    private all$$ = new BehaviorSubject([]);
    all$ = this.all$$.asObservable();

    protected statesRegistry = this.injector.get(FRRRI_STATES_REGISTRY, null, InjectFlags.Optional);

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const breadcrumbsMap: { [key: string]: any } = {};

        let currentRoute = route;
        while (currentRoute) {
            const operation = currentRoute.data[FRRRI_OPERATIONS]
                ?.filter(o => [OperatorType.ActiveBreadcrumb, OperatorType.StaticBreadcrumb].includes(o.type))
                ?.[0];

            if (operation) {
                breadcrumbsMap[`${operation.type} ${operation.id}`] = {
                    ...operation,
                    url: '/' + currentRoute.pathFromRoot.map(r => r.url[0]?.path).filter(url => !!url).join('/'),
                };
            }

            currentRoute = currentRoute.parent;
        }

        const breadcrumbs = await Promise.all([
            ...Object.values(breadcrumbsMap).map(c => {
                switch (c.type) {
                    case OperatorType.StaticBreadcrumb:
                        return c;
                    case OperatorType.ActiveBreadcrumb:
                        return this.activeBreadcrumbToStatic(c);
                }
            }),
        ]);

        this.all$$.next(breadcrumbs.reverse());
        this.activeId$$.next(breadcrumbs?.[0]?.id);
    }

    private async activeBreadcrumbToStatic(breadcrumb: ReturnType<typeof activeBreadcrumb>) {
        if (!this.statesRegistry) {
            throw new Error('Provide a StatesRegistry to use \`activeBreadcrumb()\`');
        }

        const facade = this.statesRegistry.getByPath(breadcrumb.statePath);
        const active = await facade.active$
            .pipe(
                timeout(12000),
                filter(a => !!a),
                take(1),
                catchError(e => {
                    console.error(e);
                    console.warn(`TIMEOUT ERROR: Could not find active entity in \`${breadcrumb.statePath}\` within timeout. Did you forget to use getActive in your routing instructions?`);
                    return EMPTY;
                }),
            ).toPromise();

        return breadcrumb.factory(active);
    }

}
