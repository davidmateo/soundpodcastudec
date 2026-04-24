import { Injectable, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, from, firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private userTypeSubject = new BehaviorSubject<string | null>(localStorage.getItem('userType'));
  userType$ = this.userTypeSubject.asObservable();

  private apiUrl = 'http://localhost:3001/usuarios';

  constructor(
    private auth: Auth,
    private ngZone: NgZone,
    private router: Router,
    private http: HttpClient
  ) {

    // 🔥 CONTROL TOTAL DE FIREBASE
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(() => {

        const userType = localStorage.getItem('userType');

        // 🚫 NO permitir que Firebase pise admin o creador
        if (userType === 'admin' || userType === 'creador') {
          console.log('🛑 Firebase ignorado (admin/creador activo)');
          return;
        }

        this.currentUserSubject.next(user);

        if (user) {
          this.setUid(user.uid);
          this.setUserType('usuario');
        }
      });
    });
  }

  // ===============================
  // 🔹 RESTAURAR SESIÓN
  // ===============================
restaurarSesion() {

  const uid = localStorage.getItem('uid');
  const userType = localStorage.getItem('userType');

  if (!uid || !userType) {
    console.log('⚠️ No hay sesión');
    return;
  }

  // 🔥 emitir tipo
  this.userTypeSubject.next(userType);

  // 🔥 SIEMPRE simular usuario (clave)
  this.currentUserSubject.next({ uid } as any);

  console.log('🔄 Sesión restaurada:', { uid, userType });
}
  // ===============================
  // 🔹 REGISTRO
  // ===============================
  register(email: string, password: string, nombre: string, apellido?: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const uid = userCredential.user.uid;
        return this.http.post(`${this.apiUrl}/register`, { uid, email, nombre, apellido });
      })
    );
  }

  // ===============================
  // 🔹 LOGIN USUARIO (Firebase)
  // ===============================
  async login(email: string, password: string): Promise<any> {

    const userCred = await signInWithEmailAndPassword(this.auth, email, password);

    const uid = userCred.user.uid;
    const token = await userCred.user.getIdToken(true);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const res: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, {}, { headers })
    );

    localStorage.clear();

    this.setUid(uid);
    this.setUserType('usuario');

    return res;
  }

  // ===============================
  // 🔹 LOGIN ADMIN
  // ===============================
  loginAdmin(uid: string, nombre: string, email: string) {
    return this.http.post(`${this.apiUrl}/login-admin`, { uid, nombre, email }).pipe(
      tap(async (res: any) => {

        if (res?.usuario?.id_rol !== 1) {
          throw new Error('No eres admin');
        }

        // 🔥 CERRAR FIREBASE
        await signOut(this.auth);

        localStorage.clear();

        this.setUid(res.usuario.uid || uid);
        this.setUserType('admin');
      })
    );
  }

  // ===============================
  // 🔹 LOGIN CREADOR
  // ===============================
  loginCreador(uid: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-creador`, { uid, email }).pipe(
      tap(async () => {

        await signOut(this.auth);

        localStorage.clear();

        this.setUid(uid);
        this.setUserType('creador');
      })
    );
  }

  // ===============================
  // 🔹 HELPERS
  // ===============================
  setUserType(type: string) {
    localStorage.setItem('userType', type);
    this.userTypeSubject.next(type);
  }

  setUid(uid: string) {
    localStorage.setItem('uid', uid);
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  }

  isCreador(): boolean {
    return this.getUserType() === 'creador';
  }

  isUsuario(): boolean {
    return this.getUserType() === 'usuario';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('uid');
  }

  // ===============================
  // 🔹 LOGOUT
  // ===============================
  logout() {
    localStorage.clear();
    this.userTypeSubject.next(null);
    return from(this.ngZone.run(() => signOut(this.auth)));
  }
}