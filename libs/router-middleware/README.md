# FRRRI

> Angular at 250 MPH

## @ng-frrri/router-middleware

See [Quick start](https://bitflut.gitbook.io/frrri/) for minimal setup instructions.

## DSL

```typescript
import { operate } from '@ng-frrri/router-middleware';
import { getMany } from '@ng-frrri/router-middleware/operators';

const all = 'entities';
const posts = 'entities.posts';
const comments = 'entities.comments';
const users = 'entities.users';

const routes: Routes = [
    {
        path: 'posts',
        data: operate(
            reset(all),
            getMany(posts),
            setMeta({ title: 'Posts' }),
            setBreadcrumb({ title: 'Posts' }),
        ),
        children: [
            {
                path: ':id',
                data: operate(
                    getActive(posts),
                    populate({
                        from: posts,
                        to: comments,
                        id: 'postId',
                        idSource: comments,
                    ),
                    populate({
                        from: comments,
                        to: users,
                        id: 'userId',
                        idSource: comments,
                    ),
                    activeMeta(posts, {
                        factory: post => ({ title: post.title }),
                    }),
                    activeBreadcrumb(posts, {
                        factory: post => ({ title: post.title }),
                    }),
                ),
            },
        ],
    },
];
```

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
