import { OperationContext } from '@ng-frrri/ngxs/internal';
import { Observable } from 'rxjs';

export interface AfterSuccess<Entity = any> {

    /** Will run after every successful operation */
    afterSuccess(data: Entity | Entity[], operation: OperationContext): void | Observable<any>;

}
