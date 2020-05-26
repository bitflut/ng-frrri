import { Routes } from '@angular/router';
import { DeactivatedPlatform } from './platforms/deactivated.platform';
import { ResolverPlatform } from './platforms/resolver.platform';

export function frrri(
    routes: Routes,
): Routes {
    return routes.map(route => {
        route.resolve = {
            ['FRRRI']: ResolverPlatform,
            ...route.resolve,
        };

        route.canDeactivate = [
            DeactivatedPlatform,
            ...(route.canDeactivate || []),
        ];

        route.children = route.children
            ? frrri(route.children)
            : undefined;

        return route;
    });
}
