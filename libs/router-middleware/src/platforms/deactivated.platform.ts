import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, CanDeactivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { concatMapTo, filter, map, mapTo, take } from 'rxjs/operators';
import { PlatformAbstract } from '../abstracts/platform.abstract';
import { toObservable } from '../helpers/is-observable';

@Injectable({
    providedIn: 'root',
})
export class DeactivatedPlatform extends PlatformAbstract implements CanDeactivate<any> {
    platform = Platform.Deactivated;

    cache: {
        route: ActivatedRouteSnapshot;
        state: RouterStateSnapshot;
    };

    onInit() {
        const router = this.injector.get(Router);
        router.events.pipe(
            filter(startEvent => startEvent instanceof NavigationStart),
            concatMapTo(
                router.events.pipe(
                    filter(event => event instanceof ActivationEnd),
                    take(1),
                    map((event: ActivationEnd) => event.snapshot),
                ),
            ),
        )
            .subscribe(
                () => this['onDeactivated']?.(),
            );
    }

    canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
        this.cache = { route: currentRoute, state: currentState };
        return true;
    }

    onDeactivated() {
        if (!this.cache) { return true; }
        const result = this.resolve(this.cache.route, this.cache.state);
        this.cache = undefined;
        return toObservable(result).pipe(mapTo(true));
    }
}
