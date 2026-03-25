import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notificacion {
  usuario: string;
  tipo_accion: string;
  fecha_hora: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
private url = 'http://localhost:3001/api/notificaciones';// <-- Revisa esta URL
  constructor(private http: HttpClient) {}

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url);
  }
    // ✅ Marcar todas como leídas
  marcarNotificacionesLeidas(): Observable<any> {
    return this.http.delete(`${this.url}/marcar-leidas`); // Llama al endpoint DELETE del backend
  }
}