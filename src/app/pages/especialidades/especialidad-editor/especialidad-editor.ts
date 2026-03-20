/**
 * @file especialidad-editor.ts
 * @description Editor completo de una especialidad académica.
 * Cubre todas las secciones de la página pública: General, Imagen,
 * Malla Curricular, Coordinador, Perfil del Estudiante, Futuro Profesional,
 * Instalaciones, Admisiones, Testimonios y Publicación.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { EspecialidadService } from '../../../services/especialidad.service';
import { ActivityService } from '../../../services/activity';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
import {
  Especialidad, Tab,
  AnioMalla,
  SalidaProfesional,
  ImagenInstalacion,
  BotonAdmision,
  Testimonio,
} from '../../../models';

@Component({
  selector: 'app-especialidad-editor',
  standalone: true,
  templateUrl: './especialidad-editor.html',
  styleUrl: './especialidad-editor.css',
  imports: [FormsModule, CommonModule, SafeUrlPipe],
})
export class EspecialidadEditor implements OnInit {

  /** Especialidad en edición (copia de trabajo, desacoplada del servicio). */
  especialidad: Especialidad | undefined;

  /** Nombre mostrado en el breadcrumb (pasado por navigation state). */
  breadcrumb = '';

  /** Tab activa. */
  tabActiva = 'general';

  /** false = Borrador, true = Listo. */
  guardado = false;

  /** Modal de confirmación de eliminación. */
  confirmarEliminar = false;

  /** Tabs del editor. */
  readonly tabs: Tab[] = [
    { id: 'general',     label: 'General'          },
    { id: 'imagenes',    label: 'Imágenes'         },
    { id: 'malla',       label: 'Malla Curricular' },
    { id: 'coordinador', label: 'Coordinador'      },
    { id: 'admisiones',  label: 'Admisiones'       },
    { id: 'publicacion', label: 'Publicación'      },
  ];

  /** Iconos disponibles para salidas profesionales. */
  readonly iconosSalida = [
    'gear','robot','computer','chip','terminal','wrench',
    'factory','hammer','car','engine','bolt','plug',
    'battery','users','book','clipboard','atom','microscope',
  ];

  constructor(
    private route:               ActivatedRoute,
    private location:            Location,
    private router:              Router,
    private especialidadService: EspecialidadService,
    private activityService:     ActivityService,
  ) {}

  ngOnInit(): void {
    const nombre = history.state?.nombre;
    if (nombre) this.breadcrumb = nombre;

    const id = this.route.snapshot.paramMap.get('id');
    const original = this.especialidadService.getById(id ?? '');
    if (original) {
      // Deep clone para desacoplar del servicio
      this.especialidad = JSON.parse(JSON.stringify(original));
      this.inicializarSecciones();
    }
  }

  /**
   * Garantiza que todas las secciones opcionales existan con valores por defecto,
   * evitando errores de template al acceder a propiedades anidadas.
   */
  private inicializarSecciones(): void {
    if (!this.especialidad) return;
    const e = this.especialidad;

    e.malla ??= [];
    e.perfilCoordinador ??= { nombre: e.coordinador, cargo: '', foto: '', email: '', telefono: '' };
    e.perfilEstudiante  ??= { descripcion: '', habilidades: [] };
    e.salidasProfesionales ??= [];
    e.instalaciones ??= [];
    e.admisiones ??= { texto: '', fechaImportante: '', labelFecha: 'Fecha de examen', botones: [] };
    e.testimonios ??= [];
    e.publicacion ??= { publicado: false, fechaPublicacion: '', visibleEnWeb: false };
  }

  // ─── Guardar / Eliminar ─────────────────────────────────────────────────────

  guardar(): void {
    if (!this.especialidad) return;
    // Sincronizar coordinador plano con el perfil completo
    if (this.especialidad.perfilCoordinador?.nombre) {
      this.especialidad.coordinador = this.especialidad.perfilCoordinador.nombre;
    }
    this.especialidadService.actualizar(this.especialidad);
    this.activityService.agregarActividad(
      'especialidad', 'Especialidad actualizada',
      `Se guardaron los cambios de "${this.especialidad.titulo}".`
    );
    this.guardado = true;
  }

  pedirEliminar(): void    { this.confirmarEliminar = true; }
  cancelarEliminar(): void { this.confirmarEliminar = false; }

  confirmarEliminarEspecialidad(): void {
    if (!this.especialidad) return;
    this.activityService.agregarActividad(
      'especialidad', 'Especialidad eliminada',
      `Se eliminó la especialidad "${this.especialidad.titulo}".`
    );
    this.especialidadService.eliminar(this.especialidad.id);
    this.router.navigate(['/especialidades']);
  }

  onCambio(): void { this.guardado = false; }

  volver(): void { this.location.back(); }

  // ─── Malla Curricular ───────────────────────────────────────────────────────

  agregarAnio(): void {
    if (!this.especialidad) return;
    const n = (this.especialidad.malla?.length ?? 0) + 1;
    const labels = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto'];
    this.especialidad.malla!.push({
      id: Date.now(),
      label: `${labels[n - 1] ?? `${n}°`} Año`,
      materias: [],
    });
    this.onCambio();
  }

  eliminarAnio(anioId: number): void {
    if (!this.especialidad) return;
    this.especialidad.malla = this.especialidad.malla!.filter(a => a.id !== anioId);
    this.onCambio();
  }

  agregarMateria(anio: AnioMalla): void {
    anio.materias.push({ id: Date.now(), nombre: '', horas: undefined });
    this.onCambio();
  }

  eliminarMateria(anio: AnioMalla, materiaId: number): void {
    anio.materias = anio.materias.filter(m => m.id !== materiaId);
    this.onCambio();
  }

  // ─── Perfil del Estudiante ──────────────────────────────────────────────────

  agregarHabilidad(): void {
    this.especialidad?.perfilEstudiante?.habilidades.push('');
    this.onCambio();
  }

  eliminarHabilidad(i: number): void {
    this.especialidad?.perfilEstudiante?.habilidades.splice(i, 1);
    this.onCambio();
  }

  trackByIndex(i: number): number { return i; }

  // ─── Salidas Profesionales ──────────────────────────────────────────────────

  agregarSalida(): void {
    this.especialidad?.salidasProfesionales?.push({
      id: Date.now(), icono: 'gear', titulo: '', descripcion: '',
    });
    this.onCambio();
  }

  eliminarSalida(id: number): void {
    if (!this.especialidad) return;
    this.especialidad.salidasProfesionales =
      this.especialidad.salidasProfesionales!.filter(s => s.id !== id);
    this.onCambio();
  }

  // ─── Instalaciones ──────────────────────────────────────────────────────────

  agregarInstalacion(): void {
    this.especialidad?.instalaciones?.push({ id: Date.now(), url: '', titulo: '' });
    this.onCambio();
  }

  eliminarInstalacion(id: number): void {
    if (!this.especialidad) return;
    this.especialidad.instalaciones =
      this.especialidad.instalaciones!.filter(i => i.id !== id);
    this.onCambio();
  }

  // ─── Admisiones ─────────────────────────────────────────────────────────────

  agregarBoton(): void {
    this.especialidad?.admisiones?.botones.push({
      id: Date.now(), label: '', url: '', estilo: 'primary',
    });
    this.onCambio();
  }

  eliminarBoton(id: number): void {
    if (!this.especialidad?.admisiones) return;
    this.especialidad.admisiones.botones =
      this.especialidad.admisiones.botones.filter(b => b.id !== id);
    this.onCambio();
  }

  // ─── Testimonios ────────────────────────────────────────────────────────────

  agregarTestimonio(): void {
    this.especialidad?.testimonios?.push({
      id: Date.now(), texto: '', autor: '', cargo: '',
    });
    this.onCambio();
  }

  eliminarTestimonio(id: number): void {
    if (!this.especialidad) return;
    this.especialidad.testimonios =
      this.especialidad.testimonios!.filter(t => t.id !== id);
    this.onCambio();
  }
}
