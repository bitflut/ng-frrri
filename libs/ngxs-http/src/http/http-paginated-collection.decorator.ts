import { CollectionReducer } from '@ng-frrri/ngxs';
import { HttpCollection } from './http-collection.decorator';
import { StateClass } from '@ngxs/store/internals';
import { PaginatedCollectionOptions } from '@ng-frrri/ngxs/pagination';
import { PaginatedHttpCollectionService } from './http-paginated-collection.service';

export function PaginatedHttpCollection<T = CollectionReducer>(options: PaginatedCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = HttpCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = PaginatedHttpCollectionService;
        crudCollectionFn(target);
    };
}
