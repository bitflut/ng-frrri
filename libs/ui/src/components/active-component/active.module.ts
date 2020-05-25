import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActiveComponent } from './active.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ActiveComponent],
    exports: [ActiveComponent],
})
export class ActiveUiModule { }
