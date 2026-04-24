import { Component, OnInit } from '@angular/core';
import { UsuarioAdminService } from '../../services/usuario-admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-moderacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './moderacion.component.html',
  styleUrl: './moderacion.component.css'
})
export class ModeracionComponent implements OnInit {

  usuarios: any[] = [];

  // 🔹 PAGINACIÓN
  paginaActual = 1;
  itemsPorPagina = 8;

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.usuarios.slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.itemsPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas()) this.paginaActual++;
  }

  anteriorPagina() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  // 🔹 UI CONTROL
  mostrarCrear = false;

  toggleCrear() {
    this.mostrarCrear = !this.mostrarCrear;
  }

  nuevoUsuario = {
    uid: '',
    email: '',
    nombre: '',
    apellido: '',
    id_rol: 3
  };

  usuarioEditando: any = null;

  constructor(private usuarioService: UsuarioAdminService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      const res: any = await this.usuarioService.getUsuarios();
      this.usuarios = Array.isArray(res) ? res : res.usuarios || [];
      this.paginaActual = 1;
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    }
  }

  // ===============================
  // 🔹 CREAR
  // ===============================
  async crearUsuario() {

    const confirmacion = confirm('¿Crear este usuario?');
    if (!confirmacion) return;

    if (!this.nuevoUsuario.uid ||
        !this.nuevoUsuario.email ||
        !this.nuevoUsuario.nombre ||
        !this.nuevoUsuario.apellido ||
        !this.nuevoUsuario.id_rol) {

      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      await this.usuarioService.crearUsuario(this.nuevoUsuario);

      this.nuevoUsuario = {
        uid: '',
        email: '',
        nombre: '',
        apellido: '',
        id_rol: 3
      };

      this.mostrarCrear = false;
      this.cargarUsuarios();

    } catch (error) {
      console.error('❌ Error creando usuario:', error);
    }
  }

  // ===============================
  // 🔹 EDITAR
  // ===============================
  editarUsuario(usuario: any) {
    this.usuarioEditando = { ...usuario };
  }

  async actualizarUsuario() {

    const confirmacion = confirm('¿Guardar cambios del usuario?');
    if (!confirmacion) return;

    if (!this.usuarioEditando.email ||
        !this.usuarioEditando.nombre ||
        !this.usuarioEditando.apellido ||
        !this.usuarioEditando.id_rol) {

      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      await this.usuarioService.actualizarUsuario(
        this.usuarioEditando.uid,
        this.usuarioEditando
      );

      this.usuarioEditando = null;
      this.cargarUsuarios();

    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
    }
  }

  // ===============================
  // 🔹 ELIMINAR
  // ===============================
  async eliminarUsuario(uid: string) {

    const confirmacion = confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmacion) return;

    try {
      await this.usuarioService.eliminarUsuario(uid);
      this.usuarios = this.usuarios.filter(u => u.uid !== uid);
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
    }
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
  }
}