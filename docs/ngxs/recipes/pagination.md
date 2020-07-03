# Pagination

@ng-frrri/ngxs and @ng-frrri/ngxs-http exposes functions for pagination via **PaginatedHttpCollection** and a **PaginationInterceptor**. The current implementation is an endless pagination relying on the server to respond with a Link-header specifying the next page's url in a _rel="next"_ tag.

{% hint style="info" %}
Should you require a different pagination mechanism, we suggest to look at `paginated-collection.state.ts` and write your own implementation.
{% endhint %}

To get started using pagination, first add the **PaginationInterceptor** to your AppModule.

```typescript
import { PaginationInterceptor } from '@ng-frrri/ngxs/pagination';

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...,
        HttpClientModule,
        ...
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PaginationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
```

Then define your paginated state using the **PaginatedHttpCollection** decorator or your own implementation of the data layer you want to consume from:

```typescript
import { Injectable } from '@angular/core';
import { PaginatedHttpCollection } from '@ng-frrri/ngxs-http';
import { PaginatedCollectionState } from '@ng-frrri/ngxs/pagination';

@PaginatedHttpCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCollectionState { }
```

A **PaginatedHttpCollection** automatically persists the Link header's _rel="next"_ attribute into your state's **next** property. If you want to get the next page, simply call `PostsState.getNext().toPromise()` .

In cases where you need to load **all available pages**, you can use `PostsState.getAll().toPromise()`

