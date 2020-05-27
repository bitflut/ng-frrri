# Introduction

## 🏎️ 🏎️ @ng-frrri/router-middleware 🏎️ 🏎️

> Data flow at 250 MPH

### Synopsis

We have many years of experience building and reviewing enterprise applications using Angular. Most applications communicate with CRUD APIs and use state management patterns for their UIs, preferably with [@ngrx](https://ngrx.io/), [@ngxs](https://www.ngxs.io/) or [Akita](https://netbasal.gitbook.io/akita/).

We were able to reduce a lot of boilerplate code with [@ngrx/data](https://ngrx.io/guide/data), but the way data was fetched and displayed was still hard to figure out reading these applications. We needed to look through reducers, effects, resolvers and components in order to understand how data is flowing to the UI.

Ideally, we figured, you should be able to define an application's data flow simply by looking at the routes. So we came up with a data flow pattern that hooks into Angular's router \(and a silly name\). Here is **@ng-frrri/router-middleware**.

### What it looks like:

```typescript
import { operate } from '@ng-frrri/router-middleware';
import { getMany, getActive, reset } from '@ng-frrri/router-middleware/operators';

const all = 'entities';
const posts = 'entities.posts';

const routes: Routes = frrri(
    [
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
    ]
);

```

