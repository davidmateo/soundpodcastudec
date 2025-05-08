import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Asegúrate de que Router esté importado
import { AuthService } from '../services/auth.service'; // Asegúrate de que el servicio esté importado

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Método para cerrar sesión
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
