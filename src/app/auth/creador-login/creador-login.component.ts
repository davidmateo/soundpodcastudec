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
  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  private apiUrl = 'http://localhost:3001/usuarios/login-creador';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {

    if (!this.uid?.trim()) {
      this.errorMessage = '⚠️ El UID es obligatorio.';
      return;
    }

    if (!this.email?.trim()) {
      this.errorMessage = '⚠️ El email es obligatorio.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const creadorData = {
      uid: this.uid.trim(),
      email: this.email.trim(),
    };

    console.log('📤 UID enviado:', creadorData.uid);

    this.http.post(this.apiUrl, creadorData).subscribe({
      next: (response: any) => {

        this.loading = false;

        console.log('📥 Respuesta backend:', response);

        if (!response?.usuario) {
          this.errorMessage = '❌ Respuesta inválida del servidor';
          return;
        }

        if (response.usuario.id_rol === 4) {

          // 🔥 LIMPIAR TODO (evita conflictos)
          localStorage.clear();

          // 🔥 GUARDAR BIEN
          localStorage.setItem('uid', response.usuario.uid);
          localStorage.setItem('userType', 'creador');

          console.log('✅ UID guardado:', response.usuario.uid);

          this.router.navigate(['/creador-dashboard']);

        } else {
          this.errorMessage = '🚫 No tienes permisos de creador';
        }
      },

      error: (error) => {

        this.loading = false;

        console.error('❌ Error al iniciar sesión:', error);

        if (error.status === 404) {
          this.errorMessage = 'Usuario no encontrado.';
        } else if (error.status === 403) {
          this.errorMessage = '🚫 Acceso denegado. Solo creadores.';
        } else {
          this.errorMessage =
            error.error?.error || 'Error al verificar credenciales.';
        }
      }
    });
  }
}
