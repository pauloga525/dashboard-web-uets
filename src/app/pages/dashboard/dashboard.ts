/**
 * @file dashboard.ts
 * @description Panel principal del sistema.
 * Muestra estadísticas generales y actividad reciente.
 * @see ActivityService, EspecialidadService
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ActivityService } from '../../services/activity';
import { EspecialidadService } from '../../services/especialidad.service';
import { Actividad, GrupoActividad } from '../../models';

/** Sección del sitio web público gestionada desde el dashboard. */
interface SeccionHome {
  nombre: string;
  estado: 'activo' | 'revision' | 'inactivo';
  detalle: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [RouterModule, CommonModule],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  /** Estadísticas generales mostradas en las tarjetas superiores. */
  stats = {
    estudiantes:       1240,
    estudiantesCambio: 12,
    especialidades:    0,
    eventos:           15,
    usuarios:          856,
    usuariosCambio:    5,
  };

  actividades: Actividad[] = [];

  /** Secciones del sitio público con su estado de publicación. */
  seccionesHome: SeccionHome[] = [
    { nombre: 'Slider Principal',  estado: 'activo',   detalle: '4 slides' },
    { nombre: 'Próximos Cursos',   estado: 'activo',   detalle: 'Auto-update' },
    { nombre: 'Testimonios',       estado: 'revision', detalle: 'Pendiente de revisión' },
  ];

  private subs = new Subscription();

  constructor(
    public activityService: ActivityService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    // Sincroniza el contador de especialidades con el servicio reactivo
    this.subs.add(
      this.especialidadService.especialidades$.subscribe(lista => {
        this.stats.especialidades = lista.length;
      })
    );

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
  isNuevaActividad(a: Actividad): boolean {
    return this.activityService.isNuevaActividad(a);
  }
}
