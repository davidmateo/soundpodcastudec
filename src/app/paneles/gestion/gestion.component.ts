import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { PodcastuService } from '../../services/podcastu.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTabsModule],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

  solicitudes: any[] = [];
  podcastSolicitudes: any[] = [];
  loading = true;

  tabIndex = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private solicitudesService: SolicitudesService,
    private podcastService: PodcastuService
  ) {}

  ngOnInit() {
    this.cargarTodo();
  }
  getSafeSpotifyUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  // ===============================
  // 🔹 CARGA GENERAL
  // ===============================
  cargarTodo() {
    this.loading = true;

    Promise.all([
      this.cargarSolicitudes(),
      this.cargarPodcasts()
    ]).finally(() => {
      this.loading = false;
    });
  }

  cargarSolicitudes(): Promise<void> {
    return new Promise((resolve) => {
      this.solicitudesService.getSolicitudes().subscribe({
        next: (data) => {
          this.solicitudes = data;
          resolve();
        },
        error: (err) => {
          console.error("❌ Error solicitudes:", err);
          resolve();
        }
      });
    });
  }

  cargarPodcasts(): Promise<void> {
    return new Promise((resolve) => {
      this.podcastService.getAdmin().subscribe({
        next: (data) => {
          this.podcastSolicitudes = data;
          resolve();
        },
        error: (err) => {
          console.error("❌ Error podcasts:", err);
          resolve();
        }
      });
    });
  }

  // ===============================
  // 🔹 ACCIONES ROL
  // ===============================
  cambiarEstado(s: any, estado: number) {
    this.solicitudesService.actualizarSolicitud(s.id, estado).subscribe({
      next: () => this.cargarSolicitudes(),
      error: (err) => console.error(err)
    });
  }

  // ===============================
  // 🔹 ACCIONES PODCAST
  // ===============================
  cambiarEstadoPodcast(id: number, estado: number) {
    this.podcastService.cambiarEstado(id, estado).subscribe({
      next: () => this.cargarPodcasts(),
      error: (err) => console.error(err)
    });
  }

  // ===============================
  // 🔹 GETTERS (FILTROS)
  // ===============================

  get solicitudesPendientes() {
    return this.solicitudes.filter(s => s.estado === 'pendiente');
  }

  get solicitudesHistorial() {
    return this.solicitudes.filter(s => s.estado !== 'pendiente');
  }

  get podcastsPendientes() {
    return this.podcastSolicitudes.filter(p => p.estado_id === 1);
  }

  get podcastsHistorial() {
    return this.podcastSolicitudes.filter(p => p.estado_id !== 1);
  }

  // ===============================
  // 🔹 CONTADORES
  // ===============================

  get pendientesCount() {
    return this.solicitudesPendientes.length;
  }

  get historialRolesCount() {
    return this.solicitudesHistorial.length;
  }

  get podcastPendientesCount() {
    return this.podcastsPendientes.length;
  }

  get podcastHistorialCount() {
    return this.podcastsHistorial.length;
  }
}