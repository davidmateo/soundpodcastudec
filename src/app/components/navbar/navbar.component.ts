import { Component } from '@angular/core';
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
export class NavbarComponent {
  user$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    // Ahora sí: authService ya fue inicializado arriba
    this.user$ = this.authService.currentUser$;
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Cerrando sesión...');
        this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error); // Maneja cualquier error
      },
    });
  }
}
