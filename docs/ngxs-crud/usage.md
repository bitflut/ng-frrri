# Usage

There are quite a few concepts to be explained. Please see the [integration example in the GitHub repository](https://github.com/bitflut/frrri/tree/master/apps/ng-integration) until documentation catches up.

## Configuration via routes

**@ng-frrri/ngxs-crud** aims at making it easy to configure your components data layer via the **angular router**. This way, your components are highly reusable and can display different sets of data for different routes easily. Have a look at [posts-routing.module.ts](https://github.com/bitflut/frrri/blob/master/apps/ng-integration/src/app/posts/posts-routing.module.ts) in the ng-intergation example on GitHub for examples.

## Streamline your view layer

To streamline your view layer **@ng-frrri/ngxs-crud provides three components** to show __**collections**, a **single entity** of a collection or the **active entity** of the collection. You can see them in action in the `posts-index.component.html` and `posts-show.component.html` templates \(found [here](https://github.com/bitflut/frrri/blob/master/apps/ng-integration/src/app/posts)\).

