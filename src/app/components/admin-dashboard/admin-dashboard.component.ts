import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { NotificacionesService, Notificacion } from '../../services/notificaciones.service';
import { AdminBackupService } from '../../services/admin-backup.service'; // 🔥 NUEVO
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  total = 0;
  nuevos = 0;
  rolesResumen: any[] = [];

  private chartRoles: Chart | null = null;
  private chartMeses: Chart | null = null;

  // 🔔 Notificaciones
  notificaciones: Notificacion[] = [];
  dropdownOpen: boolean = false;

  // 🔥 BACKUP
  selectedFile: File | null = null;

  constructor(
    private estadisticasService: EstadisticasService,
    private notificacionesService: NotificacionesService,
    private backupService: AdminBackupService // 🔥 NUEVO
  ) {}

  async ngOnInit() {
    try {
      // 📊 Estadísticas
      const data = await this.estadisticasService.getEstadisticas();

      this.total = data.total;
      this.nuevos = data.nuevos;

      this.rolesResumen = data.porRol.map((r: any) => ({
        rol: r.rol,
        cantidad: Math.round(Number(r.cantidad))
      }));

      setTimeout(() => {
        this.crearGraficaRoles(data.porRol);
        this.crearGraficaUsuariosPorMes(data.porDia);
      }, 150);

      // 🔔 Notificaciones
      this.cargarNotificaciones();

    } catch (error) {
      console.error("❌ Error cargando estadísticas o notificaciones:", error);
    }
  }

  // ===============================
  // 🔔 NOTIFICACIONES
  // ===============================
  cargarNotificaciones() {
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: data => this.notificaciones = data,
      error: err => console.error('❌ Error notificaciones:', err)
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  marcarNotificacionesLeidas() {
    this.notificacionesService.marcarNotificacionesLeidas().subscribe({
      next: () => this.notificaciones = [],
      error: err => console.error('❌ Error:', err)
    });
  }

  // ===============================
  // 📊 GRÁFICAS
  // ===============================
  crearGraficaRoles(data: any[]) {
    const labels = data.map(d => d.rol);
    const valores = data.map(d => Math.round(Number(d.cantidad)));

    if (this.chartRoles) this.chartRoles.destroy();
    const ctx = document.getElementById('graficaRoles') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartRoles = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data: valores }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  crearGraficaUsuariosPorMes(data: any[]) {
    const hoy = new Date();
    const meses: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2,'0')}`;
      meses[key] = 0;
    }

    data.forEach(d => {
      const fecha = new Date(d.fecha);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2,'0')}`;
      if (meses[key] !== undefined) meses[key] += 1;
    });

    const labels = Object.keys(meses);
    const valores = Object.values(meses).map(v => Math.round(v));

    if (this.chartMeses) this.chartMeses.destroy();
    const ctx = document.getElementById('graficaUsuariosMes') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartMeses = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{ data: valores }]
      },
      options: { responsive: true }
    });
  }

  // ===============================
  // 🔥 BACKUP
  // ===============================

  descargarBackup() {
    this.backupService.crearBackup().subscribe({
      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `backup-${new Date().toISOString()}.sql`;

        a.click();
        window.URL.revokeObjectURL(url);

        console.log('✅ Backup descargado');

      },
      error: err => console.error('❌ Error backup:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  restaurarBackup() {
    if (!this.selectedFile) {
      alert('⚠️ Selecciona un archivo');
      return;
    }

    this.backupService.restaurarBackup(this.selectedFile).subscribe({
      next: () => {
        alert('✅ Base de datos restaurada');
      },
      error: err => {
        console.error('❌ Error restore:', err);
        alert('Error al restaurar');
      }
    });
  }
}