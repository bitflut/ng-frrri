import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { frrri, operate } from '@ng-frrri/router-middleware';
import { staticBreadcrumb } from '@ng-frrri/router-middleware/operators';

const routes: Routes = [
    {
        path: '',
        data: operate(
            staticBreadcrumb({ title: 'home' }),
        ),
        children: [
            {
                path: 'posts',
                loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule),
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(
            frrri(routes),
            {
                initialNavigation: 'enabled',
                urlUpdateStrategy: 'eager',
            },
        ),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }
