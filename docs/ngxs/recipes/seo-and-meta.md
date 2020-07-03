# SEO & Meta

`staticMeta()` and `dynamicMeta()` operators makes adding meta data to you routes easy and if needed, resource bound. This is very useful for optimising your app for search engines. There are two options for adding meta data to your routes.

## **Static meta**

You can add a `staticMeta` operator to your route by supplying static strings. You can define `title`, `keywords`, `descriptions` and `image` per route.

```typescript
const routes: Routes = [
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
                operations: [OperationContext.Many],
            }),
            getMany(posts, { params: { _page: '1', _limit: '5' } }),
            staticMeta({ 
                title: 'Posts with user',
                description: 'Look at posts composed by users.',
             }),
        ),
];
```

## Active meta

The `activeMeta()` operator adds meta data to your route by using the active entity of the collection provided via statePath. It exposes a factory function passing the active entity as an argument.

```typescript
const routes: Routes = [
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
                operations: [OperationContext.Many],
            }),
            getMany(posts, { params: { _page: '1', _limit: '5' } }),
            activeMeta(posts, {
                factory: data => ({ title: data.title, keywords: data.tags, }),
            }),
        ),
    },
]
```

