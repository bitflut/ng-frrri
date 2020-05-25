import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OneComponent } from './one.component';

@NgModule({
    imports: [CommonModule],
    declarations: [OneComponent],
    exports: [OneComponent],
})
export class OneUiModule { }
