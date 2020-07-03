# Setup

First thing you need to do is to enable ng-frrri's router middleware by wrapping your routes with the `frrri()` function.

{% hint style="warning" %}
It's important to wrap the routes provided to **RouterModule** with our **frrri\(\)** function, so our middleware will run for every route.
{% endhint %}

{% code title="app-routing.module.ts" %}
```typescript
import { frrri, operate } from '@ng-frrri/router-middleware';
import { staticBreadcrumb } from '@ng-frrri/router-middleware/operators';

const routes: Routes = [
    {
        path: '',
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(
            frrri(routes),
            {
                initialNavigation: 'enabled',
                urlUpdateStrategy: 'eager',
            },
        ),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }
```
{% endcode %}

Have a look at [posts-routing.module.ts](https://github.com/bitflut/ng-frrri/blob/master/apps/ng-integration/src/app/posts/posts-routing.module.ts) in the [ng-intergation](https://github.com/bitflut/ng-frrri/tree/master/apps/ng-integration) on GitHub for more examples.

