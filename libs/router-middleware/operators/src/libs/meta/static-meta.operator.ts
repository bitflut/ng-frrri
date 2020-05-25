import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../enums/operator-type.enum';

export interface StaticMetaOptions {
    title?: string;
    keywords?: string;
    description?: string;
    image?: string;
}

export function staticMeta(
    options: StaticMetaOptions = {},
) {
    return {
        type: OperatorType.StaticMeta as OperatorType.StaticMeta,
        platforms: [Platform.NavigationEnd],
        ...options,
    };
}
