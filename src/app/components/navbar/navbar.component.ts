import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
export class NavbarComponent implements OnInit {

  user$: Observable<any>;

  isAdminLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.user$ = this.authService.currentUser$;

  }

  ngOnInit() {

    this.checkAdminStatus();

    // Detecta cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAdminStatus();
      });

  }

  checkAdminStatus(){

    this.isAdminLoggedIn = !!localStorage.getItem('adminUid');

  }

  logout() {

    // Logout admin
    if (this.isAdminLoggedIn) {

      localStorage.removeItem('adminUid');
      localStorage.removeItem('adminNombre');
      localStorage.removeItem('adminEmail');

      this.isAdminLoggedIn = false;

      this.router.navigate(['/']);

      return;
    }

    // Logout estudiante
    this.authService.logout().subscribe({
      next: () => {

        console.log('Cerrando sesión...');

        this.router.navigate(['/login']);

      },
      error: (error) => {

        console.error('Error al cerrar sesión:', error);

      }
    });

  }

}