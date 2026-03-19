/**
 * @file app.ts
 * @description Componente raíz de la aplicación.
 * Contiene el layout principal (sidebar + header + router-outlet)
 * y define la animación de transición entre páginas.
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header }  from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    /**
     * Animación de slide horizontal entre rutas.
     * La página saliente se desplaza a la izquierda mientras
     * la entrante aparece desde la derecha.
     */
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
export class App {}
