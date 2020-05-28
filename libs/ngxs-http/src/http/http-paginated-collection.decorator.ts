import { CollectionReducer } from '@ng-frrri/ngxs';
import { PaginatedCollectionOptions } from '@ng-frrri/ngxs/pagination';
import { StateClass } from '@ngxs/store/internals';
import { HttpCollection } from './http-collection.decorator';
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
