import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Necesario para redireccionar


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
    private router: Router // Inyectar Router
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
      await this.authService.login(email, password);
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/index']); // ✅ Redirección después del login
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);

      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No se encuentra un usuario con este correo.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'La contraseña es incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El correo electrónico no es válido.';
      } else {
        this.errorMessage = 'Ocurrió un error al iniciar sesión.';
      }
    }
  }
}
