# Installation

## Getting started

Install @ng-frrri/ngxs-crud and its peer dependencies.

```bash
# @ng-frrri/ngxs-crud
npm install @ng-frrri/ngxs-crud --save

# dependencies
npm install @ngxs/store @ngxs-labs/data --save
```

Set up NgxsModule**,** NgxsDataPluginModule, and HttpClientModule in `app.module.ts` 

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { EntitiesState } from './entities.state'; // <-- we will add this next
import { PostsState } from './posts.state'; // <-- we will add this next

@NgModule({
  imports: [
    HttpClientModule,
    NgxsModule.forRoot([EntitiesState, PostsState], {
      developmentMode: !environment.production
    }),
    NgxsDataPluginModule.forRoot(),
  ]
})
export class AppModule {}
```

Now add a **CrudEntitiesState** \(acting as a parent to your entities\) and your first **CrudCollectionState**:

{% tabs %}
{% tab title="entities.state.ts" %}
```typescript
import { PoststState } from './posts.state';

@CrudEntities({
    name: 'entities',
    children: [PostsState]
})
export class EntitiesState extends CrudEntitiesState { }
```
{% endtab %}

{% tab title="posts.state.ts" %}
```typescript
@CrudCollection({
    name: 'posts'
})
export class PostsState extends CrudCollectionState { }
```
{% endtab %}
{% endtabs %}

In your `app.component.ts` you can retrieve data from your API:

{% hint style="info" %}
We recommend using [Routing Instructions](routing-instructions.md) to resolve data instead of calling posts.getMany\(\) directly in your components.
{% endhint %}

```typescript
import { Store } from '@ngxs/store';
import { PostsState } from './posts.state';

@Component({ ... })
export class AppComponent {
  constructor(private posts: PostsState) {}

  getPosts(name: string) {
    this.posts.getMany().toPromise();
  }
}
```

