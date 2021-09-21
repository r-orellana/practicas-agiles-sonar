import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { AlbumJoinCancionComponent } from './album-join-cancion/album-join-cancion.component';
import { AlbumShareComponent } from './album-share/album-share.component';
import { AlbumCommentComponent } from './album-comment/album-comment.component';
import { ComentarioModule } from '../comentario/comentario.module';


@NgModule({
  declarations: [AlbumListComponent, AlbumDetailComponent, AlbumCreateComponent, AlbumEditComponent, AlbumJoinCancionComponent,AlbumShareComponent,AlbumCommentComponent],
  imports: [
    CommonModule, ReactiveFormsModule, AppHeaderModule, ComentarioModule
  ],
  exports:[AlbumListComponent, AlbumDetailComponent, AlbumCreateComponent, AlbumEditComponent, AlbumJoinCancionComponent,AlbumShareComponent,AlbumCommentComponent]
})
export class AlbumModule { }
