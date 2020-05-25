import { Routes } from '@angular/router';
import { ResolverPlatform } from './platforms/resolver.platform';

export function frrri(
    routes: Routes,
): Routes {
    return routes.map(route => {
        route.resolve = {
            ['FRRRI']: ResolverPlatform,
            ...route.resolve,
        };

        route.children = route.children
            ? frrri(route.children)
            : undefined;

        return route;
    });
}
