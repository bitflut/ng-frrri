import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../../enums/operator-type.enum';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { CrudOperatorOptions } from '../interfaces/crud-operator-options.interface';

export function getMany(
    statePath: string,
    options: {
        /** Params passed to getMany */
        params?: { [key: string]: string | string[] };
    } & CrudOperatorOptions = {},
) {
    options = {
        ...crudOperatorDefaults,
        params: {},
        ...options,
    };

    return {
        type: OperatorType.GetMany as OperatorType.GetMany,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    };
}
