import { NgModule } from '@angular/core';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        NgxsModule.forRoot([], {
            developmentMode: !environment.production,
        }),
        NgxsDataPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
    ],
})
export class AppStateModule { }
