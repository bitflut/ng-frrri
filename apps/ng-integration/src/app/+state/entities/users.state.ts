import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@ng-frrri/ngxs/pagination';

@PaginatedCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
