import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { NotificacionesService, Notificacion } from '../../services/notificaciones.service';
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

  constructor(
    private estadisticasService: EstadisticasService,
    private notificacionesService: NotificacionesService
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

      // 🔔 Cargar notificaciones
      this.cargarNotificaciones();

    } catch (error) {
      console.error("❌ Error cargando estadísticas o notificaciones:", error);
    }
  }

  // 🔔 Cargar notificaciones
  cargarNotificaciones() {
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: data => {
        console.log('📣 Notificaciones recibidas:', data);
        this.notificaciones = data;
      },
      error: err => console.error('❌ Error cargando notificaciones:', err)
    });
  }

  // 🔔 Toggle dropdown
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // 🔔 Marcar todas como leídas
  marcarNotificacionesLeidas() {
    this.notificacionesService.marcarNotificacionesLeidas().subscribe({
      next: () => {
        this.notificaciones = []; // Limpiamos el array local
        console.log('✅ Todas las notificaciones marcadas como leídas');
      },
      error: err => console.error('❌ Error al marcar notificaciones como leídas:', err)
    });
  }

  // 🥧 Roles
  crearGraficaRoles(data: any[]) {
    const labels = data.map(d => d.rol);
    const valores = data.map(d => Math.round(Number(d.cantidad)));

    if (this.chartRoles) this.chartRoles.destroy();
    const ctx = document.getElementById('graficaRoles') as HTMLCanvasElement;
    if (!ctx) return;

    this.chartRoles = new Chart(ctx, {
      type: 'pie',
      data: { labels, datasets: [{ data: valores, backgroundColor: ['#5e17eb','#ff6384','#36a2eb','#ffce56'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 📊 Usuarios por mes
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
      data: { labels, datasets: [{ label: 'Usuarios por mes', data: valores, borderColor: '#36a2eb', backgroundColor: 'rgba(54,162,235,0.2)', fill: true, tension: 0.4 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
  }
}