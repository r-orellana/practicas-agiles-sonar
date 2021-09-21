import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComentarioService } from '../comentario.service';
import { ComentarioAlbum, ComentarioCancion } from '../comentario';

@Component({
  selector: 'app-comentario-list',
  templateUrl: './comentario-list.component.html',
  styleUrls: ['./comentario-list.component.css'],
})
export class ComentarioListComponent implements OnInit, OnChanges {
  constructor(
    private comentarioService: ComentarioService,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  @Input() instanceId: number | null;
  @Input() pageType: string = 'album';

  token: string;
  comentariosAlbum: Array<ComentarioAlbum> = [];
  comentariosCancion: Array<ComentarioCancion> = [];

  ngOnInit(): void {
    this.token = this.router.snapshot.params.userToken;
    this.loadComments(this.instanceId);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.token = this.router.snapshot.params.userToken;
    this.loadComments(changes.instanceId.currentValue);
  }

  loadComments(id: number | null) {
    if (id === null) {
      return
    }
    if (this.pageType === 'album') {
      this.comentarioService.getComentariosAlbum(id, this.token).subscribe(
        (response) => {
          this.comentariosAlbum = response;
        
        },
        (error) => {
          if (error.statusText === 'UNAUTHORIZED') {
            this.showWarning(
              'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
            );
          } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
            this.showError(
              'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
            );
          } else {
            this.showError('Ha ocurrido un error. ' + error.message);
          }
        }
      );
    } else {
      this.comentarioService.getComentariosCancion(id, this.token).subscribe(
        (response) => {
          this.comentariosCancion = response;
        },
        (error) => {
          if (error.statusText === 'UNAUTHORIZED') {
            this.showWarning(
              'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
            );
          } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
            this.showError(
              'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
            );
          } else {
            this.showError('Ha ocurrido un error. ' + error.message);
          }
        }
      );
    }
  }

  showError(error: string) {
    this.toastr.error(error, 'Error');
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  showSuccess() {
    this.toastr.success(`La canción fue editada`, 'Edición exitosa');
  }
}
