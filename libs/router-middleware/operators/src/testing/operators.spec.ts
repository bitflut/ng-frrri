import { Component } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { frrri, FrrriModule, FRRRI_MIDDLEWARE, Middleware, MiddlewareAbstract, operate, StatesRegistry } from '@ng-frrri/router-middleware';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { getActive } from '../libs/crud/operators/get-active.operator';
import { getMany } from '../libs/crud/operators/get-many.operator';
import { populate } from '../libs/crud/operators/populate.operator';
import { reset } from '../libs/crud/operators/reset.operator';
import { OperatorType } from '../libs/enums/operator-type.enum';

const operateFull = (operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return `${platform} ${operation.type} ${operation.statePath}`;
};

const operateReset = (operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    if (operation.type !== OperatorType.Reset) { return; }
    return `${platform} ${operation.type} ${operation.statePath}`;
};

class FullMiddleware extends MiddlewareAbstract implements Middleware {
    statesRegistry: StatesRegistry<any>;
    supportedPlatforms = [Platform.Resolver, Platform.NavigationEnd];
    operate = operateFull;
}
class ResetMiddleware extends MiddlewareAbstract implements Middleware {
    statesRegistry: StatesRegistry<any>;
    supportedPlatforms = [Platform.Resolver, Platform.NavigationEnd];
    operate = operateReset;
}

const all = 'entities';
const posts = 'entities.posts';
const comments = 'entities.comments';
const users = 'entities.users';

describe('Operatos', () => {

    @Component({ template: '<router-outlet></router-outlet>' })
    class AppComponent { }

    @Component({ template: 'posts-component' })
    class PostsComponent { }

    @Component({ template: 'post-component' })
    class PostComponent { }

    const routes: Routes = [
        {
            path: '',
            component: PostsComponent,
            data: operate(
                reset(all),
                getMany(posts),
            ),
            children: [
                {
                    path: ':id',
                    component: PostComponent,
                    data: operate(
                        populate({
                            from: posts,
                            to: comments,
                        }),
                        populate({
                            from: comments,
                            to: users,
                        }),
                        getActive(posts),
                    ),
                },
            ],
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FrrriModule.forRoot(),
                RouterTestingModule.withRoutes(
                    frrri(routes),
                ),
            ],
            declarations: [
                AppComponent,
                PostComponent,
                PostsComponent,
            ],
            providers: [
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: FullMiddleware,
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: ResetMiddleware,
                },
            ],
        }).compileComponents();
    });

    it('should call resolvers', fakeAsync(inject(
        [Router, FRRRI_MIDDLEWARE],
        async (router: Router, [fullMiddleware, resetMiddleware]: Middleware[]) => {
            fullMiddleware.operate = jest.fn(operateFull);
            resetMiddleware.operate = jest.fn(operateReset);

            router.initialNavigation();
            tick();
            expect(fullMiddleware.operate).toHaveBeenNthCalledWith(1, reset(all), Platform.Resolver, expect.anything(), expect.anything());
            expect(fullMiddleware.operate).toHaveNthReturnedWith(1, `${Platform.Resolver} reset ${all}`);

            expect(fullMiddleware.operate).toHaveBeenNthCalledWith(2, getMany(posts), Platform.Resolver, expect.anything(), expect.anything());
            expect(fullMiddleware.operate).toHaveNthReturnedWith(2, `${Platform.Resolver} getMany ${posts}`);

            expect(resetMiddleware.operate).toHaveBeenNthCalledWith(1, reset(all), Platform.Resolver, expect.anything(), expect.anything());
            expect(resetMiddleware.operate).toHaveNthReturnedWith(1, `${Platform.Resolver} reset ${all}`);

            expect(resetMiddleware.operate).toHaveBeenNthCalledWith(2, getMany(posts), Platform.Resolver, expect.anything(), expect.anything());
            expect(resetMiddleware.operate).toHaveNthReturnedWith(2, undefined);

            router.navigateByUrl('/1');
            tick();
            expect(fullMiddleware.operate).toHaveNthReturnedWith(3, `${Platform.Resolver} populate ${posts}`);
            expect(fullMiddleware.operate).toHaveNthReturnedWith(4, `${Platform.Resolver} populate ${comments}`);
            expect(fullMiddleware.operate).toHaveNthReturnedWith(5, `${Platform.Resolver} getActive ${posts}`);
            expect(fullMiddleware.operate).toHaveBeenCalledTimes(5);
            expect(resetMiddleware.operate).toHaveBeenCalledTimes(5);
        },
    )));

});
