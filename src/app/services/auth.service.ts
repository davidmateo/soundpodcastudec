import { Injectable, NgZone } from '@angular/core';
import {  catchError, Observable, switchMap, throwError } from 'rxjs';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User, 
  onAuthStateChanged 
} from '@angular/fire/auth';
import { BehaviorSubject, from, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:3000/usuarios'; // 👈 tu backend local

  constructor(
    private auth: Auth,
    private ngZone: NgZone,
    private router: Router,
    private http: HttpClient
  ) {
    // Mantener estado del usuario logueado en Firebase
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(user);
      });
    });
  }
 // 🔹 Registro en Firebase + backend
register(email: string, password: string, nombre: string, apellido?: string): Observable<any> {
  console.log("Intentando registrar:", { email, password, nombre, apellido });

  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap((userCredential) => {
      const uid = userCredential.user.uid;

      console.log("Usuario creado en Firebase:", uid);

      return this.http.post(`${this.apiUrl}/register`, {
        uid,
        email,
        nombre,
        apellido
      });
    })
  );
}

  // 🔹 Login con Firebase y sincronización con backend
  async login(email: string, password: string): Promise<any> {
    const userCred = await signInWithEmailAndPassword(this.auth, email, password);
    const token = await userCred.user.getIdToken(true);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // ✅ usamos firstValueFrom en lugar de toPromise()
    return await firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, {}, { headers })
    );
  }
  /**
   * 🔹 Login de administrador
   * Solo permite iniciar sesión si el usuario existe en la BD y tiene rol = 1
   */
  loginAdmin(uid: string, nombre: string, email: string): Observable<any> {
    const body = { uid, nombre, email };

    return this.http.post(`${this.apiUrl}/login-admin`, body).pipe(
      catchError((error) => {
        console.error('❌ Error en loginAdmin:', error);
        return throwError(() => error);
      })
    );
  }
  // 🔹 Obtener perfil desde backend
  async getPerfil(): Promise<any> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario logueado');

    const token = await user.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return await firstValueFrom(
      this.http.get(`${this.apiUrl}/me`, { headers })
    );
  }

  // 🔹 Actualizar perfil en backend
  async updatePerfil(data: { nombre?: string; apellidos?: string; refresh_token?: string }) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario logueado');

    const token = await user.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return await firstValueFrom(
      this.http.put(`${this.apiUrl}/me`, data, { headers })
    );
  }

  // 🔹 Logout (solo Firebase)
  logout() {
    return from(this.ngZone.run(() => signOut(this.auth)));
  }
}
