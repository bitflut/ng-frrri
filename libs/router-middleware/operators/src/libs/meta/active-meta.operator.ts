import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../enums/operator-type.enum';
import { StaticMetaOptions } from './static-meta.operator';

export interface ActiveMetaOptions<T> {
    factory: (data: T) => StaticMetaOptions;
}

export function activeMeta<T = any>(
    statePath: string,
    options: ActiveMetaOptions<T>,
) {
    return {
        type: OperatorType.ActiveMeta as OperatorType.ActiveMeta,
        statePath,
        platforms: [Platform.NavigationEnd],
        ...options,
    };
}
