import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creador-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './creador-login.component.html',
  styleUrl: './creador-login.component.css'
})
export class CreadorLoginComponent {
  uid: string = '';
  nombre: string = '';
  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // ✅ URL exacta de tu backend (según el router que mostraste)
  private apiUrl = 'http://localhost:3001/usuarios/login-creador';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.uid.trim()  || !this.email.trim()) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const creadorData = {
      uid: this.uid.trim(),
      email: this.email.trim(),
    };

    this.http.post(this.apiUrl, creadorData).subscribe({
      next: (response: any) => {
        this.loading = false;

        // ✅ La respuesta correcta del backend es { message, usuario }
        if (response?.usuario?.id_rol === 4) {
          localStorage.setItem('creadorUid', response.usuario.uid);
          localStorage.setItem('creadorEmail', response.usuario.email);

          // Redirigir al dashboard
          this.router.navigate(['/creador-dashboard']);
        } else {
          this.errorMessage = '🚫 No tienes permisos de creador';
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
          this.errorMessage = '🚫 Acceso denegado. Solo creadoes.';
        } else {
          this.errorMessage =
            error.error?.error || 'Error al verificar las credenciales.';
        }
      },
    });
  }
}
