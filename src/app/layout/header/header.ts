/**
 * @file header.ts
 * @description Componente de encabezado global.
 * Gestiona: breadcrumbs dinámicos, panel de notificaciones,
 * menú de administrador y toggle de dark mode.
 */
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { NotificationService } from '../../services/notification';
import { Notificacion, BreadcrumbItem } from '../../models';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  animations: [
    // Animación de entrada escalonada para items de notificaciones
    trigger('listaNotificaciones', [
      transition(':enter', []),
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(80, [animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
        ], { optional: true })
      ])
    ]),
    // Animación de salida al eliminar una notificación
    trigger('eliminarNotif', [
      transition(':leave', [
        animate('250ms ease', style({
          opacity: 0, transform: 'translateX(40px)',
          height: 0, margin: 0, paddingTop: 0, paddingBottom: 0
        }))
      ])
    ]),
    // Animación del indicador de notificación leída/no leída
    trigger('estadoLeida', [
      state('noLeida', style({ opacity: 1, transform: 'scale(1)' })),
      state('leida',   style({ opacity: 0, transform: 'scale(0.6)' })),
      transition('noLeida => leida', [animate('200ms ease-out')]),
      transition('leida => noLeida', [animate('200ms ease-in')])
    ])
  ]
})
export class Header implements OnInit, OnDestroy {

  menuAbierto          = false;
  darkMode             = false;
  notificacionesAbiertas = false;
  notificaciones: Notificacion[] = [];
  breadcrumbs: BreadcrumbItem[]  = [];

  private subs = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Refresca timestamps de notificaciones cada minuto
    this.subs.add(
      interval(60000).subscribe(() => {
        this.notificaciones = [...this.notificaciones];
      })
    );

    // Suscripción reactiva al servicio de notificaciones
    this.subs.add(
      this.notificationService.notificaciones$.subscribe(data => {
        this.notificaciones = data.filter(n => !n.eliminada);
      })
    );

    // Construye breadcrumbs en cada cambio de ruta
    this.subs.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.construirBreadcrumbs())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ─── Breadcrumbs ────────────────────────────────────────────────────────────

  /**
   * Recorre el árbol de rutas activas y construye el array de breadcrumbs.
   * Para rutas dinámicas como especialidades/:id, inserta el paso padre
   * automáticamente y usa el nombre pasado por navigation state.
   */
  private construirBreadcrumbs(): void {
    let route = this.route.root;
    const crumbs: BreadcrumbItem[] = [];
    let url = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (!route.snapshot.url.length) continue;

      url += '/' + route.snapshot.url.map(s => s.path).join('/');
      let label: string = route.snapshot.data['breadcrumb'];

      // Ruta dinámica: insertar "Especialidades" como paso intermedio
      if (route.snapshot.routeConfig?.path === 'especialidades/:id') {
        if (!crumbs.find(b => b.url === '/especialidades')) {
          crumbs.push({ label: 'Especialidades', url: '/especialidades' });
        }
        const nombre = history.state?.nombre;
        if (nombre) label = nombre;
      }

      if (label) crumbs.push({ label, url });
    }

    this.breadcrumbs = crumbs;
  }

  // ─── Menú admin ─────────────────────────────────────────────────────────────

  toggleMenu(): void  { this.menuAbierto = !this.menuAbierto; }
  cerrarMenu(): void  { this.menuAbierto = false; }

  // ─── Dark mode ──────────────────────────────────────────────────────────────

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  // ─── Notificaciones ─────────────────────────────────────────────────────────

  toggleNotificaciones(): void {
    this.notificacionesAbiertas = !this.notificacionesAbiertas;
  }

  /** Número de notificaciones no leídas (usado en el badge). */
  get notificationCount(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  toggleLeida(n: Notificacion): void {
    this.notificationService.marcarComoLeida(n);
  }

  marcarTodasLeidas(): void {
    this.notificationService.marcarTodasLeidas();
  }

  eliminarNotificacion(n: Notificacion): void {
    this.notificationService.eliminarNotificacion(n);
  }

  getTiempo(fecha: Date): string {
    return this.notificationService.getTiempoRelativo(fecha);
  }

  // ─── Eventos globales ───────────────────────────────────────────────────────

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.menuAbierto = false;
    this.notificacionesAbiertas = false;
  }

  @HostListener('document:click', ['$event'])
  clickFuera(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-admin'))         this.menuAbierto = false;
    if (!target.closest('.menu-notificaciones')) this.notificacionesAbiertas = false;
  }
}
