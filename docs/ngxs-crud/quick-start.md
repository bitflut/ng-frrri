# Quick start

To get started, install @ng-frrri/ngxs-crud and its peer dependencies.

```bash
# dependencies
npm install @ngxs/store @ngxs-labs/data --save

# @ng-frrri/ngxs-crud
npm install @ng-frrri/ngxs-crud --save
```

Then set up **ngxs** and **nxgs-data** in `app.module.ts` like so \(see [https://www.ngxs.io/getting-started/installation](https://www.ngxs.io/getting-started/installation) for more information\):

```typescript
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { PostsState } from './posts.state'; // <-- we will add this next

@NgModule({
  imports: [
    NgxsModule.forRoot([PostsState], {
      developmentMode: !environment.production
    }),
    NgxsDataPluginModule.forRoot(),
  ]
})
export class AppModule {}
```

Now add an entity collection for **Posts** extending `CrudCollectionState`:

```typescript
import { Injectable } from '@angular/core';
import { CrudCollection, CrudCollectionState } from '@ng-frrri/ngxs-crud';

interface Post {
    id: string;
    body: string;
    title: string;
}

@CrudCollection({ name: 'posts' })
@Injectable()
export class PostsState extends CrudCollectionState<Post, Post['id']> { }

```

In your `app.component.ts` you can retrieve data from your API:

```typescript
import { Store } from '@ngxs/store';
import { PostsState } from './posts.state';

@Component({ ... })
export class AppComponent {
  constructor(private posts: PostsState) {}

  getMany(name: string) {
    this.posts.getMany().toPromise();
  }
}
```

