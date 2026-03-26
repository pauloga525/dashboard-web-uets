/**
 * @file especialidades.ts
 * @description Página de gestión de especialidades académicas.
 * Permite crear, editar, eliminar y navegar al editor detallado.
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EspecialidadService } from '../../services/especialidad.service';
import { ActivityService } from '../../services/activity';
import { IconService } from '../../services/icon.service';
import { BachilleratoService } from '../../services/bachillerato.service';
import { Especialidad, BachilleratoConfig } from '../../models';

/** Mapa de color → clases Tailwind para badges e iconos. */
const BADGE_COLOR: Record<string, string> = {
  purple:  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  blue:    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
  orange:  'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  red:     'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  yellow:  'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  cyan:    'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
  pink:    'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
  teal:    'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
};

@Component({
  selector: 'app-especialidades',
  imports: [NgClass, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',
})
export class Especialidades implements OnInit {

  especialidades: Especialidad[] = [];
  badgeColor = BADGE_COLOR;

  // ─── Editor de página Bachillerato ─────────────────────────────────────────
  paginaConfig!: BachilleratoConfig;
  guardadoPagina   = false;
  editorAbierto    = false;
  tabPagina: 'hero' | 'cta' = 'hero';
  private guardadoTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Estado del modal ──────────────────────────────────────────────────────
  modalAbierto          = false;
  mostrarSelectorIconos = false;
  iconoSeleccionado     = '';
  especialidadEditando: number | null = null;

  nuevaEspecialidad = { titulo: '', descripcion: '', coordinador: '' };

  // ─── Estado de eliminación ─────────────────────────────────────────────────
  confirmarEliminar    = false;
  especialidadEliminar: Especialidad | null = null;

  // ─── Estado del menú contextual ───────────────────────────────────────────
  menuAbierto: number | null = null;

  /** Iconos disponibles para seleccionar al crear/editar. */
  readonly iconosDisponibles = [
    'ciencias', 'mecatronica', 'atom', 'microscope', 'computer', 'chip',
    'terminal', 'robot', 'gear', 'wrench', 'factory', 'hammer',
    'car', 'engine', 'bolt', 'plug', 'battery', 'users', 'book', 'clipboard',
  ];

  constructor(
    public  iconService: IconService,
    private especialidadService: EspecialidadService,
    private activityService: ActivityService,
    private bachilleratoService: BachilleratoService,
    public  router: Router
  ) {}

  ngOnInit(): void {
    this.paginaConfig = this.bachilleratoService.getCopia();
    this.especialidadService.especialidades$.subscribe(lista => {
      this.especialidades = lista;
    });
  }

  // ─── Editor página pública ─────────────────────────────────────────────────

  onCambioPagina(): void { this.guardadoPagina = false; }

  guardarPagina(): void {
    this.bachilleratoService.guardar(this.paginaConfig);
    this.guardadoPagina = true;
    if (this.guardadoTimer) clearTimeout(this.guardadoTimer);
    this.guardadoTimer = setTimeout(() => this.guardadoPagina = false, 3000);
  }

  // ─── Navegación ────────────────────────────────────────────────────────────

  irEspecialidad(esp: Especialidad): void {
    this.router.navigate(['/especialidades', esp.id], {
      state: { nombre: esp.titulo }
    });
  }

  // ─── Modal crear / editar ──────────────────────────────────────────────────

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto          = false;
    this.especialidadEditando  = null;
    this.iconoSeleccionado     = '';
    this.mostrarSelectorIconos = false;
    this.nuevaEspecialidad     = { titulo: '', descripcion: '', coordinador: '' };
  }

  seleccionarIcono(icono: string): void {
    this.iconoSeleccionado     = icono;
    this.mostrarSelectorIconos = false;
  }

  toggleIconos(): void {
    this.mostrarSelectorIconos = !this.mostrarSelectorIconos;
  }

  /** Carga los datos de una especialidad en el modal para edición. */
  editarEspecialidad(index: number): void {
    const esp = this.especialidades[index];
    this.nuevaEspecialidad    = { titulo: esp.titulo, descripcion: esp.descripcion, coordinador: esp.coordinador };
    this.iconoSeleccionado    = esp.icono;
    this.especialidadEditando = index;
    this.menuAbierto          = null;
    this.modalAbierto         = true;
  }

  /** Guarda una especialidad nueva o actualiza la existente. */
  guardarEspecialidad(): void {
    const { titulo, descripcion, coordinador } = this.nuevaEspecialidad;
    if (!titulo || !descripcion || !coordinador || !this.iconoSeleccionado) return;

    if (this.especialidadEditando !== null) {
      const anterior = this.especialidades[this.especialidadEditando];
      const cambios: Array<[boolean, string, string]> = [
        [anterior.titulo      !== titulo,                'Nombre actualizado',      `De "${anterior.titulo}" a "${titulo}".`],
        [anterior.descripcion !== descripcion,           'Descripción actualizada', `Descripción de "${anterior.titulo}" actualizada.`],
        [anterior.coordinador !== coordinador,           'Coordinador actualizado', `Coordinador de "${anterior.titulo}" actualizado.`],
        [anterior.icono       !== this.iconoSeleccionado,'Icono actualizado',       `Icono de "${anterior.titulo}" actualizado.`],
      ];
      cambios
        .filter(([changed]) => changed)
        .forEach(([, t, d]) => this.activityService.agregarActividad('especialidad', t, d));

      this.especialidadService.actualizar({
        ...anterior,
        icono: this.iconoSeleccionado,
        titulo, descripcion, coordinador,
      });
    } else {
      // Creación con estructura plana
      this.especialidadService.agregar({
        icono: this.iconoSeleccionado,
        titulo, descripcion, coordinador,
      });
      this.activityService.agregarActividad(
        'especialidad', 'Especialidad creada', `Se creó la especialidad "${titulo}".`
      );
    }

    this.cerrarModal();
  }

  // ─── Eliminación ───────────────────────────────────────────────────────────

  pedirEliminar(esp: Especialidad): void {
    this.especialidadEliminar = esp;
    this.confirmarEliminar    = true;
  }

  confirmarEliminarEspecialidad(): void {
    if (!this.especialidadEliminar) return;
    this.activityService.agregarActividad(
      'especialidad', 'Especialidad eliminada',
      `Se eliminó la especialidad "${this.especialidadEliminar.titulo}".`
    );
    this.especialidadService.eliminar(this.especialidadEliminar.id);
    this.especialidadEliminar = null;
    this.confirmarEliminar    = false;
  }

  cancelarEliminar(): void {
    this.confirmarEliminar    = false;
    this.especialidadEliminar = null;
  }

  // ─── Menú contextual ───────────────────────────────────────────────────────

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.confirmarEliminar = false;
  }
}
