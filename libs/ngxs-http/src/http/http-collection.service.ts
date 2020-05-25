import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { Observable } from 'rxjs';
import { CollectionService, CollectionStateOptions } from '@ng-frrri/ngxs';

@Injectable({
    providedIn: 'root',
})
export class HttpCollectionService<V = any, IdType = any> implements CollectionService<V, IdType> {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getOne(stateOptions: CollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.get<V>(url);
    }

    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<V[]>(url, { params: options.params });
    }

    patchOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.patch<V>(url, changes);
    }

    putOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.put<V>(url, changes);
    }

    deleteOne(stateOptions: CollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.delete<void>(url);
    }

    postOne(stateOptions: CollectionStateOptions, body: Partial<V>): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.post<V>(
            url,
            body,
        );
    }

}
