import { FRRRI_OPERATIONS } from '../constants';

export function operate(...operators: any) {
    return {
        [FRRRI_OPERATIONS]: operators,
    };
}
