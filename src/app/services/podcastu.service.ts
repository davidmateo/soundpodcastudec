import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PodcastuService {

  private apiUrl = 'http://localhost:3001/podcast';

  constructor(private http: HttpClient) {}

  // 🔹 HEADERS ADMIN
private getAdminHeaders(): HttpHeaders {

  const uid = localStorage.getItem('uid') || '';

  return new HttpHeaders({
    'x-admin-uid': uid
  });
}


  // 🔹 CREAR PODCAST
  crear(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 🔹 APROBADOS
  getAprobados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔹 ADMIN
  getAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin`, {
      headers: this.getAdminHeaders()
    });
  }

  // 🔹 CAMBIAR ESTADO
cambiarEstado(id: number, estado_id: number): Observable<any> {

  return this.http.put(
    `${this.apiUrl}/estado/${id}`,
    { estado_id },
    {
      headers: this.getAdminHeaders()
    }
  );
}

  aprobar(id: number): Observable<any> {
    return this.cambiarEstado(id, 2);
  }

  rechazar(id: number): Observable<any> {
    return this.cambiarEstado(id, 3);
  }

  getMis(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-podcasts/${uid}`);
  }

  actualizar(podcast: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${podcast.id_podcast}`,
      podcast
    );
  }

  eliminar(id: number, uid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      body: { uid }
    });
  }
}