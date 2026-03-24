import { Component, OnInit } from '@angular/core';
import { UsuarioAdminService } from '../../services/usuario-admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderacion.component.html',
  styleUrl: './moderacion.component.css'
})
export class ModeracionComponent implements OnInit {

  // 🔥 FIX CLAVE
  usuarios: any[] = [];

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

  // ===============================
  // 🔹 LISTAR
  // ===============================
  async cargarUsuarios() {
    try {
      const res: any = await this.usuarioService.getUsuarios();
      //console.log('DATA BACKEND:', res);

      // 🔥 FIX IMPORTANTE (soporta ambos casos)
      this.usuarios = Array.isArray(res) ? res : res.usuarios || [];

    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    }
  }

  // ===============================
  // 🔹 CREAR
  // ===============================
async crearUsuario() {

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

  // ===============================
  // 🔹 ACTUALIZAR
  // ===============================
async actualizarUsuario() {

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
    try {
      await this.usuarioService.eliminarUsuario(uid);
      this.usuarios = this.usuarios.filter(u => u.uid !== uid);
      console.log(`Usuario con UID ${uid} eliminado correctamente.`);
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
    }
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
  }
}