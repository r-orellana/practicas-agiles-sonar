import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionListComponent } from './cancion-list/cancion-list.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CancionDetailComponent } from './cancion-detail/cancion-detail.component';
import { CancionCreateComponent } from './cancion-create/cancion-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CancionEditComponent } from './cancion-edit/cancion-edit.component';
import { CancionShareComponent } from './cancion-share/cancion-share.component';
import { CancionCommentComponent } from './cancion-comment/cancion-comment.component';
import { ComentarioModule } from '../comentario/comentario.module';


@NgModule({
  declarations: [CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent,CancionShareComponent,CancionCommentComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule, ComentarioModule
  ],
  exports:[CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent,CancionShareComponent,CancionCommentComponent]
})
export class CancionModule { }
