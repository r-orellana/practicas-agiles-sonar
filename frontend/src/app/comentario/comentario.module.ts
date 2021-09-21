import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioListComponent } from './comentario-list/comentario-list.component';



@NgModule({
  declarations: [
    ComentarioListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComentarioListComponent
  ]
})
export class ComentarioModule { }
