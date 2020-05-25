import { InjectionToken } from '@angular/core';
import { CollectionOptions } from './collection-options.interface';

export type CollectionOptionsProvider = Partial<Pick<CollectionOptions, 'baseUrl' | 'defaults' | 'idKey' | 'requestOptions' | 'endpoint'>>;
export const COLLECTION_OPTIONS_TOKEN = new InjectionToken<CollectionOptionsProvider>('CRUD_COLLECTION_OPTIONS_TOKEN');
