import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, // importante si usas componentes standalone
  imports: [CommonModule, RouterModule], // agrega RouterModule
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] // ojo: es style**Urls** (plural)
})
export class AdminDashboardComponent {}

