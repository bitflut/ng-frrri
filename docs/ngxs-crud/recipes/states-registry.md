# States Registry

As you might have noticed by now, [routing instructions](../usage/routing-instructions.md) and [ui components](../usage/ui-components/) use state paths to specify a collection.

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

The **PostsState** collection can now be access via the path `entities.posts`. Retrieving the correct state is handled by the **StatesRegistryService**.

### StatesRegistryService

The service exposes a function called `getByPath(path: string)` that lets you retrieve states via their path mapping. The mapping is automatically generated via the **name attribute** in the decorator options. Nesting is performed by the **children array** in the decorator options.

```typescript
import { StatesRegistryService } from '@ng-frrri/ngxs-crud/registry';

@Component(...)
export class AppComponent {

    constructor(private registry: StatesRegistryService) {
        const entitiesState = this.registry.getByPath<EntitiesState>('entities');
        const postsState = this.registry.getByPath<PostsState>('entities.posts');
        ...
    }

}
```



