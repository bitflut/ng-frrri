import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpCollectionService } from './http-collection.service';
import { PaginatedHttpCollectionService } from './http-paginated-collection.service';

@NgModule({
    imports: [CommonModule],
})
export class HttpCollectionModule {

    constructor(
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HttpCollectionModule,
            providers: [
                HttpCollectionService,
                PaginatedHttpCollectionService,
            ],
        };
    }
}
