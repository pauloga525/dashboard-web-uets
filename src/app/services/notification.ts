/**
 * @file notification.ts
 * @description Servicio reactivo para la gestión de notificaciones del sistema.
 * Usa BehaviorSubject para emitir cambios en tiempo real y persiste en localStorage.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notificacion } from '../models';

const STORAGE_KEY = 'notificaciones';

/** Notificaciones de demostración cargadas la primera vez. */
const NOTIFICACIONES_INICIALES: Notificacion[] = [
  { id:  1, titulo: 'Nuevo estudiante registrado',  descripcion: 'María José completó su inscripción.',              fecha: new Date(Date.now() - 1000*60*2),    leida: false, eliminada: false },
  { id:  2, titulo: 'Curso publicado',              descripcion: 'Se agregó el curso de Física Cuántica.',           fecha: new Date(Date.now() - 1000*60*10),   leida: false, eliminada: false },
  { id:  3, titulo: 'Evento actualizado',           descripcion: 'El horario del Open Day fue modificado.',          fecha: new Date(Date.now() - 1000*60*25),   leida: true,  eliminada: false },
  { id:  4, titulo: 'Nuevo comentario',             descripcion: 'Andrea comentó en el evento Conferencia Tech.',    fecha: new Date(Date.now() - 1000*60*60),   leida: false, eliminada: false },
  { id:  5, titulo: 'Usuario agregado',             descripcion: 'Carlos Méndez ahora es administrador.',            fecha: new Date(Date.now() - 1000*60*60*2), leida: true,  eliminada: false },
  { id:  6, titulo: 'Material subido',              descripcion: 'Se subió material para el curso Angular.',         fecha: new Date(Date.now() - 1000*60*60*4), leida: true,  eliminada: false },
  { id:  7, titulo: 'Nuevo evento creado',          descripcion: 'Evento Taller de Robótica agregado.',              fecha: new Date(Date.now() - 1000*60*60*6), leida: false, eliminada: false },
  { id:  8, titulo: 'Sistema actualizado',          descripcion: 'La plataforma fue actualizada a la versión 2.1.', fecha: new Date(Date.now() - 1000*60*60*10),leida: true,  eliminada: false },
  { id:  9, titulo: 'Reporte generado',             descripcion: 'Reporte académico mensual disponible.',            fecha: new Date(Date.now() - 1000*60*60*14),leida: false, eliminada: false },
  { id: 10, titulo: 'Nuevo estudiante inscrito',    descripcion: 'Pedro Alvarez se inscribió en Matemáticas.',       fecha: new Date(Date.now() - 1000*60*60*20),leida: true,  eliminada: false },
  { id: 11, titulo: 'Evento finalizado',            descripcion: 'Conferencia de IA finalizó correctamente.',        fecha: new Date(Date.now() - 1000*60*60*28),leida: true,  eliminada: false },
  { id: 12, titulo: 'Usuario eliminado',            descripcion: 'Usuario invitado eliminado del sistema.',          fecha: new Date(Date.now() - 1000*60*60*36),leida: true,  eliminada: true  },
  { id: 13, titulo: 'Evento cancelado',             descripcion: 'Se canceló el evento de Programación.',           fecha: new Date(Date.now() - 1000*60*60*48),leida: true,  eliminada: true  },
  { id: 14, titulo: 'Nuevo curso disponible',       descripcion: 'Curso de Inteligencia Artificial agregado.',       fecha: new Date(Date.now() - 1000*60*60*60),leida: false, eliminada: false },
  { id: 15, titulo: 'Actualización de seguridad',   descripcion: 'Se aplicaron mejoras de seguridad.',               fecha: new Date(Date.now() - 1000*60*60*72),leida: true,  eliminada: false },
];

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private subject = new BehaviorSubject<Notificacion[]>(this.cargarDesdeStorage());

  /** Observable con la lista completa de notificaciones (incluye leídas y eliminadas). */
  notificaciones$ = this.subject.asObservable();

  // ─── Persistencia ───────────────────────────────────────────────────────────

  /** Carga desde localStorage o inicializa con datos de demostración. */
  private cargarDesdeStorage(): Notificacion[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTIFICACIONES_INICIALES));
    return NOTIFICACIONES_INICIALES;
  }

  /** Persiste y emite la lista actualizada. */
  private guardar(lista: Notificacion[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    this.subject.next(lista);
  }

  // ─── Consultas ──────────────────────────────────────────────────────────────

  /** Notificaciones no leídas y no eliminadas, ordenadas por fecha desc. */
  getPendientes(): Notificacion[] {
    return this.porFecha(this.subject.value.filter(n => !n.leida && !n.eliminada));
  }

  /** Notificaciones leídas y no eliminadas, ordenadas por fecha desc. */
  getLeidas(): Notificacion[] {
    return this.porFecha(this.subject.value.filter(n => n.leida && !n.eliminada));
  }

  /** Notificaciones eliminadas, ordenadas por fecha desc. */
  getEliminadas(): Notificacion[] {
    return this.porFecha(this.subject.value.filter(n => n.eliminada));
  }

  /** Ordena un array de notificaciones de más reciente a más antigua. */
  private porFecha(lista: Notificacion[]): Notificacion[] {
    return lista.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  // ─── Mutaciones ─────────────────────────────────────────────────────────────

  /** Marca una notificación como leída. */
  marcarComoLeida(n: Notificacion): void {
    const lista = this.subject.value;
    const notif = lista.find(x => x.id === n.id);
    if (notif) notif.leida = true;
    this.guardar(lista);
  }

  /** Marca todas las notificaciones activas como leídas. */
  marcarTodasLeidas(): void {
    const lista = this.subject.value.map(n =>
      n.eliminada ? n : { ...n, leida: true }
    );
    this.guardar(lista);
  }

  /** Marca una notificación como eliminada (soft delete). */
  eliminarNotificacion(n: Notificacion): void {
    const lista = this.subject.value;
    const notif = lista.find(x => x.id === n.id);
    if (notif) notif.eliminada = true;
    this.guardar(lista);
  }

  /** Restaura una notificación eliminada, marcándola como no leída. */
  restaurarNotificacion(n: Notificacion): void {
    const lista = this.subject.value;
    const notif = lista.find(x => x.id === n.id);
    if (notif) { notif.eliminada = false; notif.leida = false; }
    this.guardar(lista);
  }

  /** Agrega una nueva notificación al inicio de la lista. */
  agregarNotificacion(n: Notificacion): void {
    this.guardar([n, ...this.subject.value]);
  }

  // ─── Utilidades ─────────────────────────────────────────────────────────────

  /**
   * Convierte una fecha en texto relativo legible.
   * @example "Ahora", "Hace 5 min", "Ayer", "Hace 2 sem"
   */
  getTiempoRelativo(fecha: Date): string {
    const diff    = Date.now() - new Date(fecha).getTime();
    const min     = Math.floor(diff / 60000);
    const horas   = Math.floor(diff / 3600000);
    const dias    = Math.floor(diff / 86400000);
    const semanas = Math.floor(diff / 604800000);
    const meses   = Math.floor(diff / 2592000000);

    if (min     <  1) return 'Ahora';
    if (min     < 60) return `Hace ${min} min`;
    if (horas   < 24) return `Hace ${horas} h`;
    if (dias    === 1) return 'Ayer';
    if (dias    <  7) return `Hace ${dias} días`;
    if (semanas <  4) return `Hace ${semanas} sem`;
    return `Hace ${meses} mes`;
  }
}
