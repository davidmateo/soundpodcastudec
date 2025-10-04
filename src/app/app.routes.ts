import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './auth/auth.guard'; // Importa tu guardia de autenticación
import { FormPodcastComponent } from './components/form-podcast/form-podcast.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GestionComponent } from './paneles/gestion/gestion.component';
import { ModeracionComponent } from './paneles/moderacion/moderacion.component';
import { BannersComponent } from './paneles/banners/banners.component';
import { NuevoPodcastComponent } from './paneles/nuevo-podcast/nuevo-podcast.component';


export const routes: Routes = [
  // Ruta para el login, accesible para todos
  { path: 'login', component: LoginComponent },

  // Ruta para el registro, accesible para todos
  { path: 'register', component: RegisterComponent },
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  {path:  'admin-login', component: AdminLoginComponent},
  {path:  'gestion', component: GestionComponent},
  {path:  'moderacion', component: ModeracionComponent},
  {path: 'nuevo_podcast', component : NuevoPodcastComponent},
  {path:  'banners', component: BannersComponent},  //ruta formulario  de solicitud
  {path:'form-p', component: FormPodcastComponent},

  // Ruta protegida por el AuthGuard, solo accesible si el usuario está autenticado
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },

  // Ruta de redirección en caso de ruta no encontrada
  { path: '**', redirectTo: 'login' } // Redirige a login si no se encuentra la ruta
];
