import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';

@Component({
  selector: 'app-cancion-comment',
  templateUrl: './cancion-comment.component.html',
  styleUrls: ['./cancion-comment.component.css']
})
export class CancionCommentComponent implements OnInit {

  userId: number;
  token: string;
  cancionId: number;
  cancionTitulo: string;
  cancionForm!: FormGroup;

  constructor(
    private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.cancionService.getCancion(parseInt(this.router.snapshot.params.cancionId))
      .subscribe(cancion => {
        this.cancionId = cancion.id
        this.cancionTitulo = cancion.titulo
        this.cancionForm = this.formBuilder.group({
          comentario: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(512)]]
        })
      })
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
    }
  }

  cancelComentario(){
    this.cancionForm.reset()
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
  }

  comentarCancion(){

    let comentario = this.cancionForm.get('comentario')?.value

    this.cancionService.comentarCancion(this.cancionId,this.userId,comentario, this.token)
    .subscribe(cancion => {
      this.showSuccess(this.cancionTitulo)
      this.cancionForm.reset()
      this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
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

  showSuccess(cancionTitulo: String) {
    this.toastr.success(`La canción ${cancionTitulo} fue comentada`, "Comentario exitoso");
  }

}
