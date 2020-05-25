import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { Observable } from 'rxjs';
import { StatesRegistry } from './states-registry.interface';

export interface Middleware<Result = any, Facade = any> {
    /** Specifies the platforms supported by the middleware */
    supportedPlatforms: Platform[];

    /** Returns a class implementing StateRegistry with a `getByPath` function returning a facade */
    statesRegistry: StatesRegistry<Facade>;

    /** Called for each operation for every supported platform */
    operate(operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result> | Promise<Result> | Result;
}
