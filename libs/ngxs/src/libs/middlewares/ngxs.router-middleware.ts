import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Middleware, MiddlewareFactory } from '@ng-frrri/router-middleware';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { Operation, OperatorType } from '@ng-frrri/router-middleware/operators';
import { CollectionState } from '../collection-state/collection.state';

type StateFacade = CollectionState;

export class NgxsRouterMiddleware extends MiddlewareFactory(Platform.Resolver, Platform.NavigationEnd, Platform.Deactivated) implements Middleware {
    operate(operation: Operation, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let facade: StateFacade;
        if ('statePath' in operation && operation.statePath) {
            facade = this.statesRegistry.getByPath<StateFacade>(operation.statePath);
        }

        switch (platform) {
            case Platform.Resolver:
                return this.onResolve(operation, facade, route, state);
            case Platform.NavigationEnd:
                return this.onNavigationEnd(operation, facade, route, state);
            case Platform.Deactivated:
                return this.onDeactivated(operation, facade, route, state);
        }
    }

    onDeactivated(operation: Operation, facade: StateFacade, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        switch (operation.type) {
            case OperatorType.GetActive:
                return facade.deactivate(route.params[operation.param]);
        }
    }

    onResolve(operation: Operation, facade: StateFacade, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        switch (operation.type) {
            case OperatorType.GetActive:
                return facade.getActive(route.params[operation.param]);
            case OperatorType.GetOne:
                return facade.getOne(route.params[operation.param]);
            case OperatorType.GetMany:
                return facade.getMany({ params: operation.params });
            case OperatorType.Populate:
                return facade.registerPopulation(operation);

            default:
                const isFunction = typeof facade?.[operation.type] === 'function';
                return isFunction && facade?.[operation.type]();
        }
    }

    onNavigationEnd(operation: Operation, facade: StateFacade, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        switch (operation.type) {
            default:
                const isFunction = typeof facade?.[operation.type] === 'function';
                return isFunction && facade?.[operation.type]();
        }
    }
}
