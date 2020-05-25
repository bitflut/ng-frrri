import { Injectable } from '@angular/core';
import { AfterSuccess } from '@ng-frrri/ngxs';
import { OperationContext } from '@ng-frrri/ngxs/internal';
import { PaginatedCollectionState } from '@ng-frrri/ngxs/pagination';
import { Observable } from 'rxjs';
import { PaginatedHttpCollection } from '@ng-frrri/ngxs-http';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@PaginatedHttpCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCollectionState<Post, Post['id']> implements AfterSuccess<Post> {

    afterSuccess(data: any | any[], operation: OperationContext): void | Observable<any> {
    }

}
