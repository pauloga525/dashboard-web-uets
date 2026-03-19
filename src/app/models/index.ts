/**
 * @file models/index.ts
 * @description Modelos de datos centralizados de la aplicación.
 * Exporta todas las interfaces y tipos usados en componentes y servicios.
 */

// ─── Especialidades ───────────────────────────────────────────────────────────

/** Representa una especialidad académica del instituto. */
export interface Especialidad {
  id: number;
  icono: string;
  titulo: string;
  descripcion: string;
  coordinador: string;
  color: string;
  codigo?: string;
  duracion?: string;
  nivel?: string;
  tituloAObtener?: string;
}

// ─── Actividades ──────────────────────────────────────────────────────────────

/** Tipos de actividad registrables en el sistema. */
export type TipoActividad =
  | 'especialidad'
  | 'curso'
  | 'estudiante'
  | 'evento'
  | 'usuario'
  | 'sistema'
  | 'reporte';


/** Representa una entrada en el historial de actividad. */
export interface Actividad {
  tipo: TipoActividad;
  titulo: string;
  descripcion: string;
  fecha: Date;
}

/** Grupo de actividades agrupadas por fecha (Hoy, Ayer, etc.). */
export interface GrupoActividad {
  titulo: string;
  items: Actividad[];
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

/** Representa una notificación del sistema. */
export interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  leida: boolean;
  eliminada: boolean;
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

/** Elemento de la ruta de navegación (breadcrumb). */
export interface BreadcrumbItem {
  label: string;
  url: string;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

/** Tab de navegación dentro de un editor o vista detallada. */
export interface Tab {
  id: string;
  label: string;
}
