/**
 * @file activity.ts
 * @description Servicio para registrar y consultar el historial de actividad del sistema.
 * Persiste los datos en localStorage y expone métodos de consulta y agrupación.
 */

import { Injectable } from '@angular/core';
import { Actividad, GrupoActividad, TipoActividad } from '../models';

const STORAGE_KEY = 'actividades';

@Injectable({ providedIn: 'root' })
export class ActivityService {

  private actividades: Actividad[] = [];

  constructor() {
    this.actividades = this.cargar();
    this.ordenar();
  }

  // ─── Persistencia ───────────────────────────────────────────────────────────

  /** Carga actividades desde localStorage, restituyendo objetos Date. */
  private cargar(): Actividad[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((a: Actividad) => ({
      ...a,
      fecha: new Date(a.fecha),
    }));
  }

  /** Persiste el array actual en localStorage. */
  private guardar(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.actividades));
  }

  /** Ordena las actividades de más reciente a más antigua. */
  private ordenar(): void {
    this.actividades.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }

  // ─── Consultas ──────────────────────────────────────────────────────────────

  /** Retorna todas las actividades ordenadas. */
  getActividades(): Actividad[] {
    return this.actividades;
  }

  /** Retorna las 5 actividades más recientes. */
  getActividadesRecientes(): Actividad[] {
    this.ordenar();
    return this.actividades.slice(0, 5);
  }

  /**
   * Agrupa las actividades por proximidad de fecha.
   * @returns Array de grupos con etiqueta (Hoy, Ayer, Hace N días) e items.
   */
  getActividadesAgrupadas(): GrupoActividad[] {
    const grupos: Record<string, { orden: number; items: Actividad[] }> = {};
    const hoy = new Date();

    for (const a of this.actividades) {
      const diff = Math.floor(
        (hoy.getTime() - new Date(a.fecha).getTime()) / 86400000
      );

      const titulo = diff === 0 ? 'Hoy' : diff === 1 ? 'Ayer' : `Hace ${diff} días`;
      const orden  = diff;

      if (!grupos[titulo]) {
        grupos[titulo] = { orden, items: [] };
      }
      grupos[titulo].items.push(a);
    }

    return Object.entries(grupos)
      .sort(([, a], [, b]) => a.orden - b.orden)
      .map(([titulo, { items }]) => ({ titulo, items }));
  }

  /**
   * Indica si una actividad fue registrada hace menos de 5 minutos.
   * Útil para mostrar badges de "nuevo".
   */
  isNuevaActividad(a: Actividad): boolean {
    const minutos = (Date.now() - new Date(a.fecha).getTime()) / 60000;
    return minutos <= 5;
  }

  // ─── Mutaciones ─────────────────────────────────────────────────────────────

  /**
   * Registra una nueva actividad al inicio del historial.
   * @param tipo    Categoría de la actividad.
   * @param titulo  Título corto descriptivo.
   * @param descripcion Detalle de lo ocurrido.
   */
  agregarActividad(tipo: TipoActividad, titulo: string, descripcion: string): void {
    this.actividades.unshift({ tipo, titulo, descripcion, fecha: new Date() });
    this.guardar();
  }

  // ─── Utilidades ─────────────────────────────────────────────────────────────

  /**
   * Convierte una fecha en texto relativo legible.
   * @example "Hace 5 min", "Hace 2 h", "Hace 3 días"
   */
  getTiempoRelativo(fecha: Date): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const min  = Math.floor(diff / 60000);
    const h    = Math.floor(diff / 3600000);
    const d    = Math.floor(diff / 86400000);

    if (min < 60)  return `Hace ${min} min`;
    if (h   < 24)  return `Hace ${h} h`;
    return `Hace ${d} día${d > 1 ? 's' : ''}`;
  }
}
