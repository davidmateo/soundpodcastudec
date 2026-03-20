import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private apiUrl = 'http://localhost:3001/usuarios';

  constructor(private http: HttpClient) {}

  async getEstadisticas(): Promise<any> {
    const uid = localStorage.getItem('adminUid'); // ✅ mismo nombre que usas

    if (!uid) {
      throw new Error('No hay admin logueado');
    }

    const headers = new HttpHeaders({
      'x-admin-uid': uid
    });

    return await firstValueFrom(
      this.http.get(`${this.apiUrl}/estadisticas`, { headers })
    );
  }
}