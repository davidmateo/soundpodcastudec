import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  uid: string = '';
  nombre: string = '';
  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.uid.trim() || !this.nombre.trim() || !this.email.trim()) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // 🔹 Usar AuthService para login admin
    this.authService.loginAdmin(this.uid.trim(), this.nombre.trim(), this.email.trim())
      .subscribe({
        next: () => {
          this.loading = false;

          // 🔹 Redirigir al dashboard inmediatamente
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Error login admin:', err);

          this.errorMessage = err.message || 'Error al verificar las credenciales.';
        }
      });
  }
}