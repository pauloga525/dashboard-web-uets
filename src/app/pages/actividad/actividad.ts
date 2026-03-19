/**
 * @file actividad.ts
 * @description Página de historial de actividad del sistema.
 * Muestra todas las acciones registradas agrupadas por fecha.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ActivityService } from '../../services/activity';
import { Actividad as ActividadModel, GrupoActividad } from '../../models';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css'
})
export class Actividad implements OnInit, OnDestroy {

  actividades: ActividadModel[] = [];
  private subs = new Subscription();

  constructor(public activityService: ActivityService) {}

  ngOnInit(): void {
    this.actividades = this.activityService.getActividadesRecientes();

    // Refresca los timestamps relativos cada minuto
    this.subs.add(
      interval(60000).subscribe(() => {
        this.actividades = [...this.actividades];
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ─── Delegados al servicio ──────────────────────────────────────────────────

  /** Agrupa las actividades por fecha (Hoy, Ayer, Hace N días). */
  getActividadesAgrupadas(): GrupoActividad[] {
    return this.activityService.getActividadesAgrupadas();
  }

  /** Indica si una actividad fue registrada hace menos de 5 minutos. */
  isNuevaActividad(a: ActividadModel): boolean {
    return this.activityService.isNuevaActividad(a);
  }
}
