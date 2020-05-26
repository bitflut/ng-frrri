# Introduction

## 🏎🏎🏎🏎

**@ng-frrri** \(the racing car\)
> Data flow at 250 MPH

## @ng-frrri/router-middleware

### Synopsis

We have many years of experience working as external code reviewers for startups using Angular. Most applications communicate with apis and use state management patterns for their uis, preferrably via @ngrx, @ngxs or Akita. We were able to reduce a lot of boilerplate code with *@ngrx/data*, but the way data is fetched and displayed was still quite hard to figure out. We needed to look through reducers, resolvers and components in order to understand how data is flowing. So a very simple problem had many different solutions in code bases we saw.

Ideally, we figured, you should be able to read an application's data flow simply by looking at the routes. So we came up with a data flow pattern, solutions to hook into Angular's router and a silly name. Here is @ng-frrri/router-middleware.

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
