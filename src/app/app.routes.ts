import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './auth/auth.guard'; // Importa tu guardia de autenticación
import { FormPodcastComponent } from './components/form-podcast/form-podcast.component';

export const routes: Routes = [
  // Ruta para el login, accesible para todos
  { path: 'login', component: LoginComponent },

  // Ruta para el registro, accesible para todos
  { path: 'register', component: RegisterComponent },
  //ruta formulario  de solicitud
  {path:'form-p', component: FormPodcastComponent},

  // Ruta protegida por el AuthGuard, solo accesible si el usuario está autenticado
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },

  // Ruta de redirección en caso de ruta no encontrada
  { path: '**', redirectTo: 'login' } // Redirige a login si no se encuentra la ruta
];
