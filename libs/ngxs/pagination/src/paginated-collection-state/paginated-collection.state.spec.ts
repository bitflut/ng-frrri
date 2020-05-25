import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CollectionReducer, NgxsMiddlewareModule } from '@ng-frrri/ngxs';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { PaginatedCollectionState, PaginatedCrudCollectionReducer, PaginationInterceptor } from '@ng-frrri/ngxs/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { Observable, of } from 'rxjs';
import { CollectionStateOptions } from '../../../src/libs/collection-state/colleciton-state-options.interface';
import { TestCrudCollection, TestCrudCollectionService } from '../../../src/libs/collection-state/collection.state.spec';
import { PaginatedCollectionOptions } from './paginated-collection-options.interface';
import { PaginatedCollectionService } from './paginated-collection-service.interface';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

export function TestPaginatedCrudCollection<T = CollectionReducer>(options: PaginatedCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = TestCrudCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = TestPaginatedCrudService;
        crudCollectionFn(target);
    };
}

@Injectable()
export class TestPaginatedCrudService<V = any> implements PaginatedCollectionService<V> {
    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number } = {}) { return of([]); }
    getAll(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number } = {}): Observable<V[]> { return of([]); }
    getNext(url: any) { return of([]); }
}

@TestPaginatedCrudCollection<PaginatedCrudCollectionReducer>({
    name: 'post',
})
@Injectable()
class PostsEntitiesState extends PaginatedCollectionState<Post, number> { }

describe('PaginatedCollectionState', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState]),
                NgxsMiddlewareModule.forRoot(),
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                    useClass: PaginationInterceptor,
                },
                TestPaginatedCrudService,
                TestCrudCollectionService,
            ],
        }).compileComponents();
    });

    it('should getMany', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        expect(postsState.paginatedServiceToken).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        expect(postsState.stateOptions).toBeDefined();
        const spy = spyOn(service, 'getMany').and.callThrough();
        postsState.getMany().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

    it('should getAll', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        const spy = spyOn(service, 'getAll').and.callThrough();
        postsState.getAll().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

    it('should getNext', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        const spy = spyOn(service, 'getNext').and.callThrough();
        postsState.getNext().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

});
