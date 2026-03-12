import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
  isAdminLoggedIn = false; // 🔹 Estado para detectar si hay un admin logueado

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.currentUser$; // 🔹 Firebase user observable
  }

  ngOnInit() {
    // 🔹 Detecta si hay un admin logueado en localStorage
    this.isAdminLoggedIn = !!localStorage.getItem('adminUid');
  }

  logout() {
    // 🔹 Si es admin
    if (this.isAdminLoggedIn) {
      localStorage.removeItem('adminUid');
      localStorage.removeItem('adminNombre');
      localStorage.removeItem('adminEmail');
      this.isAdminLoggedIn = false;
      this.router.navigate(['/']);
      return;
    }

    // 🔹 Si es estudiante (Firebase Auth)
    this.authService.logout().subscribe({
      next: () => {
        console.log('Cerrando sesión...');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      },
    });
  }
}
