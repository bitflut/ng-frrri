import { Injectable } from '@angular/core';
import { PaginatedCollectionState } from '@ng-frrri/ngxs/pagination';
import { PaginatedHttpCollection } from '@ng-frrri/ngxs-http';

@PaginatedHttpCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCollectionState<any, string> {
}
