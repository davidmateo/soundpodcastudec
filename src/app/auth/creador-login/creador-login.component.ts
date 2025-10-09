import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creador-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creador-login.component.html',
  styleUrl: './creador-login.component.css'
})
export class CreadorLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (
      this.username.trim().toLowerCase() === 'nvguaqueta@gmail.com' &&
      this.password.trim() === '123456'
    ) {
      this.router.navigate(['/creador-dashboard']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
