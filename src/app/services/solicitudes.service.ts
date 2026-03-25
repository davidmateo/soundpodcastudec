import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = 'http://localhost:3001/solicitudes';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas
  getSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // 🔹 Aprobar / Denegar
  actualizarSolicitud(id: number, estado_id: number) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { estado_id }
    );
  }
}