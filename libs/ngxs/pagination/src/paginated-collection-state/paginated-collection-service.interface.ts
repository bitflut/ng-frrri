import { CollectionStateOptions } from '@ng-frrri/ngxs';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { Observable } from 'rxjs';

export interface PaginatedCollectionService<V = any> {
    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number });
    getAll(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number }): Observable<V[]>;
    getNext(url: string);
}

export interface Paginated<T = {}> {
    pagination: {
        data: T,
        next: string,
    };
}
