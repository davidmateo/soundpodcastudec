import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminBackupService {

  private apiUrl = 'http://localhost:3001/api'; // 👈 ajusta si tu ruta es diferente

  constructor(private http: HttpClient) {}

  // 🔹 HACER BACKUP
  crearBackup(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backup`, {
      responseType: 'blob' // 🔥 importante para descargar archivo
    });
  }

  // 🔹 RESTAURAR BACKUP
restaurarBackup(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post('http://localhost:3001/api/restore', formData);
}
}