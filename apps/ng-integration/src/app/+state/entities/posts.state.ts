import { Injectable } from '@angular/core';
import { AfterSuccess } from '@ng-frrri/ngxs';
import { OperationContext } from '@ng-frrri/ngxs/internal';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@ng-frrri/ngxs/pagination';
import { Observable } from 'rxjs';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@PaginatedCrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<Post, Post['id']> implements AfterSuccess<Post> {

    afterSuccess(data: any | any[], operation: OperationContext): void | Observable<any> {
    }

}
