# NgxsCrudOneComponent

Displays one entity in a collection by the provided **id**.

The path **entities.users** defined in the example below is the corresponding collection's state path. See [States Registry](../../recipes/states-registry.md) for more information.

```markup
<frrri-one path="entities.users" [id]="post.userId" #oneUserComponent>
    <ng-container *ngIf="oneUserComponent.one$ | async as user">
        {{ user.name }} {{ user.email }}
    </ng-container>
</frrri-one>
```



