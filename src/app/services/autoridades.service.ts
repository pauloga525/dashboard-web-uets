/**
 * @file autoridades.service.ts
 * @description Gestiona los perfiles de las 5 autoridades académicas.
 */
import { Injectable } from '@angular/core';

export interface Autoridad {
  id: number;
  name:           string;
  title:          string;   // cargo completo
  categoryLabel:  string;   // etiqueta del badge
  image:          string;   // URL foto
  email:          string;
  specialization: string;
  linkedin:       string;
  fullBio:        string;   // biografía completa (párrafos separados por \n\n)
  // Tarjetas de contacto
  ubicacion:      string;
  horario:        string;
  telefono:       string;
}

const KEY = 'edu_autoridades';

const DEFAULT: Autoridad[] = [
  {
    id: 1,
    name:           'Nombre Autoridad 1',
    title:          'Rector',
    categoryLabel:  'Rectorado',
    image:          '',
    email:          'rector@uets.edu.ec',
    specialization: '',
    linkedin:       '',
    fullBio:        'Biografía de la autoridad. Escribe aquí la trayectoria académica y profesional.\n\nPuedes agregar más párrafos separando con una línea en blanco.',
    ubicacion:      'Campus Principal UETS',
    horario:        'Lunes a Viernes 8:00 - 17:00',
    telefono:       '+593 7 000 0000',
  },
  {
    id: 2,
    name:           'Nombre Autoridad 2',
    title:          'Vicerrector Académico',
    categoryLabel:  'Vicerrectorado',
    image:          '',
    email:          'vicerrector@uets.edu.ec',
    specialization: '',
    linkedin:       '',
    fullBio:        'Biografía de la autoridad.',
    ubicacion:      'Campus Principal UETS',
    horario:        'Lunes a Viernes 8:00 - 17:00',
    telefono:       '+593 7 000 0001',
  },
  {
    id: 3,
    name:           'Nombre Autoridad 3',
    title:          'Inspector General',
    categoryLabel:  'Inspección',
    image:          '',
    email:          'inspector@uets.edu.ec',
    specialization: '',
    linkedin:       '',
    fullBio:        'Biografía de la autoridad.',
    ubicacion:      'Campus Principal UETS',
    horario:        'Lunes a Viernes 8:00 - 17:00',
    telefono:       '+593 7 000 0002',
  },
  {
    id: 4,
    name:           'Nombre Autoridad 4',
    title:          'Coordinador Académico',
    categoryLabel:  'Coordinación',
    image:          '',
    email:          'coordinador@uets.edu.ec',
    specialization: '',
    linkedin:       '',
    fullBio:        'Biografía de la autoridad.',
    ubicacion:      'Campus Principal UETS',
    horario:        'Lunes a Viernes 8:00 - 17:00',
    telefono:       '+593 7 000 0003',
  },
  {
    id: 5,
    name:           'Nombre Autoridad 5',
    title:          'Secretaria General',
    categoryLabel:  'Secretaría',
    image:          '',
    email:          'secretaria@uets.edu.ec',
    specialization: '',
    linkedin:       '',
    fullBio:        'Biografía de la autoridad.',
    ubicacion:      'Campus Principal UETS',
    horario:        'Lunes a Viernes 8:00 - 17:00',
    telefono:       '+593 7 000 0004',
  },
];

@Injectable({ providedIn: 'root' })
export class AutoridadesService {

  private cargar(): Autoridad[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT.map(a => ({ ...a }));
    const saved: Autoridad[] = JSON.parse(raw);
    // Merge con defaults para garantizar que todos los campos existan
    return DEFAULT.map(def => ({ ...def, ...(saved.find(s => s.id === def.id) ?? {}) }));
  }

  getAll(): Autoridad[] { return this.cargar(); }

  getById(id: number): Autoridad | undefined {
    return this.cargar().find(a => a.id === id);
  }

  getCopiaById(id: number): Autoridad | undefined {
    const a = this.getById(id);
    return a ? { ...a } : undefined;
  }

  guardar(autoridad: Autoridad): void {
    const lista = this.cargar();
    const idx = lista.findIndex(a => a.id === autoridad.id);
    if (idx !== -1) lista[idx] = autoridad;
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
}
