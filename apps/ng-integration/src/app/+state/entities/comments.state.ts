import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@ng-frrri/ngxs/pagination';

@PaginatedCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
