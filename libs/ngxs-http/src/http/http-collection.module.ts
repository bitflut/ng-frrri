import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
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
