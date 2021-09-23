import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { formatTime } from 'src/utils/formatTime';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css'],
})
export class CancionListComponent implements OnInit {
  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  userId: number;
  token: string;
  canciones: Array<Cancion>;
  cancionesCompartidas: Array<Cancion>;
  mostrarCanciones: Array<Cancion>;
  cancionSeleccionada: Cancion;
  indiceSeleccionado: number = 0;
  isEmpty: boolean = true;
  formatTimeFunction: typeof formatTime = formatTime;

  ngOnInit() {
    if (
      !parseInt(this.router.snapshot.params.userId) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId);
      this.token = this.router.snapshot.params.userToken;
      this.getCanciones();
      this.getCancionesCompartidas();
    }
  }

  mergeCancionList():void{

    if(this.canciones && this.cancionesCompartidas){
      this.mostrarCanciones = [...this.canciones, ...this.cancionesCompartidas];
      this.isEmpty = false
      this.onSelect(this.mostrarCanciones[0], 0)
    }
  }

  getCanciones(): void {
    this.cancionService.getCanciones(this.userId).subscribe((canciones) => {
      this.canciones = canciones;
      this.mostrarCanciones = canciones;
      if (this.canciones.length > 0) {
        this.isEmpty = false;
        this.mergeCancionList();
      }
      this.onSelect(this.mostrarCanciones[0], 0);
    });
  }

  getCancionesCompartidas(): void {
    this.cancionService.getCancionesCompartidas(this.userId, this.token).subscribe((canciones) => {
      this.cancionesCompartidas = canciones;
      this.mostrarCanciones = canciones;
      if (this.canciones?.length > 0) {
        this.isEmpty = false;
        this.mergeCancionList();
      }
      this.onSelect(this.mostrarCanciones[0], 0);
    });
  }

  onSelect(cancion: Cancion, indice: number) {
    this.indiceSeleccionado = indice;
    this.cancionSeleccionada = cancion;
    this.cancionService.getAlbumesCancion(cancion.id).subscribe(
      (albumes) => {
        this.cancionSeleccionada.albumes = albumes;
      },
      (error) => {
        this.showError(`Ha ocurrido un error: ${error.message}`);
      }
    );
  }

  buscarCancion(busqueda: string) {
    let cancionesBusqueda: Array<Cancion> = [];
    this.canciones.map((cancion) => {
      if (
        cancion.titulo
          .toLocaleLowerCase()
          .includes(busqueda.toLocaleLowerCase())
      ) {
        cancionesBusqueda.push(cancion);
      }
    });
    this.mostrarCanciones = cancionesBusqueda;
  }

  eliminarCancion() {
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id).subscribe(
      (cancion) => {
        this.ngOnInit();
        this.showSuccess();
      },
      (error) => {
        this.showError('Ha ocurrido un error. ' + error.message);
      }
    );
  }

  irCrearCancion() {
    this.routerPath.navigate([
      `/canciones/create/${this.userId}/${this.token}`,
    ]);
  }

  showError(error: string) {
    this.toastr.error(error, 'Error de autenticación');
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, 'Eliminada exitosamente');
  }
}
