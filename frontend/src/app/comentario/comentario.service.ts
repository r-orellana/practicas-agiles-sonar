import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ComentarioAlbum, ComentarioCancion } from './comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private backUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }
  getComentariosAlbum(albumId: number, token: string): Observable<Array<ComentarioAlbum>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Array<ComentarioAlbum>>(`${this.backUrl}/album/${albumId}/comentario`, { headers: headers })
  }
  getComentariosCancion(cancionId: number, token: string): Observable<Array<ComentarioCancion>>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Array<ComentarioCancion>>(`${this.backUrl}/cancion/${cancionId}/comentario`, { headers: headers })
  }
  
}
