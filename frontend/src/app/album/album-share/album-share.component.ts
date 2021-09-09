import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Album } from 'src/app/album/album';
import { AlbumService } from 'src/app/album/album.service';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.css']
})
export class AlbumShareComponent implements OnInit {
  userId: number;
  token: string;
  albumId: number;
  album: Album;
  albumShareForm !: FormGroup;
  usuarios: Array<Usuario>

  constructor(
    private albumService: AlbumService,
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
      this.albumId = this.router.snapshot.params.albumId

      this.albumService.getAlbum(this.albumId)
      .subscribe(album => {
        this.album = album
        this.albumShareForm = this.formBuilder.group({
          tituloAlbum: [album.titulo, [Validators.required]],
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

  compartirAlbum(){

    let listaUsuarios = this.albumShareForm.get('usuarioForm')?.value

    for (let usuarioCompartir of listaUsuarios){
      this.albumService.compartirAlbum(this.albumId,usuarioCompartir,this.token)
      .subscribe(album => {
        this.showSuccess(album.titulo)
        this.albumShareForm.reset()
        this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
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
    this.albumShareForm.reset()
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

  onSelect(albumId: any){
    this.albumShareForm.get('idAlbum')?.setValue(albumId)
  }


  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showSuccess(tituloAlbum: string) {
    this.toastr.success(`El album ${tituloAlbum} fue compartido`, "Asociación exitosa");
  }

}
