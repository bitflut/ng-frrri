import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
    imports: [CommonModule],
    declarations: [BreadcrumbsComponent],
    exports: [BreadcrumbsComponent],
})
export class BreadcrumbsUiModule { }
