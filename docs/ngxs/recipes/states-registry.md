# States Registry



As you might have noticed by now, we use [state paths](../../concept.md#1-states-registry) to specify a collection.

```typescript
@HttpCollection({
    name: 'posts'
})
export class PostsState extends CollectionState { }

@CrudEntities({
    name: 'entities',
    children: [PostsState]
})
export class EntitiesState extends CrudEntitiesState { }
```

The **PostsState** collection can now be access via the path `entities.posts`. Retrieving the correct state is handled by the **StatesRegistryService**.

## StatesRegistryService

The service exposes a function called `getByPath(path: string)` that lets you retrieve states via their path mapping. The mapping is automatically generated via the **name attribute** in the decorator options. Nesting is performed by the **children array** in the decorator options.

```typescript
import { FRRRI_STATES_REGISTRY, StatesRegistry } from '@ng-frrri/router-middleware';

@Component(...)
export class AppComponent {

    constructor(
        @Optional() @Inject(FRRRI_STATES_REGISTRY) private statesRegistryService: StatesRegistry,
    ) {
        const entitiesState = this.registry.getByPath<EntitiesState>('entities');
        const postsState = this.registry.getByPath<PostsState>('entities.posts');
        ...
    }

}
```

