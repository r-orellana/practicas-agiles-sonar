import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from 'src/app/cancion/cancion';
import { CancionService } from 'src/app/cancion/cancion.service';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-cancion-share',
  templateUrl: './cancion-share.component.html',
  styleUrls: ['./cancion-share.component.css']
})
export class CancionShareComponent implements OnInit {
  userId: number;
  token: string;
  cancionId: number;
  cancion: Cancion;
  cancionShareForm !: FormGroup;
  usuarios: Array<Usuario>

  constructor(
    private cancionService: CancionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ){ }

  ngOnInit() {

    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.cancionId = this.router.snapshot.params.cancionId

      this.cancionService.getCancion(this.cancionId)
      .subscribe(cancion => {
        this.cancion = cancion
        this.cancionShareForm = this.formBuilder.group({
          tituloCancion: [cancion.titulo, [Validators.required]],
          usuarioForm: ["", [Validators.required]]
        })
        this.getUsuarios()
      })
    }


  }

  getUsuarios(){
    this.usuarioService.getUsuarios(this.userId)
    .subscribe(usuarios => {
      this.usuarios = usuarios
    })
  }


  compartirCancion(){

    let listaUsuarios = this.cancionShareForm.get('usuarioForm')?.value
    for (let usuarioCompartir of listaUsuarios){
      this.cancionService.compartirCancion(this.cancionId,usuarioCompartir,this.token)
      .subscribe(cancion => {
        this.showSuccess(cancion.titulo)
        this.cancionShareForm.reset()
        this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
      },
      error=> {
        if(error.statusText === "UNPROCESSABLE ENTITY"){
          this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
        }
        else{
          this.showError("Ha ocurrido un error. " + error.message)
        }
      })
    }
  }

  cancelarCompartir(){
    this.cancionShareForm.reset()
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
  }

  onSelect(cancionId: any){
    this.cancionShareForm.get('idCancion')?.setValue(cancionId)
  }


  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showSuccess(tituloCancion: string) {
    this.toastr.success(`La canción ${tituloCancion} fue compartida`, "Asociación exitosa");
  }

}
