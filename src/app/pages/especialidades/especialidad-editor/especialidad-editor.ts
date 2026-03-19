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

  /** Especialidad actualmente en edición (copia de trabajo). */
  especialidad: Especialidad | undefined;

  /** Nombre mostrado en el breadcrumb (pasado por navigation state). */
  breadcrumb = '';

  /** Tab activa en el editor. */
  tabActiva = 'general';

  /** Estado de guardado: false = Borrador, true = Listo. */
  guardado = false;

  /** Controla la visibilidad del modal de confirmación de eliminación. */
  confirmarEliminar = false;

  /** Definición de las tabs de navegación del editor. */
  readonly tabs: Tab[] = [
    { id: 'general',     label: 'General'         },
    { id: 'imagen',      label: 'Imagen'           },
    { id: 'malla',       label: 'Malla Curricular' },
    { id: 'coordinador', label: 'Coordinador'      },
    { id: 'publicacion', label: 'Publicación'      },
  ];

  constructor(
    private route:               ActivatedRoute,
    private location:            Location,
    private router:              Router,
    private especialidadService: EspecialidadService,
    private activityService:     ActivityService
  ) {}

  ngOnInit(): void {
    const nombre = history.state?.nombre;
    if (nombre) this.breadcrumb = nombre;

    const id = this.route.snapshot.paramMap.get('id');
    const original = this.especialidadService.getById(id ?? '');
    // Deep clone via JSON para desacoplar completamente del objeto en el servicio
    if (original) this.especialidad = JSON.parse(JSON.stringify(original));
  }

  // ─── Acciones ───────────────────────────────────────────────────────────────

  /** Persiste los cambios y marca el estado como "Listo". */
  guardar(): void {
    if (!this.especialidad) return;
    this.especialidadService.actualizar(this.especialidad);
    this.activityService.agregarActividad(
      'especialidad',
      'Especialidad actualizada',
      `Se guardaron los cambios de "${this.especialidad.titulo}".`
    );
    this.guardado = true;
  }

  /** Abre el modal de confirmación de eliminación. */
  pedirEliminar(): void {
    this.confirmarEliminar = true;
  }

  /** Cancela la eliminación y cierra el modal. */
  cancelarEliminar(): void {
    this.confirmarEliminar = false;
  }

  /** Confirma la eliminación, registra actividad y navega a la lista. */
  confirmarEliminarEspecialidad(): void {
    if (!this.especialidad) return;
    this.activityService.agregarActividad(
      'especialidad',
      'Especialidad eliminada',
      `Se eliminó la especialidad "${this.especialidad.titulo}".`
    );
    this.especialidadService.eliminar(this.especialidad.id);
    this.router.navigate(['/especialidades']);
  }

  /** Marca el estado como borrador al detectar cualquier cambio en el form. */
  onCambio(): void {
    this.guardado = false;
  }

  /** Regresa a la página anterior. */
  volver(): void {
    this.location.back();
  }
}
