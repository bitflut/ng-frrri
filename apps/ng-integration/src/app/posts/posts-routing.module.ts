import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { frrri, operate } from '@ng-frrri/router-middleware';
import { activeBreadcrumb, activeMeta, getActive, getMany, populate, reset, staticBreadcrumb, staticMeta } from '@ng-frrri/router-middleware/operators';
import { PostsIndexComponent } from './posts-index/posts-index.component';
import { PostsShowComponent } from './posts-show/posts-show.component';

const all = 'entities';
const posts = 'entities.posts';
const comments = 'entities.comments';
const users = 'entities.users';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
    },
    {
        path: 'all',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                getActive(posts),
            ),
        }],
    },
    {
        path: 'with-breadcrumbs',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts),
            staticBreadcrumb({ title: 'all posts' }),
            staticMeta({ title: 'All posts ' }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                getActive(posts),
                activeBreadcrumb(posts, {
                    factory: data => ({ title: `#${data.id} ${data.title}` }),
                }),
                activeMeta(posts, {
                    factory: data => ({ title: `#${data.id} ${data.title}` }),
                }),
            ),
        }],
    },
    {
        path: 'await',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts, { await: true }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                reset(comments),
                populate({
                    from: posts,
                    to: comments,
                    idPath: 'postId',
                    idSource: comments,
                }),
                getActive(posts, { await: true }),
            ),
        }],
    },
    {
        path: 'paginated',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts, { params: { _page: '1', _limit: '5' } }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                getActive(posts),
            ),
        }],
    },
    {
        path: 'with-comments',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts, { params: { _page: '1', _limit: '5' } }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                reset(comments),
                populate({
                    from: posts,
                    to: comments,
                    idPath: 'postId',
                    idSource: comments,
                }),
                getActive(posts),
            ),
        }],
    },
    {
        path: 'with-user',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            populate({
                from: posts,
                to: users,
                idPath: 'userId',
                idSource: posts,
            }),
            getMany(posts, { params: { _page: '1', _limit: '5' } }),
            staticMeta({ title: 'Posts with user' }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                reset(comments),
                populate({
                    from: posts,
                    to: comments,
                    idPath: 'postId',
                    idSource: comments,
                }),
                populate({
                    from: posts,
                    to: users,
                    idPath: 'userId',
                    idSource: posts,
                }),
                getActive(posts),
                activeMeta(posts, {
                    factory: data => ({ title: data.title }),
                }),
            ),
        }],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(
            frrri(routes),
        ),
    ],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
