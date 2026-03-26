/**
 * @file app.ts
 * @description Componente raíz. Arranca el monitor de inactividad si hay sesión activa.
 */
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header }  from './layout/header/header';
import { AuthService }      from './services/auth.service';
import { InactivityService } from './services/inactivity.service';
import { filter }  from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 })
        ], { optional: true }),
        query(':leave', [
          animate('250ms ease', style({ transform: 'translateX(-100%)', opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('250ms ease', style({ transform: 'translateX(0)', opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class App implements OnInit {
  isLoginPage = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private inactivity: InactivityService,
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.isLoginPage = e.urlAfterRedirects.startsWith('/login');
    });
  }

  ngOnInit(): void {
    // Si hay sesión activa al cargar la app, reanuda el monitor de inactividad
    if (this.auth.isAuthenticated()) {
      this.inactivity.start();
    }
  }
}
