# Routing Instructions

**@ng-frrri/ngxs-crud/routing** aims at making it easy to configure your components data layer via the **angular router**. This way, your components are highly reusable and can display different sets of data for different routes easily.

First add `FrrriRoutingModule.forRoot()` to your AppModule:

{% code title="app.module.ts" %}
```typescript
...
import { FrrriRoutingModule } from '@ng-frrri/ngxs-crud/routing';

@NgModule({
    ...
    imports: [
        ...
        FrrriRoutingModule.forRoot()
    ],
})
export class AppModule { }
```
{% endcode %}

With a State setup like shown in [Crud Entities](crud-entities.md), you can configure your routes the following way:

### **Configuring your routes**

**entities.posts** defined in the example below is the corresponding collection's state path. See [States Registry](../recipes/states-registry.md) for more information.

{% code title="posts-routing.module.ts" %}
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { frrriRoutes, instructions, getActive, getMany, reset } from '@ng-frrri/ngxs-crud/routing';

const routes: Routes = [
    {
        path: '',
        data: instructions({
            'entities': reset(), // Reset all entities when entering the route
            'entities.posts': getMany() // Then get posts
        })
    },
    {
        path: ':id',
        data: instructions({
            'entities.posts': getActive() // Get active post (defaults to set param :id active)
        })
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(
            frrriRoutes(routes) // Important so route instructions can be resolved
        )
    ],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
```
{% endcode %}

{% hint style="warning" %}
It's important to wrap the routes provided to **RouterModule** with our **frrriRoutes\(\)** function, so our resolver will run for every route.
{% endhint %}

Have a look at [posts-routing.module.ts](https://github.com/bitflut/frrri/blob/master/apps/ng-integration/src/app/posts/posts-routing.module.ts) in the [ng-intergation](https://github.com/bitflut/frrri/blob/master/apps/ng-integration) on GitHub for more examples.

