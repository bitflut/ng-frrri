# Population

## Comments of a post of a user

Use the `populate()`operator to apply population to your resource.

### Imagine the following scenario:

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

@HttpCollection({ name: 'posts' })
@Injectable()
export class PostsState extends CollectionState<Post, Post['id']> { }

@HttpCollection({ name: 'comments' })
@Injectable()
export class CommentsState extends CollectionState<Comment, Comment['id']> { }

@HttpCollection({ name: 'users' })
@Injectable()
export class UsersState extends CollectionState<User, User['id']> { }

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

Now if you want to display the user's name for every post in your list, you can use the `populate()` operator.

You can also fetch all comments for a post and then every user for every comment.

## The populate\(\) route instruction

### Getting every post's user

```typescript
import { populate, reset } from '@ng-frrri/router-middleware/operators';

const routes: Routes = [
    {
        path: 'with-user',
        component: PostsIndexComponent,
        data: operate(
            reset(all),
            populate({
                from: posts,
                to: users,
                idPath: 'userId',
                idSource: posts,
                operations: [OperationContext.Many],
            }),
        ),
    }
]
```

When opening `/with-user`, it will load all posts and then all users of the loaded posts. If you are using _PaginatedHttpCollection_, it will do so for every page you load.

### Getting one post's comments

```typescript
const routes: Routes = [
    {
    
        path: ':id',
            component: PostsShowComponent,
            data: operate(
                reset(comments),
                populate({
                    from: posts,
                    to: comments,
                    idPath: 'postId',
                    idSource: comments,
                    operations: [OperationContext.One],
                }),
                getActive(posts),
            ),
    },
];
```

The same configuration would also work if you would change getActive\(\) to getMany\(\). This would, however, populate all comments of every post loaded by getMany\(\).

