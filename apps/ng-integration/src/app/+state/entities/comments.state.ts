import { Injectable } from '@angular/core';
import { PaginatedCollectionState } from '@ng-frrri/ngxs/pagination';
import { PaginatedHttpCollection } from '@ng-frrri/ngxs-http';

@PaginatedHttpCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCollectionState<any, string> {
}
