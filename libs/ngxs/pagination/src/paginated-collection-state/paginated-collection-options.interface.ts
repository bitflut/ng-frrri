import { CollectionOptions } from '@ng-frrri/ngxs';

export interface PaginatedCollectionOptions<T> extends CollectionOptions<T> {
    size?: number;
}
