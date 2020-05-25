import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActiveUiModule, ManyUiModule, OneUiModule } from '@ng-frrri/ui';
import { EntitiesStateModule } from '../+state/entities-state.module';
import { PostsIndexComponent } from './posts-index/posts-index.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsShowComponent } from './posts-show/posts-show.component';

@NgModule({
    declarations: [PostsIndexComponent, PostsShowComponent],
    imports: [
        CommonModule,
        PostsRoutingModule,
        EntitiesStateModule,
        ActiveUiModule,
        ManyUiModule,
        OneUiModule,
    ],
})
export class PostsModule { }
