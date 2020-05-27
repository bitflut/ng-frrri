# Introduction

## 🏎️ 🏎️ @ng-frrri 🏎️ 🏎️

> Data flow at 250 MPH

## @ng-frrri/router-middleware

### Synopsis

We have many years of experience working as external code reviewers for enterprise applications using Angular. Most applications communicate with apis and use state management patterns for their UIs, preferably with [@ngrx](https://ngrx.io/), [@ngxs](https://www.ngxs.io/) or [Akita](https://netbasal.gitbook.io/akita/).

We were able to reduce a lot of boilerplate code with [@ngrx/data](https://ngrx.io/guide/data), but the way data was fetched and displayed was still hard to figure out in most applications. We needed to look through reducers, resolvers and components in order to understand how data is flowing.

Ideally, we figured, you should be able to read an application's data flow simply by looking at the routes. So we came up with a data flow pattern solution that hooks into Angular's router \(and a silly name\). Here is **@ng-frrri/router-middleware**.

### What it looks like:

```typescript
import { operate } from '@ng-frrri/router-middleware';
import { getMany, getActive, reset } from '@ng-frrri/router-middleware/operators';

const all = 'entities';
const posts = 'entities.posts';

const routes: Routes = [
    {
        path: 'posts',
        data: operate(
            reset(all),
            getMany(posts),
        ),
        children: [
            {
                path: ':id',
                data: operate(
                    getActive(posts),
                ),
            },
        ],
    },
];
```

