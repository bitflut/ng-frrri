import { Component } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { deactivate, getActive, getMany, staticMeta } from '@ng-frrri/router-middleware/operators';
import { of } from 'rxjs';
import { FRRRI_MIDDLEWARE } from '../constants';
import { MiddlewareFactory } from '../factories/middleware.factory';
import { frrri } from '../frrri';
import { FrrriModule } from '../frrri.module';
import { Middleware } from '../interfaces/middleware.interface';
import { operate } from '../operate/operate';

function MiddlewareTestingFactory(id: string | number, platforms: Platform[]) {
    class MyMiddleware extends MiddlewareFactory(...platforms) implements Middleware {
        operate(operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            const name = `${platform} ${id} --> ${operation}`;
            return of(name);
        }
    }

    return MyMiddleware;
}

describe('Platform', () => {

    class NavigationEndMiddleware1 extends MiddlewareTestingFactory(1, [Platform.NavigationEnd]) { }
    class ResolverMiddleware2 extends MiddlewareTestingFactory(2, [Platform.Resolver]) { }

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
                deactivate('posts'),
                getMany('posts'),
                staticMeta({ title: 'Posts' }),
            ),
            children: [
                {
                    path: ':id',
                    component: PostComponent,
                    data: operate(
                        getActive('posts'),
                        staticMeta({ title: 'Post #1' }),
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
                    useClass: NavigationEndMiddleware1,
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: ResolverMiddleware2,
                },
            ],
        }).compileComponents();
    });

    it('should provide middleware', inject(
        [FRRRI_MIDDLEWARE],
        (middlewares: any) => {
            expect(Array.isArray(middlewares)).toBeTruthy();
            expect(middlewares.length).toEqual(2);
        },
    ));

    it('should not call middleware without operators', fakeAsync(inject(
        [Router, FRRRI_MIDDLEWARE],
        async (router: Router, middlewares: Middleware<any>[]) => {
            const [navigationEndMiddleware, resolverMiddleware] = middlewares.map(r => spyOn(r, 'operate').and.callThrough());

            router.initialNavigation();
            tick();
            expect(resolverMiddleware).toBeCalledWith(getMany('posts'), Platform.Resolver, expect.anything(), expect.anything());
            expect(navigationEndMiddleware).toBeCalledWith(deactivate('posts'), Platform.NavigationEnd, expect.anything(), expect.anything());
            expect(navigationEndMiddleware).toBeCalledWith(staticMeta({ title: 'Posts' }), Platform.NavigationEnd, expect.anything(), expect.anything());

            router.navigateByUrl('/1');
            tick();
            expect(resolverMiddleware).toBeCalledWith(getActive('posts'), Platform.Resolver, expect.anything(), expect.anything());
            expect(navigationEndMiddleware).toBeCalledWith(staticMeta({ title: 'Post #1' }), Platform.NavigationEnd, expect.anything(), expect.anything());
        },
    )));

});
