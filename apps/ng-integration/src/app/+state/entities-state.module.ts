import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollectionOptionsProvider, COLLECTION_OPTIONS_TOKEN } from '@ng-frrri/ngxs';
import { NgxsModule } from '@ngxs/store';
import { EntitiesState } from './entities.state';
import { CommentsState } from './entities/comments.state';
import { PostsState } from './entities/posts.state';
import { UsersState } from './entities/users.state';

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            EntitiesState,
            PostsState,
            CommentsState,
            UsersState,
        ]),
    ],
    providers: [{
        provide: COLLECTION_OPTIONS_TOKEN,
        useValue: {
            baseUrl: 'http://localhost:3000',
            requestOptions: {
                delay: 500,
            },
        } as CollectionOptionsProvider,
    }],
})
export class EntitiesStateModule { }
