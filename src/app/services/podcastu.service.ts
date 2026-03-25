import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PodcastuService {

  private apiUrl = 'http://localhost:3001/podcast';

  constructor(private http: HttpClient) {}

  // ===============================
  // 🔹 CREAR PODCAST
  // ===============================
  crear(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // ===============================
  // 🔹 VER PODCASTS APROBADOS (APP)
  // ===============================
  getAprobados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ===============================
  // 🔹 VER TODOS (ADMIN)
  // ===============================
  getAdmin(): Observable<any[]> {
    const uid = localStorage.getItem('admin_uid');

    return this.http.get<any[]>(`${this.apiUrl}/admin`, {
      headers: {
        'x-admin-uid': uid || ''
      }
    });
  }

  // ===============================
  // 🔹 MIS PODCASTS (CREADOR)
  // ===============================
  getMis(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-podcasts/${uid}`);
  }

  // ===============================
  // 🔹 EDITAR PODCAST
  // ===============================
  actualizar(podcast: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${podcast.id_podcast}`,
      podcast
    );
  }

  // ===============================
  // 🔹 ELIMINAR PODCAST
  // ===============================
  eliminar(id: number, uid: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        body: { uid }
      }
    );
  }

  // ===============================
  // 🔹 APROBAR / DENEGAR (ADMIN)
  // ===============================
  cambiarEstado(id: number, estado_id: number): Observable<any> {
    const uid = localStorage.getItem('admin_uid');

    return this.http.put(
      `${this.apiUrl}/estado/${id}`,
      { estado_id },
      {
        headers: {
          'x-admin-uid': uid || ''
        }
      }
    );
  }

}