/**
 * @file models/index.ts
 * @description Modelos de datos centralizados de la aplicación.
 * Exporta todas las interfaces y tipos usados en componentes y servicios.
 */

// ─── Especialidades ───────────────────────────────────────────────────────────

/** Materia dentro de un año de la malla curricular. */
export interface Materia {
  id: number;
  nombre: string;
  horas?: number;
}

/** Año académico con sus materias. */
export interface AnioMalla {
  id: number;
  label: string;   // "Primer Año", "Segundo Año", etc.
  materias: Materia[];
}

/** Tarjeta de salida profesional. */
export interface SalidaProfesional {
  id: number;
  icono: string;   // nombre de icono SVG
  titulo: string;
  descripcion: string;
}

/** Imagen de galería de instalaciones. */
export interface ImagenInstalacion {
  id: number;
  url: string;
  titulo: string;
}

/** Botón de acción en la sección de admisiones. */
export interface BotonAdmision {
  id: number;
  label: string;
  url: string;
  estilo: 'primary' | 'outline';
}

/** Testimonio de un estudiante o egresado. */
export interface Testimonio {
  id: number;
  texto: string;
  autor: string;
  cargo?: string;
}

/** Perfil completo del coordinador de la especialidad. */
export interface PerfilCoordinador {
  nombre: string;
  cargo: string;
  foto: string;
  email: string;
  telefono: string;
}

/** Sección de admisiones. */
export interface SeccionAdmisiones {
  texto: string;
  fechaImportante: string;
  labelFecha: string;
  botones: BotonAdmision[];
}

/** Sección de perfil del estudiante. */
export interface PerfilEstudiante {
  descripcion: string;
  habilidades: string[];
}

/** Control de publicación. */
export interface Publicacion {
  publicado: boolean;
  fechaPublicacion: string;
  visibleEnWeb: boolean;
}

/** Representa una especialidad académica del instituto (modelo completo). */
export interface Especialidad {
  // ── Identificación ──────────────────────────────────────────────────────────
  id: number;
  icono: string;
  color: string;
  codigo?: string;

  // ── General / Hero ──────────────────────────────────────────────────────────
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  tituloAObtener?: string;
  duracion?: string;
  nivel?: string;

  // ── Imagen ──────────────────────────────────────────────────────────────────
  imagenHero?: string;
  imagenSecundaria?: string;
  videoUrl?: string;

  // ── Malla Curricular ────────────────────────────────────────────────────────
  malla?: AnioMalla[];

  // ── Coordinador ─────────────────────────────────────────────────────────────
  coordinador: string;                    // nombre plano (usado en lista)
  perfilCoordinador?: PerfilCoordinador;  // perfil completo

  // ── Perfil del Estudiante ───────────────────────────────────────────────────
  perfilEstudiante?: PerfilEstudiante;

  // ── Futuro Profesional ──────────────────────────────────────────────────────
  salidasProfesionales?: SalidaProfesional[];

  // ── Instalaciones ───────────────────────────────────────────────────────────
  instalaciones?: ImagenInstalacion[];

  // ── Admisiones ──────────────────────────────────────────────────────────────
  admisiones?: SeccionAdmisiones;

  // ── Testimonios ─────────────────────────────────────────────────────────────
  testimonios?: Testimonio[];

  // ── Publicación ─────────────────────────────────────────────────────────────
  publicacion?: Publicacion;
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

// ─── Eventos ──────────────────────────────────────────────────────────────────

/** Ítem de la agenda/cronograma de un evento. */
export interface AgendaItem {
  id: number;
  hora: string;
  titulo: string;
  descripcion?: string;
}

/** Categoría de evento. */
export interface CategoriaEvento {
  id: number;
  nombre: string;
  color: string; // tailwind color key: blue, green, red, etc.
}

/** Formulario de registro de asistencia (estructura del campo). */
export interface RegistroAsistencia {
  habilitado: boolean;
  labelBoton: string;
  url?: string; // link externo o vacío si es formulario interno
}

/** Configuración del hero de la página pública de eventos. */
export interface HeroEventos {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  imagenFondo: string;
}

/** Evento institucional completo. */
export interface Evento {
  // ── Identificación ──────────────────────────────────────────────────────────
  id: number;
  slug: string;

  // ── Contenido principal ─────────────────────────────────────────────────────
  titulo: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  categoria: string;       // nombre de la categoría
  categoriaColor: string;  // color tailwind de la categoría

  // ── Fecha y lugar ───────────────────────────────────────────────────────────
  fecha: string;           // ISO date string YYYY-MM-DD
  horaInicio: string;      // HH:mm
  horaFin: string;         // HH:mm
  ubicacion: string;
  direccion?: string;

  // ── Imágenes ────────────────────────────────────────────────────────────────
  imagenPrincipal: string;
  galeria?: string[];      // URLs adicionales

  // ── Agenda ──────────────────────────────────────────────────────────────────
  agenda?: AgendaItem[];

  // ── Registro ────────────────────────────────────────────────────────────────
  registro?: RegistroAsistencia;

  // ── Publicación ─────────────────────────────────────────────────────────────
  publicado: boolean;
  destacado: boolean;
  fechaCreacion: string;
}
