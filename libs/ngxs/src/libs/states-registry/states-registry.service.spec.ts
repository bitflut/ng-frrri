import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CollectionState, CrudEntities, CrudEntitiesState } from '@ng-frrri/ngxs';
import { PaginatedCollectionState } from '@ng-frrri/ngxs/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { NgxsMiddlewareModule } from '../../ngxs-middleware.module';
import { TestCrudCollection, TestCrudCollectionService } from '../collection-state/collection.state.spec';
import { StatesRegistryService } from './states-registry.service';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@TestCrudCollection({
    baseUrl: 'https://jsonplaceholder.typicode.com/posts',
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends CollectionState<Post, number> { }

interface Comment {
    postId: number;
    id: number;
    name: string;
    body: string;
    email: string;
}

@TestCrudCollection({
    name: 'comments',
    baseUrl: 'https://jsonplaceholder.typicode.com/comments',
})
@Injectable()
class CommentsEntitiesState extends CollectionState<Comment, number> { }

@CrudEntities({
    name: 'cache',
    defaults: {},
    children: [PostsEntitiesState, CommentsEntitiesState],
})
@Injectable()
class EntityCrudEntitiesState extends CrudEntitiesState<any> { }

const postsData = [{
    userId: 1,
    id: 1,
    body: 'Hello World',
    title: 'testing Angular',
}, {
    userId: 2,
    id: 2,
    body: 'Hello World2',
    title: 'testing Angular2',
}];

@TestCrudCollection({
    name: 'users',
    baseUrl: 'https://jsonplaceholder.typicode.com/users',
})
@Injectable()
class UsersEntitiesState extends CollectionState<Comment, number> { }


@NgModule({
    imports: [
        NgxsModule.forFeature([UsersEntitiesState]),
    ],
})
class FeatureModule { }

describe('StatesRegistry', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                NgxsModule.forRoot([EntityCrudEntitiesState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                NgxsMiddlewareModule.forRoot(),
                FeatureModule,
            ],
            providers: [TestCrudCollectionService],
        });
    });

    it('should register states', inject([
        PostsEntitiesState,
        EntityCrudEntitiesState,
        StatesRegistryService,
    ], (
        postsState: PostsEntitiesState,
        entityCrudEntitiesState: EntityCrudEntitiesState,
        collectionRegistry: StatesRegistryService<PaginatedCollectionState>,
    ) => {
        expect(collectionRegistry.getByPath('cache.posts').stateOptions.requestOptions.collectionUrlFactory).toBeDefined();
        expect(postsState).toBe(collectionRegistry.getByPath('cache.posts'));
        expect(entityCrudEntitiesState).toBe(collectionRegistry.getByPath('cache'));
    }));

    it('should reset all states', inject([
        StatesRegistryService,
        TestCrudCollectionService,
    ], async (
        collectionRegistry: StatesRegistryService<PaginatedCollectionState>,
        service: TestCrudCollectionService,
    ) => {
        const postsState = collectionRegistry.getByPath('cache.posts');
        expect(postsState).toBeDefined();
        spyOn(service, 'getMany').and.returnValue(of(postsData));
        postsState.getMany().toPromise();
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const cacheState = collectionRegistry.getByPath('cache');
        cacheState.reset();
        expect(postsState.snapshot.ids).toEqual([]);
    }));

    it('should get UserEntitiesState', inject([
        StatesRegistryService,
    ], async (
        collectionRegistry: StatesRegistryService,
    ) => {
        expect(collectionRegistry.getByPath('users')).toBeDefined();
    }));

});
