import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user$: Observable<any>;

  isAdmin = false;
  isCreador = false;
  isUsuario = false;
  isLogged = false;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.user$.subscribe(() => this.updateUserStatus());
    this.authService.userType$.subscribe(() => this.updateUserStatus());

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateUserStatus());
  }

  updateUserStatus() {
    const userType = localStorage.getItem('userType');
    const uid = localStorage.getItem('uid');
 console.log('Navbar status:', { isAdmin: this.isAdmin, isCreador: this.isCreador, isUsuario: this.isUsuario, isLogged: this.isLogged });
    this.isAdmin = userType === 'admin';
    this.isCreador = userType === 'creador';
    this.isUsuario = userType === 'usuario';
    this.isLogged = !!uid;

   
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}