import { Platform } from '@ng-frrri/router-middleware/internal';
import { OperatorType } from '../../enums/operator-type.enum';

export function reset(
    statePath: string,
) {
    return {
        type: OperatorType.Reset as OperatorType.Reset,
        statePath,
        platforms: [Platform.Resolver],
    };
}
