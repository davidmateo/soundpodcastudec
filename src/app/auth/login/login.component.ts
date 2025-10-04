import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    console.log('Intentando iniciar sesión con:', email, password);

    try {
      const userDb = await this.authService.login(email, password);
      console.log('Inicio de sesión exitoso en DB:', userDb);

      // ✅ Redirige al index
      this.router.navigate(['/index']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);

      // 🔹 Manejo de errores de Firebase Auth
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No se encuentra un usuario con este correo.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'La contraseña es incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El correo electrónico no es válido.';
      }
      // 🔹 Manejo de errores del backend (Express)
      else if (error.status === 401) {
        this.errorMessage = 'Tu sesión no es válida o el servidor rechazó el token.';
      } else {
        this.errorMessage = 'Ocurrió un error al iniciar sesión.';
      }
    }
  }
}
