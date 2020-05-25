import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { NgxsMiddlewareModule } from '@ng-frrri/ngxs';
import { HttpCollectionModule, PaginatedHttpCollection } from '@ng-frrri/ngxs-http';
import { GetManyOptions } from '@ng-frrri/ngxs/internal';
import { PaginatedCollectionState, PaginationInterceptor } from '@ng-frrri/ngxs/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { PaginatedCollectionService } from './paginated-collection-service.interface';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}


@Injectable()
export class TestPaginatedCrudService<V = any> implements PaginatedCollectionService<V> {
    getMany(stateOptions: any, options: GetManyOptions & { size?: number } = {}) { return of([]); }
    getAll(stateOptions: any, options: GetManyOptions & { size?: number } = {}): Observable<V[]> { return of([]); }
    getNext(url: any) { return of([]); }
}

@PaginatedHttpCollection({
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
                HttpCollectionModule.forRoot(),
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                    useClass: PaginationInterceptor,
                },
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
