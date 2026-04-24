import { Component, OnInit } from '@angular/core';
import { PodcastuService } from '../../services/podcastu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  constructor(
    private podcastuService: PodcastuService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cargar();
  }

  // ===============================
  // 🔐 SANITIZAR IFRAME
  // ===============================
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ===============================
  // 🎧 LIMPIAR SPOTIFY
  // ===============================
  limpiarYConvertirSpotify(url: string): string | null {

    if (!url) return null;

    url = url.trim();

    if (!url.includes('open.spotify.com')) return null;

    const cleanUrl = url.split('?')[0];

    const match = cleanUrl.match(
      /open\.spotify\.com\/(?:intl-[a-zA-Z]+\/)?(track|episode|album|playlist|show)\/([a-zA-Z0-9]+)/
    );

    if (!match) return null;

    const tipo = match[1];
    const id = match[2];

    return `https://open.spotify.com/embed/${tipo}/${id}`;
  }

  // ===============================
  // ✅ VALIDACIÓN
  // ===============================
  formValido(): boolean {
    const embed = this.limpiarYConvertirSpotify(this.nuevoPodcast.url_audio);

    return (
      this.nuevoPodcast.titulo.trim() !== '' &&
      this.nuevoPodcast.description.trim() !== '' &&
      !!embed &&
      this.esUrlValida(this.nuevoPodcast.imagen)
    );
  }

  esUrlValida(url: string): boolean {
    if (!url) return false;
    return /^(https?:\/\/)[^\s]+$/.test(url);
  }

  // ===============================
  // 🔹 CARGAR
  // ===============================
  async cargar() {
    try {
      const uid = localStorage.getItem('uid') || '';

      const res: any = await firstValueFrom(
        this.podcastuService.getMis(uid)
      );

      this.pendientes = res.filter((p: any) => p.estado_id === 1);
      this.aprobados = res.filter((p: any) => p.estado_id === 2);

    } catch (error) {
      console.error('❌ Error cargando podcasts:', error);
    }
  }

  // ===============================
  // ➕ CREAR
  // ===============================
  async crearPodcast() {
    try {

      const uid = localStorage.getItem('uid');
      const embed = this.limpiarYConvertirSpotify(this.nuevoPodcast.url_audio);

      if (!uid || !embed) {
        alert('❌ Solo se permiten links válidos de Spotify');
        return;
      }

      this.nuevoPodcast.uid = uid;
      this.nuevoPodcast.url_audio = embed;

      await firstValueFrom(
        this.podcastuService.crear(this.nuevoPodcast)
      );

      this.resetForm();
      this.cargar();

    } catch (error) {
      console.error('❌ Error creando podcast:', error);
    }
  }

  // ===============================
  // ✏️ EDITAR (CLAVE)
  // ===============================
  editar(p: any) {
    console.log('EDITANDO:', p); // 🔥 DEBUG

    this.editando = {
      id_podcast: p.id_podcast,
      titulo: p.titulo,
      description: p.description,
      url_audio: p.url_audio,
      imagen: p.imagen,
      uid: p.uid
    };
  }

  // ===============================
  // 💾 ACTUALIZAR
  // ===============================
async actualizar() {
  try {

    const uid = localStorage.getItem('uid');

    if (!uid) {
      alert('❌ Usuario no válido');
      return;
    }

    const dataActualizada = {
      id_podcast: this.editando.id_podcast,
      titulo: this.editando.titulo,
      description: this.editando.description,

      // 🔥 IMPORTANTE: NO perder estos datos
      imagen: this.editando.imagen,
      url_audio: this.editando.url_audio,
      uid: uid
    };

    console.log("ACTUALIZANDO:", dataActualizada);

    await firstValueFrom(
      this.podcastuService.actualizar(dataActualizada)
    );

    this.editando = null;
    this.cargar();

  } catch (error) {
    console.error('❌ Error actualizando:', error);
  }
}

  // ===============================
  // ❌ CANCELAR EDICIÓN
  // ===============================
  cancelarEdicion() {
    this.editando = null;
  }

  // ===============================
  // 🗑 ELIMINAR
  // ===============================
  async eliminar(id: number) {
    try {

      const uid = localStorage.getItem('uid') || '';

      await firstValueFrom(
        this.podcastuService.eliminar(id, uid)
      );

      this.cargar();

    } catch (error) {
      console.error('❌ Error eliminando:', error);
    }
  }

  // ===============================
  // 🔄 RESET
  // ===============================
  resetForm() {
    this.nuevoPodcast = {
      titulo: '',
      description: '',
      url_audio: '',
      imagen: '',
      uid: ''
    };
  }
}