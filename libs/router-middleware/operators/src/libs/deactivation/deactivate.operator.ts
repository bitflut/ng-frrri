import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../enums/operator-type.enum';

export function deactivate(
    statePath: string,
) {
    return {
        type: OperatorType.Deactivate as OperatorType.Deactivate,
        statePath,
        platforms: [Platform.NavigationEnd],
    };
}
