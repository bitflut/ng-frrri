# SSR

{% hint style="info" %}
@ng-frrri/ should work with @angular/universal out of the box.
{% endhint %}

You can specify whether or not a route awaits results before resolving with the `await` property \(see examples below\). During SSR the behaviour defaults to awaiting results before resolving the route, so the data is already displayed when serving your page.

You can customise this behaviour with the `awaitPlatformServer` property.

```typescript
const routes: Routes = [
    {
        path: 'posts',
        component: PostsIndexComponent,
        data: instructions({
            'entities': reset(),
            'entities.posts': [
                getMany({
                    await: false, // (default: false) Resolves route before loading data
                    awaitPlatformServer: true // (default: true) Resolves route after data has loaded on server
                }),
            ],
        }),
    }
]
```

