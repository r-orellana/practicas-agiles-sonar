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


  constructor(

    private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.albumService.getAlbum(parseInt(this.router.snapshot.params.albumId))
      .subscribe(album => {
        this.albumId = album.id
        this.albumTitulo = album.titulo
        this.albumForm = this.formBuilder.group({
          comentario: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(512)]]
        })
      })
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
    }
  }

  cancelComentario(){
    this.albumForm.reset()
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

  comentarAlbum(){

    let comentario = this.albumForm.get('comentario')?.value

    this.albumService.comentarAlbum(this.albumId,this.userId,comentario, this.token)
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
    this.toastr.success(`El album ${albumTitulo} fue comentado`, "Comentario exitoso");
  }

}
