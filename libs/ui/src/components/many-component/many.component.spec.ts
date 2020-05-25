import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CollectionState, CrudEntities, CrudEntitiesState, NgxsMiddlewareModule } from '@ng-frrri/ngxs';
import { PaginatedCollectionState, PaginationInterceptor } from '@ng-frrri/ngxs/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { MockRender } from 'ng-mocks';
import { Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { TestPaginatedCollection, TestPaginatedCrudService } from '../../../../ngxs/pagination/src/paginated-collection-state/paginated-collection.state.spec';
import { TestCrudCollection, TestCrudCollectionService } from '../../../../ngxs/src/libs/collection-state/collection.state.spec';
import { ManyComponent } from './many.component';
import { ManyUiModule } from './many.module';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@TestPaginatedCollection({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends PaginatedCollectionState<Post, number> { }

interface Comment {
    postId: number;
    id: number;
    name: string;
    body: string;
    email: string;
}

@TestCrudCollection({
    name: 'comments',
    baseUrl: 'https://jsonplaceholder.typicode.com',
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

const page1Data = {
    body: [{
        userId: 1,
        id: 1,
        body: 'Hello World',
        title: 'testing Angular',
    }, {
        userId: 2,
        id: 2,
        body: 'Hello World2',
        title: 'testing Angular2',
    }],
    headers: {
        Link: '</api/v1/admin/posts/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5e4d2901871f09a8d0fc4bef>; rel="next"',
    },
};

const page2Data = {
    body: [{
        userId: 1,
        id: 3,
        body: 'Hello World3',
        title: 'testing Angular3',
    }, {
        userId: 2,
        id: 4,
        body: 'Hello World4',
        title: 'testing Angular4',
    }],
    headers: {
        Link: '</api/v1/admin/stores/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5cffc130c82fe51c5afe0a9e>; rel="next"',
    },
};

const page3Data = {
    body: [{
        userId: 1,
        id: 5,
        body: 'Hello World3',
        title: 'testing Angular3',
    }],
    headers: {},
};

describe('ManyComponent', () => {
    let component: ManyComponent;
    let fixture: ComponentFixture<ManyComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([EntityCrudEntitiesState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                NgxsMiddlewareModule.forRoot(),
                ManyUiModule,
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

        fixture = MockRender(`
            <frrri-many path="cache.posts">
                My content
                <div class="loading">mock-loading</div>
                <div class="loading-first">mock-first-load</div>
                <div class="load-more">mock-more</div>
            </frrri-many>
        `);

        component = fixture.debugElement
            .query(By.directive(ManyComponent))
            .componentInstance as ManyComponent;
    });

    it('should create and initialize', async () => {
        expect(component).toBeTruthy();
        const loading = await component.loading$.pipe(take(1)).toPromise();
        expect(loading).toBeFalsy();
    });

    it('should show contents correctly', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsEntities: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        // INIT
        expect(fixture.nativeElement.textContent.trim()).toEqual('My content');
        expect(fixture).toMatchSnapshot('init');
        const subject = new Subject();

        // PAGE 1/3
        spyOn(service, 'getMany').and.returnValue(subject.asObservable());
        postsEntities.getMany().toPromise();

        // PAGE 1/3 - LOADING FIRST
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot('loading-page-1-of-3');

        // // PAGE 1/3 - LOADED
        subject.next({ pagination: { data: page1Data.body, next: page1Data.headers.Link } });
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot('loaded-page-1-of-3');

        // // PAGE 2/3
        spyOn(service, 'getNext').and.returnValue(subject.asObservable());
        postsEntities.getNext().toPromise();

        fixture.detectChanges();

        // // PAGE 2/3 - LOADING
        expect(fixture).toMatchSnapshot('loading-page-2-of-3');
        subject.next({ pagination: { data: page2Data.body, next: page2Data.headers.Link } });
        fixture.detectChanges();

        // // PAGE 2/3 LOADED
        expect(fixture).toMatchSnapshot('loaded-page-2-of-3');

        // // PAGE 3/3 (LAST PAGE)
        postsEntities.getNext().toPromise();
        fixture.detectChanges();

        // // PAGE 3/3 LOADING
        expect(fixture).toMatchSnapshot('loading-page-3-of-3');
        subject.next({ pagination: { data: page3Data.body } });
        fixture.detectChanges();

        // // PAGE 3/3 LOADED
        expect(fixture).toMatchSnapshot('loaded-page-3-of-3');
    }));

    it('should show errors', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsEntities: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        // INIT
        expect(fixture.nativeElement.textContent.trim()).toEqual('My content');
        expect(fixture).toMatchSnapshot('init');
        const subject = new Subject();

        // PAGE 1/3
        spyOn(service, 'getMany').and.returnValue(subject.asObservable().pipe(
            tap((data) => {
                if (data === 'error') {
                    throw new Error('Http failure response for https://jsonplaceholder.typicode.com/posts: 400 Bad Request');
                }
            }),
        ));
        postsEntities.getMany().toPromise();
        fixture.detectChanges();

        // PAGE 1/3 - LOADING FIRST
        expect(fixture).toMatchSnapshot('loading-page-1-of-3');
        subject.next('error');
        fixture.detectChanges();

        // PAGE 1/3 - ERROR
        expect(fixture).toMatchSnapshot('error-page-1-of-3');
    }));

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));
});
