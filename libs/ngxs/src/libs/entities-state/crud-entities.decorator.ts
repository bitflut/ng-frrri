import { StateRepository } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';

export function CrudEntities<T>(options: StoreOptions<T>) {
    const stateFn = State(options);
    const stateRepositoryFn = StateRepository();
    return function (target: StateClass) {
        stateFn(target);
        stateRepositoryFn(target);
    };
}
