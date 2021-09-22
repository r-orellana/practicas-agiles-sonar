import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComentarioService } from '../comentario.service';
import { ComentarioAlbum, ComentarioCancion, IComentario } from '../comentario';


@Component({
  selector: 'app-comentario-list',
  templateUrl: './comentario-list.component.html',
  styleUrls: ['./comentario-list.component.css'],
})
export class ComentarioListComponent implements OnInit, OnChanges {
  constructor(
    private comentarioService: ComentarioService,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ) {}

  @Input() instanceId: number | null;
  @Input() pageType: string = 'album';

  userId: number;
  token: string;
  comentarios: Array<IComentario> = [];


  ngOnInit(): void {
    this.userId = parseInt(this.router.snapshot.params.userId);
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
          this.comentarios = response;

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
          this.comentarios = response;
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

  goToAnswerComment(parent: IComentario)
  {
    let toPass: IComentario = {} as IComentario;
    toPass.id=parent.id;
    toPass.usuario=parent.usuario;
    toPass.contenido=parent.contenido;

    console.log("To pass:"+JSON.stringify(parent));

    if (this.pageType=="album")
    {
      this.routerPath.navigate([`/albumes/comment/${(parent as ComentarioAlbum).album}/${this.userId}/${this.token}`] , { queryParams: { parent :  JSON.stringify(parent) } })
    }
    else
    {
      this.routerPath.navigate([`/canciones/comment/${(parent as ComentarioCancion).cancion}/${this.userId}/${this.token}`], { queryParams: { parent :  JSON.stringify(parent) } })
    }

  }

}
