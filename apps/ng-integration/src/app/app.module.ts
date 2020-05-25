import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsMiddlewareModule } from '@ng-frrri/ngxs';
import { PaginationInterceptor } from '@ng-frrri/ngxs/pagination';
import { FrrriModule } from '@ng-frrri/router-middleware';
import { BreadcrumbsUiModule } from '@ng-frrri/ui';
import { AppRoutingModule } from './app-routing.module';
import { AppStateModule } from './app-state.module';
import { AppComponent } from './app.component';
import { HttpCollectionModule } from '@ng-frrri/ngxs-http';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AppStateModule,
        HttpCollectionModule.forRoot(),
        FrrriModule.forRoot(),
        NgxsMiddlewareModule.forRoot(),
        BreadcrumbsUiModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PaginationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
