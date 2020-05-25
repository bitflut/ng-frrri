import { Injectable, InjectFlags, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { Observable } from 'rxjs';
import { FRRRI_STATES_REGISTRY } from '../constants';
import { Middleware } from '../interfaces/middleware.interface';

export function MiddlewareFactory(...supportedPlatforms: Platform[]) {
    @Injectable()
    abstract class MiddlewareAbstract<T = any> implements Middleware<T> {
        supportedPlatforms = supportedPlatforms;
        statesRegistry = this.injector.get(FRRRI_STATES_REGISTRY, null, InjectFlags.Optional);
        constructor(protected injector: Injector) { }
        abstract operate(operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T;
    }

    return MiddlewareAbstract;
}
