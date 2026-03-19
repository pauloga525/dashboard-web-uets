/**
 * @file especialidad.service.ts
 * @description Servicio centralizado para la gestión de especialidades académicas.
 * Maneja la persistencia en localStorage y expone un observable reactivo.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Especialidad } from '../models';

/** Datos iniciales usados cuando no hay nada en localStorage. */
const ESPECIALIDADES_INICIALES: Especialidad[] = [
  { id: 1, icono: 'ciencias',      titulo: 'Ciencias',                                    descripcion: 'Física, Química, Biología y Matemáticas',          coordinador: 'Dr. Juan Pérez',        color: 'purple'  },
  { id: 2, icono: 'informatica',   titulo: 'Informática',                                 descripcion: 'Sistemas y Tecnología de la Información (TIC)',     coordinador: 'Ing. Mateo Pesantez',   color: 'blue'    },
  { id: 3, icono: 'mecatronica',   titulo: 'Mecatrónica',                                 descripcion: 'Mecánica, Electrónica e Informática',               coordinador: 'Ing. Rodney Siguenza',  color: 'emerald' },
  { id: 4, icono: 'mecanizado',    titulo: 'Mecanizado y Construcciones Metálicas',       descripcion: 'Manufactura y CNC',                                 coordinador: 'Ing. Oswaldo Zumba',    color: 'orange'  },
  { id: 5, icono: 'automotriz',    titulo: 'Electromecánica Automotriz',                  descripcion: 'Sistemas Eléctricos y Mecánicos de Vehículos',      coordinador: 'Ing. Rene Urgilés',     color: 'red'     },
  { id: 6, icono: 'electricidad',  titulo: 'Instalaciones, Equipos y Máquinas Eléctricas', descripcion: 'Generación y Distribución de Energía Eléctrica', coordinador: 'Dr. Juan Pérez',        color: 'yellow'  },
];

const STORAGE_KEY = 'especialidades';

const COLORES_DISPONIBLES = ['purple','blue','emerald','orange','red','yellow','cyan','pink','teal'];

@Injectable({ providedIn: 'root' })
export class EspecialidadService {

  private subject = new BehaviorSubject<Especialidad[]>(this.cargar());

  /** Observable con la lista actualizada de especialidades. */
  especialidades$ = this.subject.asObservable();

  // ─── Persistencia ───────────────────────────────────────────────────────────

  /** Carga las especialidades desde localStorage o usa los datos iniciales. */
  private cargar(): Especialidad[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ESPECIALIDADES_INICIALES;
  }

  /** Persiste la lista actual en localStorage y notifica a los suscriptores. */
  private guardarYEmitir(lista: Especialidad[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    this.subject.next(lista);
  }

  // ─── Consultas ──────────────────────────────────────────────────────────────

  /** Retorna el snapshot actual de la lista. */
  getAll(): Especialidad[] {
    return this.subject.value;
  }

  /** Busca una especialidad por id. Retorna `undefined` si no existe. */
  getById(id: number | string): Especialidad | undefined {
    return this.subject.value.find(e => e.id == id);
  }

  // ─── Mutaciones ─────────────────────────────────────────────────────────────

  /** Agrega una nueva especialidad asignando id y color automáticamente. */
  agregar(datos: Omit<Especialidad, 'id' | 'color'>): Especialidad {
    const lista = this.getAll();
    const nueva: Especialidad = {
      ...datos,
      id: Date.now(),
      color: this.obtenerColorDisponible(lista),
    };
    this.guardarYEmitir([...lista, nueva]);
    return nueva;
  }

  /** Actualiza una especialidad existente por id. */
  actualizar(especialidad: Especialidad): void {
    const lista = this.getAll().map(e =>
      e.id === especialidad.id ? especialidad : e
    );
    this.guardarYEmitir(lista);
  }

  /** Elimina una especialidad por id. */
  eliminar(id: number): void {
    this.guardarYEmitir(this.getAll().filter(e => e.id !== id));
  }

  // ─── Utilidades ─────────────────────────────────────────────────────────────

  /** Devuelve el primer color no usado en la lista actual. */
  private obtenerColorDisponible(lista: Especialidad[]): string {
    const usados = lista.map(e => e.color);
    return COLORES_DISPONIBLES.find(c => !usados.includes(c)) ?? 'gray';
  }
}
