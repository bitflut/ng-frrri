# Crud Entities

LYXS is designed to cache a copy of all entities needed by your current route to render. In order to decouple all actions from the rest of your reducers, **we strongly suggest you give your CrudCollections a parent state extending** **CrudEntities**.

```typescript
@CrudCollection({
    name: 'posts'
})
export class PostsState extends CrudCollectionState { }

@CrudEntities({
    name: 'entities',
    children: [PostsState]
})
export class EntitiesState extends CrudEntitiesState { }
```

This enables resetting all your children's states at once by calling `EntitiesState.reset()` .

### State paths

Every state in NGXS has a path. The path is set by the name property in your states decorator. States can be nested by adding them to the children array of a state. LYXS inherits this behaviour.

This allows LYXS to access states simply by specifying the path, instead of having to hard code injections everywhere.

In the example code above, the path of **PostsState** will be `entities.posts` because it is a child of the **EntitiesState**.





