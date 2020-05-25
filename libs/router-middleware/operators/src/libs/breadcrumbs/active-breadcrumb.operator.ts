import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../enums/operator-type.enum';
import { StaticBreadcrumbOptions } from './static-breadcrumb.operator';

let index = -1;

interface ActiveOptions<T> {
    factory: (data: T) => StaticBreadcrumbOptions;
}

export function activeBreadcrumb<T = any>(
    statePath: string,
    options: ActiveOptions<T>,
) {
    index++;
    return {
        type: OperatorType.ActiveBreadcrumb as OperatorType.ActiveBreadcrumb,
        id: `active-${index}`,
        statePath,
        platforms: [Platform.NavigationEnd],
        ...options,
    };
}
