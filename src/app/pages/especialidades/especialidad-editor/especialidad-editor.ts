/**
 * @file especialidad-editor.ts
 * @description Editor detallado de una especialidad académica.
 * Carga la especialidad por id desde el servicio y permite
 * editar sus datos organizados en tabs.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { EspecialidadService } from '../../../services/especialidad.service';
import { ActivityService } from '../../../services/activity';
import { Especialidad, Tab } from '../../../models';

@Component({
  selector: 'app-especialidad-editor',
  standalone: true,
  templateUrl: './especialidad-editor.html',
  styleUrl: './especialidad-editor.css',
  imports: [FormsModule, CommonModule]
})
export class EspecialidadEditor implements OnInit {

  /** Especialidad actualmente en edición. */
  especialidad: Especialidad | undefined;

  /** Nombre mostrado en el breadcrumb (pasado por navigation state). */
  breadcrumb = '';

  /** Tab activa en el editor. */
  tabActiva = 'general';

  /** Definición de las tabs de navegación del editor. */
  readonly tabs: Tab[] = [
    { id: 'general',      label: 'General'         },
    { id: 'imagen',       label: 'Imagen'           },
    { id: 'malla',        label: 'Malla Curricular' },
    { id: 'coordinador',  label: 'Coordinador'      },
    { id: 'publicacion',  label: 'Publicación'      },
  ];

  constructor(
    private route:               ActivatedRoute,
    private location:            Location,
    private router:              Router,
    private especialidadService: EspecialidadService,
    private activityService:     ActivityService
  ) {}

  ngOnInit(): void {
    // Tomar el nombre desde navigation state para el breadcrumb
    const nombre = history.state?.nombre;
    if (nombre) this.breadcrumb = nombre;

    const id = this.route.snapshot.paramMap.get('id');
    this.especialidad = this.especialidadService.getById(id ?? '');
  }

  // ─── Acciones ───────────────────────────────────────────────────────────────

  /** Persiste los cambios de la especialidad actual. */
  guardar(): void {
    if (!this.especialidad) return;
    this.especialidadService.actualizar(this.especialidad);
    this.activityService.agregarActividad(
      'especialidad',
      'Especialidad actualizada',
      `Se guardaron los cambios de "${this.especialidad.titulo}".`
    );
  }

  /** Elimina la especialidad y regresa a la lista. */
  eliminar(): void {
    if (!this.especialidad) return;
    this.activityService.agregarActividad(
      'especialidad',
      'Especialidad eliminada',
      `Se eliminó la especialidad "${this.especialidad.titulo}".`
    );
    this.especialidadService.eliminar(this.especialidad.id);
    this.router.navigate(['/especialidades']);
  }

  /** Regresa a la página anterior. */
  volver(): void {
    this.location.back();
  }
}
