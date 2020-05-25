import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../enums/operator-type.enum';

let index = -1;

export interface StaticBreadcrumbOptions {
    title: string;
    url?: string;
}

export function staticBreadcrumb(
    options: StaticBreadcrumbOptions,
) {
    index++;
    return {
        type: OperatorType.StaticBreadcrumb as OperatorType.StaticBreadcrumb,
        id: `static-${index}`,
        platforms: [Platform.NavigationEnd],
        ...options,
    };
}
