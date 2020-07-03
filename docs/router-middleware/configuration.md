# Configuration

You can now define operations on your routes.  In the following example code, you see a simple `getMany` population for the `PostsIndexComponent`. We also define one child route for the selected Post entity.

{% hint style="warning" %}
Use the `operate()` function to define operators for your routes.
{% endhint %}

{% code title="posts-routing.module.ts" %}
```typescript
import { getActive, getMany, reset } from '@ng-frrri/router-middleware/operators';

const all = 'entities';
const posts = 'entities.posts';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
    },
    {
        path: 'all',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            getMany(posts),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: operate(
                getActive(posts),
            ),
        }],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(
            frrri(routes),
        ),
    ],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
```
{% endcode %}

{% hint style="info" %}
Find the list of already defined operators in our[ @ng-frrri/router-middleware](https://github.com/bitflut/ng-frrri/tree/master/libs/router-middleware/operators/src/libs) repository. Please see the [integration example in the GitHub repository](https://github.com/bitflut/ng-frrri/tree/master/apps/ng-integration) to see the usage of a variety of predefined operators.
{% endhint %}

