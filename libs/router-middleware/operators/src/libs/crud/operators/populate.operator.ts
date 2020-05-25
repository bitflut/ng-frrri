import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../../enums/operator-type.enum';

export function populate(
    options: {
        /** State path that triggers a population */
        from: string,
        /** State path getting populated */
        to: string,
        /** Path of id property */
        idPath?: string,
        /** State path of collection containing id (foreign vs self) */
        idSource?: string,
        /** Optionally set operations like OperationContext.Many for population */
        operations?: Array<string | number>,
        /** Params passed to request */
        params?: { [key: string]: string | string[] };
        /**
         * Used to map ids to getMany params when populating.
         * Default:
         * ```
         * (ids: IdType[], path: string) => {
         *     return {
         *          [`filter[${path}][$in]`]: uniq(ids),
         *     }
         * }
         * ```
         */
        factory?: (ids: Array<string | number>, path: string) => any;
    },
) {
    return {
        type: OperatorType.Populate as OperatorType.Populate,
        statePath: options.from,
        toStatePath: options.to,
        idPath: options.idPath ?? 'id',
        idSource: options.idSource ?? options.from,
        platforms: [Platform.Resolver],
        factory: options.factory,
        params: options.params,
        operations: options.operations,
    };
}
