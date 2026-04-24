import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user$: Observable<any>;

  isAdmin = false;
  isCreador = false;
  isUsuario = false;
  isLogged = false;

  private subs: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {

    // 🔥 EJECUTAR UNA VEZ AL INICIO (CLAVE)
    this.updateUserStatus();

    // 🔥 ESCUCHAR cambios de usuario
    this.subs.push(
      this.user$.subscribe(() => this.updateUserStatus())
    );

    // 🔥 ESCUCHAR cambios de tipo de usuario
    this.subs.push(
      this.authService.userType$.subscribe(() => this.updateUserStatus())
    );

    // 🔥 ESCUCHAR navegación
    this.subs.push(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.updateUserStatus())
    );
  }

  updateUserStatus() {

    const userType = localStorage.getItem('userType');
    const uid = localStorage.getItem('uid');

    this.isAdmin = userType === 'admin';
    this.isCreador = userType === 'creador';
    this.isUsuario = userType === 'usuario';
    this.isLogged = !!uid;

    console.log('Navbar status:', {
      userType,
      uid,
      isAdmin: this.isAdmin,
      isCreador: this.isCreador,
      isUsuario: this.isUsuario,
      isLogged: this.isLogged
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  // 🔥 LIMPIAR SUBSCRIPCIONES (EVITA BUGS RAROS)
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}