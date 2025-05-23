import { Injectable, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, from } from 'rxjs';
import { Router } from '@angular/router';  // Importación correcta de Router
import { tap } from 'rxjs/operators';  // Importación correcta de tap

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private ngZone: NgZone,
    private router: Router  // Asegúrate de que Router esté inyectado
  ) {
    // Actualiza el estado del usuario cuando cambia
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(user);
      });
    });
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  

  register(email: string, password: string) {
    return from(
      this.ngZone.run(() => createUserWithEmailAndPassword(this.auth, email, password))
    );
  }

  logout() {
    return from(this.ngZone.run(() => signOut(this.auth)));
  
  }
}
