# Population

## Comments of a post of a user

**@ng-frrri/ngxs-crud/populate** exposes a populate\(\) instruction.

#### Imagine the following scenario:

{% tabs %}
{% tab title="interfaces.ts" %}
```typescript
interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface Comment {
    id: number;
    postId: number;
    userId: number;
    body: number;
}

interface User {
    id: number;
    name: string;
}
```
{% endtab %}

{% tab title="states.ts" %}
```typescript
import { Post, Comment, User } from './interfaces';

@CrudCollection({ name: 'posts' })
@Injectable()
export class PostsState extends CrudCollectionState<Post, Post['id']> { }

@CrudCollection({ name: 'comments' })
@Injectable()
export class CommentsState extends CrudCollectionState<Comment, Comment['id']> { }

@CrudCollection({ name: 'users' })
@Injectable()
export class UsersState extends CrudCollectionState<User, User['id']> { }

@CrudEntities({
    name: 'users',
    children: [
        PostsState,
        CommentsState,
        UsersState
    ],
})
@Injectable()
export class EntitiesState extends CrudEntitiesState { }
```
{% endtab %}
{% endtabs %}

Now if you want to display the user's name for every post in your list, you can use `populate()` to instruct the frrri resolver to fetch every post's user.

You can also fetch all comments for a post and then every user for every comment.

## The populate\(\) route instruction

#### Getting every post's user

```typescript
import { populate } from '@ng-frrri/ngxs-crud/populate';

const routes: Routes = [
    {
        path: 'posts-with-user',
        component: PostsIndexComponent,
        data: instructions({
            'entities': reset(), // Resets all entities upon entering the route
            'entities.posts': [
                deactivate(), // Deactivates entity, if any was active
                getMany(),
                populate({
                    statePath: 'entities.users', // The target state's path
                    idPath: 'userId', // Where to find the User's id on Post
                }),
            ],
        }),
    }
]
```

When opening `/posts-with-user`, it will load all posts and then all users of the loaded posts. If you are using _PaginatedCollection_, it will do so for every page you load.

#### Getting one post's comments \(via PopulationStrategy.ForeignId\)

```typescript
const routes: Routes = [
    {
        path: ':id',
        component: PostsShowComponent,
        data: instructions({
            'entities.comments': reset(), // Reset comments
            'entities.posts': [
                getActive(), // Activates a comment via the routes :id param
                populate({
                    statePath: 'entities.comments',
                    idPath: 'postId', // Where to find the Post's id on Comment
                    strategy: PopulationStrategy.ForeignId, // Look for id on Comment instead of Post
                }),
            ],
        }),
    }
]
```

The same configuration would also work if you would change getActive\(\) to getMany\(\). This would, however, populate all comments of every post loaded by getMany\(\).

