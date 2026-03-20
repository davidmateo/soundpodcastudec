import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
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

  private chartUsuarios: Chart | null = null;
  private chartRoles: Chart | null = null;
  private chartMeses: Chart | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  async ngOnInit() {
    try {
      const data = await this.estadisticasService.getEstadisticas();

      console.log("📊 DATA BACKEND:", data);

      this.total = data.total;
      this.nuevos = data.nuevos;

      this.rolesResumen = data.porRol.map((r: any) => ({
        rol: r.rol,
        cantidad: Math.round(Number(r.cantidad))
      }));

      // 🔥 Esperar a que el DOM esté listo
      setTimeout(() => {
        this.crearGraficaRoles(data.porRol);
        this.crearGraficaUsuariosPorMes(data.porDia);
      }, 150);

    } catch (error) {
      console.error("❌ Error cargando estadísticas:", error);
    }
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
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: [
            '#5e17eb',
            '#ff6384',
            '#36a2eb',
            '#ffce56'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  // 📊 Usuarios por mes (últimos 6 meses)
  crearGraficaUsuariosPorMes(data: any[]) {

    const hoy = new Date();
    const meses: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      meses[`${año}-${mes}`] = 0;
    }

    data.forEach(d => {
      const fecha = new Date(d.fecha);
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const key = `${año}-${mes}`;
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
        datasets: [{
          label: 'Usuarios por mes',
          data: valores,
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54,162,235,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }
}