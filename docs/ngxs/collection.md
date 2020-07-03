# Collection

By extending your State with **CollectionState** and adding the **@HttpCollection** decorator, you are all set to communicate with your api via the provided defaults `/api/{collection name}` . If you chose to consume data from somewhere else, you can always implement your own data layer to replace @ng-frrri/ngxs-http.

{% code title="posts.state.ts" %}
```typescript
import { Injectable } from '@angular/core';
import { CollectionState } from '@ng-frrri/ngxs';
import { HttpCollection } from '@ng-frrri/ngxs-http';

interface Post {
    id: string;
    body: string;
    title: string;
}

@HttpCollection({ name: 'posts' })
@Injectable()
export class PostsState extends CollectionState<Post, Post['id']> { }
```
{% endcode %}



## Global customisation

You can fully customise the baseUrl, endpoint and other relevant things via the **@CrudCollection** decorator's options, or globally for all collections by providing **COLLECTION\_OPTIONS\_TOKEN** anywhere in your module.

Overriding defaults for every **@CrudCollection** globally:

{% code title="state.module.ts" %}
```typescript
...
@NgModule({
    ...
    providers: [
        ...
        {
            provide: COLLECTION_OPTIONS_TOKEN,
            useValue: {
                baseUrl: 'http://localhost:3000',
                requestOptions: {
                    delay: 500,
                },
            } as CollectionOptionsProvider,
        }
    ],
})
export class StateModule { }
```
{% endcode %}



