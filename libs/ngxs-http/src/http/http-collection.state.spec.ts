import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CollectionReducer, CollectionState, NgxsMiddlewareModule } from '@ng-frrri/ngxs';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { omit } from 'lodash';
import { HttpCollection } from './http-collection.decorator';
import { HttpCollectionModule } from './http-collection.module';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

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

const mongodbPostsData = [{
    userId: 1,
    _id: 1,
    body: 'Hello World',
    title: 'testing Angular',
}, {
    userId: 2,
    _id: 2,
    body: 'Hello World2',
    title: 'testing Angular2',
}];

const newPostData = {
    userId: 1,
    id: 101,
    body: 'Hello World',
    title: 'testing Angular',
};

@HttpCollection<CollectionReducer>({
    name: 'posts',
    baseUrl: 'https://jsonplaceholder.typicode.com',
})
@Injectable()
class PostsEntitiesState extends CollectionState<Post, number> {
    afterSuccess(data: Post | Post[]) { }
}

@HttpCollection<CollectionReducer>({
    name: 'mongodbPosts',
    idKey: '_id',
    baseUrl: 'https://jsonplaceholder.typicode.com',
})
@Injectable()
class MongodbPostsEntitiesState extends CollectionState<Post, number> { }

function getCollectionUrl(state: any) {
    return state.stateOptions.requestOptions.collectionUrlFactory();
}

describe('CollectionState', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HttpCollectionModule.forRoot(),
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState, MongodbPostsEntitiesState]),
                NgxsMiddlewareModule.forRoot(),
            ],
        }).compileComponents();
    });

    it('should getMany', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        expect(postsState.stateOptions.requestOptions.collectionUrlFactory).toBeDefined();
        postsState.getMany().toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('GET');
        req.flush(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);
    }));

    it('should getMany with different idKey', inject([
        HttpTestingController,
        MongodbPostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: MongodbPostsEntitiesState,
    ) => {
        expect(getCollectionUrl(postsState)).toBeDefined();
        expect(postsState.primaryKey).toEqual('_id');
        postsState.getMany().toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('GET');
        req.flush(mongodbPostsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);
    }));

    it('should getMany with params', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.getMany({ params: { myparam: 'myvalue' } }).toPromise();

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}?myparam=myvalue`);
        expect(req.request.method).toEqual('GET');
        req.flush(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);
    }));

    it('should set error.many and loading.many for getMany', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.getMany().toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('GET');
        expect(postsState.snapshot.loading.many).toBeTruthy();
        req.flush({}, { status: 400, statusText: 'Bad Request' });
        expect(postsState.snapshot.error.many).toEqual('Http failure response for https://jsonplaceholder.typicode.com/posts: 400 Bad Request');
        expect(postsState.snapshot.loading.many).toBeFalsy();
    }));

    it('should set error.one and loading.one for getOne', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.getOne(1).toPromise();

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('GET');
        expect(postsState.snapshot.loading.one).toBeTruthy();
        req.flush({}, { status: 400, statusText: 'Bad Request' });
        expect(postsState.snapshot.error.one).toEqual('Http failure response for https://jsonplaceholder.typicode.com/posts/1: 400 Bad Request');
        expect(postsState.snapshot.loading.one).toBeFalsy();
    }));

    it('should getOne', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.getOne(1).toPromise();

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('GET');
        req.flush(postsData[0]);
        expect(postsState.snapshot.ids).toEqual([1]);
    }));

    it('should postOne', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.postOne(omit(newPostData, 'id')).toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('POST');
        req.flush(newPostData, { status: 201, statusText: 'created' });
        expect(postsState.snapshot.ids).toEqual([101]);
    }));

    it('should postOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.postOneOptimistic(newPostData).toPromise();
        expect(postsState.snapshot.ids).toEqual([101]);

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('POST');
        req.flush(newPostData, { status: 201, statusText: 'created' });
        expect(postsState.snapshot.ids).toEqual([101]);
    }));

    it('should undo postOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.postOneOptimistic(newPostData).toPromise();
        expect(postsState.snapshot.ids).toEqual([101]);

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('POST');
        req.flush(newPostData, { status: 400, statusText: 'Bad Request' });
        expect(postsState.snapshot.ids).toEqual([]);
    }));

    it('should patchOne', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const update = { id: 1, changes: { body: 'I am changed' } };
        postsState.patchOne(update).toPromise();

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${update.id}`);
        expect(req.request.method).toEqual('PATCH');
        req.flush({ ...postsState[1], body: update.changes.body });
        expect(postsState.snapshot.entities[update.id].body).toEqual(update.changes.body);
    }));

    it('should patchOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const update = { id: 1, changes: { body: 'I am changed' } };
        postsState.patchOneOptimistic(update).toPromise();
        expect(postsState.snapshot.entities[1].body).toEqual(update.changes.body);

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${update.id}`);
        expect(req.request.method).toEqual('PATCH');
        req.flush({ ...postsState[1], body: update.changes.body });
        expect(postsState.snapshot.entities[update.id].body).toEqual(update.changes.body);
    }));

    it('should undo patchOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const update = { id: 1, changes: { body: 'I am changed' } };
        postsState.patchOneOptimistic(update).toPromise();
        expect(postsState.snapshot.entities[1].body).toEqual(update.changes.body);

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${update.id}`);
        expect(req.request.method).toEqual('PATCH');
        req.flush({}, { status: 400, statusText: 'Bad Request' });
        expect(postsState.snapshot.entities[update.id].body).toEqual(postsData[0].body);
    }));

    it('should deleteOne', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        postsState.deleteOne(1).toPromise();

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush({}, { status: 204, statusText: 'No Content' });
        expect(postsState.snapshot.ids).toEqual([2]);
    }));

    it('should deleteOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        postsState.deleteOneOptimistic(1).toPromise();
        expect(postsState.snapshot.ids).toEqual([2]);

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush({}, { status: 204, statusText: 'No Content' });
        expect(postsState.snapshot.ids).toEqual([2]);
    }));

    it('should undo deleteOneOptimistic', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        postsState.deleteOneOptimistic(1).toPromise();
        expect(postsState.snapshot.ids).toEqual([2]);

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush({}, { status: 400, statusText: 'Bad Request' });
        expect(postsState.snapshot.ids).toEqual([2, 1]);
    }));

    it('should setActive', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.setActive(postsData[0]);
        expect(postsState.snapshot.active).toEqual(postsData[0]);
        postsState.setActive(undefined);
        expect(postsState.snapshot.active).toEqual(undefined);
        postsState.setActive(postsData[1]);
        expect(postsState.snapshot.active).toEqual(postsData[1]);
        postsState.deactivate();
        expect(postsState.snapshot.active).toEqual(undefined);
    }));

    it('should getActive', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        postsState.getActive(1).toPromise();
        expect(postsState.snapshot.active).toEqual({ id: 1 });
        expect(postsState.snapshot.ids).toEqual([]);

        const req = httpMock.expectOne(`${getCollectionUrl(postsState)}/${1}`);
        expect(req.request.method).toEqual('GET');
        req.flush(postsData[0]);
        expect(postsState.snapshot.ids).toEqual([]);
        expect(postsState.snapshot.active.id).toEqual(1);
    }));

    it('should call afterSuccess', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        const spy = spyOn(postsState, 'afterSuccess');
        postsState.getMany().toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('GET');
        req.flush(postsData);

        expect(spy).toHaveBeenCalled();
    }));

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));

});
