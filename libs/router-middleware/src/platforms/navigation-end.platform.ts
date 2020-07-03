import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationStart, Resolve, Router } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { concatMapTo, filter, map, take } from 'rxjs/operators';
import { PlatformAbstract } from '../abstracts/platform.abstract';

@Injectable()
export class NavigationEndPlatform<T = any> extends PlatformAbstract implements Resolve<T | T[]> {

    platform = Platform.NavigationEnd;

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
                event => this['resolve']?.(event, router.routerState.snapshot),
            );
    }

}
