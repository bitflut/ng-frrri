import { isPlatformServer } from '@angular/common';
import { Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FRRRI_MIDDLEWARE, FRRRI_OPERATIONS } from '../constants';
import { toObservable } from '../helpers/is-observable';

type OptionalArray<T = any> = T | T[];

export function PlatformFactory(platform: Platform) {
    @Injectable()
    abstract class PlatformAbstract<T = any> implements Resolve<OptionalArray<T>> {

        protected ngPlatformId = this.injector.get(PLATFORM_ID);

        constructor(protected injector: Injector) { }

        getOperations(route: ActivatedRouteSnapshot) {
            return route.data[FRRRI_OPERATIONS]
                ?.filter(operation => operation.platforms.includes(platform));
        }

        getMiddlewares() {
            return this.injector.get(FRRRI_MIDDLEWARE)
                ?.filter(middleware => middleware.supportedPlatforms.includes(platform));
        }

        getOperations$(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            const operations = this.getOperations(route) ?? [];
            const operations$: Array<Observable<any>> = [];
            operations.forEach(operation =>
                this.getMiddlewares()
                    .forEach(resolver => {
                        const operate = resolver.operate(operation, platform, route, state);
                        const operate$ = toObservable(operate);

                        const awaitPlatformServer = operation.awaitPlatformServer || true;
                        const awaitPlatformBrowser = operation.await || false;
                        const shouldAwait = isPlatformServer(this.ngPlatformId) ? awaitPlatformServer : awaitPlatformBrowser;

                        if (shouldAwait) {
                            operations$.push(
                                operate$.pipe(map(result => ({ operation, result }))),
                            );
                        } else {
                            operate$.pipe(take(1)).toPromise();
                            operations$.push(of({ operation, result: undefined }));
                        }
                    }),
            );

            return operations$;
        }

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OptionalArray<T>> | Promise<OptionalArray<T>> | OptionalArray<T> {
            const operations$ = this.getOperations$(route, state);
            if (!operations$.length) { return; }
            return forkJoin(operations$);
        }

    }

    return PlatformAbstract;
}
