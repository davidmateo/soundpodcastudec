import { Component, OnInit } from '@angular/core';
import { PodcastuService } from '../../services/podcastu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creador-dashboard.component.html',
  styleUrl: './creador-dashboard.component.css'
})
export class CreadorDashboardComponent implements OnInit {

  pendientes: any[] = [];
  aprobados: any[] = [];
  editando: any = null;
  nuevoPodcast = {
      titulo: '',
      description: '',
      url_audio: '',
      imagen: '',
      uid: ''
    };
  // 🔥 INYECCIÓN CORRECTA
  constructor(private podcastuService: PodcastuService) {}

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    try {
      const uid = localStorage.getItem('uid') || '';
      console.log('UID CREADOR:', uid);
      const res: any = await this.podcastuService.getMis(uid).toPromise();

      this.pendientes = res.filter((p: any) => p.estado_id === 1);
      this.aprobados = res.filter((p: any) => p.estado_id === 2);

    } catch (error) {
      console.error('❌ Error cargando podcasts:', error);
    }
  }

async crearPodcast() {
  try {
    const uid = localStorage.getItem('uid');

    console.log('UID CREADOR:', uid); // 🔥 DEBUG

    if (!uid) {
      console.error('❌ UID vacío');
      return;
    }

    this.nuevoPodcast.uid = uid;

    await this.podcastuService.crear(this.nuevoPodcast).toPromise();

    this.nuevoPodcast = {
      titulo: '',
      description: '',
      url_audio: '',
      imagen: '',
      uid: ''
    };

    this.cargar();

  } catch (error) {
    console.error('❌ Error creando podcast:', error);
  }
}

  editar(p: any) {
    this.editando = { ...p };
  }

  async actualizar() {
    try {
      await this.podcastuService.actualizar(this.editando).toPromise();
      this.editando = null;
      this.cargar();
    } catch (error) {
      console.error('❌ Error actualizando:', error);
    }
  }
async eliminar(id: number) {
  try {
    const uid = localStorage.getItem('uid') || '';

    await this.podcastuService.eliminar(id, uid).toPromise();

    this.cargar();

  } catch (error) {
    console.error('❌ Error eliminando:', error);
  }
}
}