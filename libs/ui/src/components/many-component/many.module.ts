import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ManyComponent } from './many.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ManyComponent],
    exports: [ManyComponent],
})
export class ManyUiModule { }
