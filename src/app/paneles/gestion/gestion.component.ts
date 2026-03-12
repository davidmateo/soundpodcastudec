import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

  solicitudes: any[] = [];
  loading = true;

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.solicitudesService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Error cargando solicitudes:", err);
        this.loading = false;
      }
    });
  }
}
