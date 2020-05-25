import { StateRepository } from '@ngxs-labs/data/decorators';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { State } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { CollectionReducer, CollectionOptions, CollectionStateOptions } from '@ng-frrri/ngxs';
import { HttpCollectionService } from './http-collection.service';

export function HttpCollection<T = CollectionReducer>(options: CollectionOptions<T>) {
    options = {
        ...options,
        baseUrl: options.baseUrl ?? '/api',
        endpoint: options.endpoint ?? options.name.toString(),
        defaults: {
            ...createEntityCollections(),
            active: undefined,
            loaded: false,
            loading: {},
            error: {},
            ...options.defaults,
        },
    } as CollectionOptions<T>;

    const stateFn = State(options);
    const stateRepositoryFn = StateRepository();
    return function (target: StateClass) {
        stateFn(target);
        stateRepositoryFn(target);
        target.prototype.serviceToken = HttpCollectionService;

        const stateOptions = {
            requestOptions: options.requestOptions,
            endpoint: options.endpoint!,
            baseUrl: options.baseUrl!,
        } as CollectionStateOptions;
        if (options.idKey) {
            stateOptions.idKey = options.idKey!;
        }
        target.prototype.stateOptions = stateOptions;
    };
}
