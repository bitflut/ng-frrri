import { Platform } from '@ng-frrri/router-middleware/internal';

export interface Operator<T = any> {
    /**
     * Defines in which middlewares this operator will run
     */
    platforms: Platform[];
    options: T;
}
