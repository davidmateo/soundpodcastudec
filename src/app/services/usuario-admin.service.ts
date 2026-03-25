import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {

  private apiUrl = 'http://localhost:3001/usuarios';

  constructor(private http: HttpClient) {}

  // 🔥 MISMO MÉTODO QUE ESTADISTICAS
  private getHeaders(): HttpHeaders {
    const uid = localStorage.getItem('uid'); // 👈 MISMO NOMBRE

    if (!uid) {
      throw new Error('No hay admin logueado');
    }

    return new HttpHeaders({
      'x-admin-uid': uid
    });
  }

  // ===============================
  // 🔹 LISTAR
  // ===============================
  async getUsuarios(): Promise<any[]> {
    const headers = this.getHeaders();

    return await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/admin/usuarios`, { headers })
    );
  }

  // ===============================
  // 🔹 CREAR
  // ===============================
  async crearUsuario(data: any): Promise<any> {
    const headers = this.getHeaders();

    return await firstValueFrom(
      this.http.post(`${this.apiUrl}/admin/usuarios`, data, { headers })
    );
  }

  // ===============================
  // 🔹 ACTUALIZAR
  // ===============================
  async actualizarUsuario(uid: number, data: any): Promise<any> {
    const headers = this.getHeaders();

    return await firstValueFrom(
      this.http.put(`${this.apiUrl}/admin/usuarios/${uid}`, data, { headers })
    );
  }

  // ===============================
  // 🔹 ELIMINAR
  // ===============================
  async eliminarUsuario(uid: string): Promise<any> {
    const headers = this.getHeaders();

    return await firstValueFrom(
      this.http.delete(`${this.apiUrl}/admin/usuarios/${uid}`, { headers })
    );
  }
}