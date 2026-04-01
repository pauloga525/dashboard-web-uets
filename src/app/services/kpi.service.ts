/**
 * @file kpi.service.ts
 * @description KPI cards del dashboard. Editables manualmente y preparados
 * para conectarse a una API en el futuro (campo `apiKey` para mapeo).
 */
import { Injectable } from '@angular/core';

export interface KpiCard {
  id:       string;   // identificador único
  label:    string;   // etiqueta visible
  value:    string;   // valor mostrado (string para flexibilidad: "1248", "6", "24")
  cambio:   string;   // texto de cambio opcional ("+12%", "Publicados", etc.)
  icono:    string;   // nombre del icono SVG interno
  color:    string;   // tailwind color class para el badge de cambio
  apiKey:   string;   // clave futura para conectar a API (ej: "total_estudiantes")
  visible:  boolean;
}

const KEY = 'edu_kpis';

const DEFAULT: KpiCard[] = [
  { id: 'estudiantes',   label: 'Estudiantes',    value: '1248', cambio: '+12%',      icono: 'users',     color: 'text-green-500', apiKey: 'total_estudiantes',   visible: true },
  { id: 'especialidades',label: 'Especialidades', value: '6',    cambio: '',          icono: 'book',      color: '',               apiKey: 'total_especialidades', visible: true },
  { id: 'eventos',       label: 'Eventos Activos',value: '0',    cambio: 'Publicados',icono: 'calendar',  color: 'text-primary/60',apiKey: 'total_eventos',       visible: true },
  { id: 'usuarios',      label: 'Usuarios',       value: '24',   cambio: '+8%',       icono: 'user',      color: 'text-green-500', apiKey: 'total_usuarios',      visible: true },
];

@Injectable({ providedIn: 'root' })
export class KpiService {
  get(): KpiCard[] {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT.map(k => ({ ...k }));
  }
  getCopia(): KpiCard[] { return JSON.parse(JSON.stringify(this.get())); }
  guardar(list: KpiCard[]): void { localStorage.setItem(KEY, JSON.stringify(list)); }
}
