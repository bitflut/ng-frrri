import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FRRRI_MIDDLEWARE, FRRRI_STATES_REGISTRY } from '@ng-frrri/router-middleware';
import { NgxsRouterMiddleware } from './libs/middlewares/ngxs.router-middleware';
import { StatesRegistryService } from './libs/states-registry/states-registry.service';

@NgModule({
    imports: [CommonModule],
})
export class NgxsMiddlewareModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsMiddlewareModule,
            providers: [
                {
                    provide: FRRRI_STATES_REGISTRY,
                    useClass: StatesRegistryService,
                    deps: [Injector],
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: NgxsRouterMiddleware,
                    deps: [Injector],
                },
            ],
        };
    }

}
