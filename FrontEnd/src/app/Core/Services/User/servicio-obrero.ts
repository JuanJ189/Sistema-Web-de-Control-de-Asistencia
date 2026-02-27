import { Injectable } from '@angular/core';
import { environment } from '../../../Enviroments/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioObrero {
  private baseurl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarUbicacion(data: any): Observable<any> {
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      `${this.baseurl}attendance/mark`,
      data,
      { headers,
        responseType: 'text' as 'json'
       }
    );
  }

  verificarAsistencia(usuarioId: number): Observable<any> {

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      `${this.baseurl}attendance/status?usuarioId=${usuarioId}`,
      { headers }
    );
  }

  
}