import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../../enums/operator-type.enum';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { CrudOperatorOptions } from '../interfaces/crud-operator-options.interface';

export interface GetOneOptions extends CrudOperatorOptions {
    /** Key in route.params containing the id to resolve (default: `'id'`) */
    param?: string;
}

export function getOne(
    statePath: string,
    options: GetOneOptions = {},
) {
    options = {
        ...crudOperatorDefaults,
        param: 'id',
        ...options,
    };

    return {
        type: OperatorType.GetOne as OperatorType.GetOne,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    };
}
