import { Component, HostListener, ElementRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { NotificationService } from '../../services/notification';
import { OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  animations: [

      trigger('listaNotificaciones', [

      transition(':enter', []),

      transition('* => *', [

      query(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      stagger(80, [
      animate('250ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' }))
      ])
      ], { optional: true })

      ])

      ]),

      trigger('eliminarNotif', [

      transition(':leave', [

      animate('250ms ease',
      style({
      opacity: 0,
      transform: 'translateX(40px)',
      height: 0,
      margin: 0,
      paddingTop: 0,
      paddingBottom: 0
    }))

  ])

  ]),
      trigger('estadoLeida', [

      state('noLeida', style({
      opacity: 1,
      transform: 'scale(1)'
      })),

      state('leida', style({
      opacity: 0,
      transform: 'scale(0.6)'
      })),

      transition('noLeida => leida', [
      animate('200ms ease-out')
      ]),

      transition('leida => noLeida', [
      animate('200ms ease-in')
      ])

      ])



]
})
export class Header implements OnInit {

  menuAbierto = false;
  darkMode = false;
  notificacionesAbiertas = false;

  constructor(
  private elementRef: ElementRef,
  private notificationService: NotificationService,
  private router: Router,
  private route: ActivatedRoute
  ){}

  // MENU ADMIN
  toggleMenu(){
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(){
    this.menuAbierto = false;
  }

  // CERRAR CON ESC
  @HostListener('document:keydown.escape')
  handleEscape(){
    this.menuAbierto = false;
    this.notificacionesAbiertas = false;
  }

  // CERRAR AL HACER CLICK FUERA
  @HostListener('document:click', ['$event'])
  clickFuera(event: Event){

    const target = event.target as HTMLElement;

    if(!target.closest('.menu-admin')){
      this.menuAbierto = false;
    }

    if(!target.closest('.menu-notificaciones')){
      this.notificacionesAbiertas = false;
    }
  }

  // DARK MODE
  toggleDarkMode(){

    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

  }

  // NOTIFICACIONES
  notificaciones:any[] = [];
  breadcrumbs:any[] = [];

  ngOnInit(){

    interval(60000).subscribe(()=>{
    this.notificaciones = [...this.notificaciones];
    });
    
   
    this.notificationService.notificaciones$
    .subscribe(data=>{
    this.notificaciones = data.filter(n => !n.eliminada);
    });


    this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {

    let route = this.route.root;
    let breadcrumbs:any[] = [];
    let url = '';

    while(route.firstChild){

      route = route.firstChild;

      if(route.snapshot.url.length){

        url += '/' + route.snapshot.url.map(segment => segment.path).join('/');

        if(route.snapshot.data['breadcrumb']){
          breadcrumbs.push({
            label: route.snapshot.data['breadcrumb'],
             url: url
          });
        }

      }

    }

    this.breadcrumbs = breadcrumbs;

  });

  }

  // CONTADOR AUTOMATICO
  get notificationCount(){
    return this.notificaciones.filter(n => !n.leida).length;
  }

  // ABRIR PANEL
  toggleNotificaciones(){
    this.notificacionesAbiertas = !this.notificacionesAbiertas;
  }

  // MARCAR LEIDA / NO LEIDA
  toggleLeida(n:any){
    this.notificationService.marcarComoLeida(n);
  }
  marcarTodasLeidas(){

    this.notificaciones.forEach(n => {
    this.notificationService.marcarComoLeida(n);
    });

  }
  eliminarNotificacion(n:any){

    this.notificationService.eliminarNotificacion(n);

  }

  //OBTENER TIEMPO DE NOTIFICACION
  getTiempo(fecha: Date){
    return this.notificationService.getTiempoRelativo(fecha);
  }

  

}