import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = 'http://localhost:3001/solicitudes/all';

  constructor(private http: HttpClient) {}

  getSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
