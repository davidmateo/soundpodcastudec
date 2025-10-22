import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  uid: string = '';
  nombre: string = '';
  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // ✅ URL exacta de tu backend (según el router que mostraste)
  private apiUrl = 'http://localhost:3000/usuarios/login-admin';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.uid.trim() || !this.nombre.trim() || !this.email.trim()) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const adminData = {
      uid: this.uid.trim(),
      nombre: this.nombre.trim(),
      email: this.email.trim(),
    };

    this.http.post(this.apiUrl, adminData).subscribe({
      next: (response: any) => {
        this.loading = false;

        // ✅ La respuesta correcta del backend es { message, usuario }
        if (response?.usuario?.id_rol === 1) {
          localStorage.setItem('adminUid', response.usuario.uid);
          localStorage.setItem('adminNombre', response.usuario.nombre);
          localStorage.setItem('adminEmail', response.usuario.email);

          // Redirigir al dashboard
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.errorMessage = '🚫 No tienes permisos de administrador.';
        }
      },
      error: (error) => {     
        this.loading = false;
        console.error('❌ Error al iniciar sesión:', error);

        // Mostrar mensajes específicos del backend
        if (error.status === 404) {
          this.errorMessage =
            'Usuario no encontrado. No tienes permisos para acceder.';
        } else if (error.status === 403) {
          this.errorMessage = '🚫 Acceso denegado. Solo administradores.';
        } else {
          this.errorMessage =
            error.error?.error || 'Error al verificar las credenciales.';
        }
      },
    });
  }
}
