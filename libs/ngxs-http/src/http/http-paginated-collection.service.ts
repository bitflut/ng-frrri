import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { CollectionStateOptions } from '@ng-frrri/ngxs';
import { PaginatedCollectionService, Paginated } from '@ng-frrri/ngxs/pagination';

@Injectable({
    providedIn: 'root',
})
export class PaginatedHttpCollectionService<V = any> implements PaginatedCollectionService<V> {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number } = {}) {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

    getAll(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number } = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.getManyWithUrl(url, options).pipe(
            expand(response => {
                let next = response.pagination?.next;
                if (!next) { return EMPTY; }

                const isUrlWith = next.startsWith('http');
                if (!isUrlWith) {
                    const baseUrl = url.match(/^(https?:\/\/[^\/]+)\//)[1];
                    next = `${baseUrl}${next}`;
                }

                return this.getManyWithUrl(next);
            }),
            reduce((acc, res) => {
                return [
                    ...acc,
                    ...res.pagination.data,
                ];
            }, [] as V[]),
        );
    }

    getNext(url: any) {
        return this.http.get<Paginated<V[]>>(url);
    }

    private getManyWithUrl(url: string, options: GetManyOptions & { size?: number } = {}): Observable<Paginated<V[]>> {
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

}
