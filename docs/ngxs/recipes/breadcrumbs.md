# Breadcrumbs

Similar to [`activeMeta()`](seo-and-meta.md#active-meta) and [`staticMeta()`](seo-and-meta.md#static-meta) operators,  there are `staticBreadcrumbs()` and `activeBreadcrumbs()` operators available. See the following example code for usage.

```typescript
const routes: Routes = [
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
];
```

