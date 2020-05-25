import { CollectionOptions } from './collection-options.interface';

export interface CollectionStateOptions {
    requestOptions: CollectionOptions['requestOptions'];
    idKey?: string;
    baseUrl?: string;
    endpoint?: string;
    populateFactory: CollectionOptions['requestOptions']['populateFactory'];
}
