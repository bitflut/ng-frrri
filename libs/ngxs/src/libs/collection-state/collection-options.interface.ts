import { EntityIdType } from '@ngxs-labs/data/typings';
import { StoreOptions } from '@ngxs/store/src/symbols';

interface CrudCollectionRequestOptions<IdType = EntityIdType> {
    delay?: number;
    timeout?: number;
    /**
     * Defaults to `() => \`${baseUrl}/${endpoint}\``
     */
    collectionUrlFactory?: () => string;
    /**
     * Defaults to `id => \`${baseUrl}/${endpoint}/${id}\``
     */
    resourceUrlFactory?: (id: IdType) => string;
    /**
     * Used to add query params when populating
     */
    populateFactory?: (ids: IdType[], path: string) => { [key: string]: string | string[] };
}

export interface CollectionOptions<T = any> extends StoreOptions<T> {
    // Defaults to `/api`
    baseUrl?: string;
    // Defaults to `CrudCollection.name`
    endpoint?: string;
    // Defaults to `id`
    idKey?: string;
    requestOptions?: CrudCollectionRequestOptions<T>;
}
