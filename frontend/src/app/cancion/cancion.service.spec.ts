/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CancionService } from './cancion.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Cancion } from './cancion';

describe('Service: Cancion', () => {
  let cancionService: CancionService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl ;

  let canciones : Array<Cancion>;
  let cancion : Cancion;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CancionService]
    });

    cancionService=TestBed.inject(CancionService);
    httpMock=TestBed.inject(HttpTestingController);

    cancion = {
      titulo : 'Test Titulo',
      interprete : 'Test interprete',
      minutos : 5,
      segundos : 12,
      usuario : 1,
      id: 0,
      albumes: []
    };

    canciones=new Array<Cancion>();
    canciones.push(cancion);
    canciones.push(cancion);
    canciones.push(cancion);
  });

  it('Get ALL canciones', () => {

    cancionService.getCanciones(1).subscribe(t => {
      expect(t.length).toBe(3);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${baseUrl}/usuario/1/canciones`
    });

    expect(req.request.method).toEqual('GET');
    req.flush(canciones);
  });

  it('Create canciones', () => {


    cancionService.crearCancion(1,cancion).subscribe(t => {
      expect(t.id).not.toBeNull();
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${baseUrl}/usuario/1/canciones`
    });

    expect(req.request.method).toEqual('POST');
    req.flush(cancion);
  });


});
