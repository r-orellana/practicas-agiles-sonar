import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-comment',
  templateUrl: './album-comment.component.html',
  styleUrls: ['./album-comment.component.css']
})
export class AlbumCommentComponent implements OnInit {

  userId: number;
  token: string;
  albumId: number;
  albumTitulo: string;
  albumForm!: FormGroup;
  parentId: number;
  parentUsuario: string;
  parentContenido: string;


  constructor(

    private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit() {

    this.albumForm = this.formBuilder.group({
      comentario: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(512)]]
    })
    this.parentId=0;
    this.parentContenido="";
    this.parentUsuario="";

    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.albumService.getAlbum(parseInt(this.router.snapshot.params.albumId))
      .subscribe(album => {
        this.albumId = album.id
        this.albumTitulo = album.titulo
      })

      this.router.queryParams
      .subscribe(params => {
          if (params.parent!==undefined)
          {
            let parent=JSON.parse(params.parent);

            this.parentId = parent.id;
            this.parentUsuario = parent.usuario.nombre;
            this.parentContenido = parent.contenido;


            console.log("Params:"+params.parent);
          }
        }
      );

      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
    }
  }

  cancelComentario(){
    this.albumForm.reset()
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

  comentarAlbum(){

    let parentToPass: any = undefined;

    if(this.parentId>0)
      parentToPass=this.parentId;

    let comentario = this.albumForm.get('comentario')?.value

    this.albumService.comentarAlbum(this.albumId,comentario, this.token,parentToPass)
    .subscribe(album => {
      this.showSuccess(this.albumTitulo)
      this.albumForm.reset()
      this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
    },
    error=> {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })

  }


  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(albumTitulo: String) {
    if(this.parentId<1)
    {
      this.toastr.success(`El album ${albumTitulo} fue comentado`, "Comentario exitoso");
    }
    else
    {
      this.toastr.success(`!El comentario ha sido respondido!`, "Respuesta exitosa");
    }
  }

}
