import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router'; // ✅ Importa Router además del RouterModule

@Component({
  selector: 'app-form-podcast',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form-podcast.component.html',
  styleUrls: ['./form-podcast.component.css']
})
export class FormPodcastComponent implements OnInit {
  nombre = '';
  correo = '';
  nuevo_uid = '';
  uid_firebase = ''; // 🔹 se extrae automáticamente
  mensaje = '';
  cargando = false;

  // ✅ Inyectamos el Router aquí
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router // <-- Esta línea es la clave
  ) {}

  ngOnInit() {
    // 🔹 Detecta al usuario logueado apenas entra
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid_firebase = user.uid;
        this.correo = user.email || '';
      } else {
        console.warn('⚠️ No hay usuario autenticado.');
      }
    });
  }

  async enviarSolicitud() {
    this.cargando = true;
    this.mensaje = '';

    try {
      if (!this.uid_firebase) {
        this.mensaje = 'Debes iniciar sesión antes de enviar la solicitud.';
        this.cargando = false;
        return;
      }

      const solicitud = {
        uid_firebase: this.uid_firebase,
        nombre: this.nombre,
        correo: this.correo,
        nuevo_uid: this.nuevo_uid
      };

      const res: any = await this.http
        .post('http://localhost:3000/solicitudes', solicitud)
        .toPromise();

      this.mensaje = res.mensaje || '✅ Solicitud enviada correctamente.';
      this.nombre = '';
      this.nuevo_uid = '';

      // ✅ Redirige después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/']); // 🔹 Ahora sí funciona
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error al enviar solicitud:', error);
      this.mensaje = error.error?.error || 'Error al enviar la solicitud.';
    }

    this.cargando = false;
  }
}
