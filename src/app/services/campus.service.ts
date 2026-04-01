import { Injectable } from '@angular/core';

export interface CampusCaracteristica { id: number; icon: string; label: string; }

export interface CampusItem {
  id:              number;
  nombre:          string;
  badge:           string;
  descripcion:     string;
  imagenPrincipal: string;
  imagenSecundaria1: string;
  imagenSecundaria2: string;
  caracteristicas: CampusCaracteristica[];
  ubicacion:       string;
  mapaImagen:      string;
  mapaUrl:         string;
}

export interface CampusConfig {
  heroTitulo:      string;
  heroSubtitulo:   string;
  heroImagen:      string;
  campus:          CampusItem[];
  plataformasTitulo:      string;
  plataformasDescripcion: string;
}

const KEY = 'edu_campus';

const makeCampus = (id: number, nombre: string, badge: string, descripcion: string): CampusItem => ({
  id, nombre, badge, descripcion,
  imagenPrincipal: '', imagenSecundaria1: '', imagenSecundaria2: '',
  caracteristicas: [
    { id: 1, icon: 'science',    label: 'Laboratorios'       },
    { id: 2, icon: 'menu_book',  label: 'Biblioteca'         },
    { id: 3, icon: 'sports',     label: 'Área Deportiva'     },
    { id: 4, icon: 'restaurant', label: 'Cafetería'          },
  ],
  ubicacion: 'Cuenca, Ecuador',
  mapaImagen: '', mapaUrl: 'https://maps.google.com',
});

const DEFAULT: CampusConfig = {
  heroTitulo:    'Nuestros Campus',
  heroSubtitulo: 'Espacios diseñados para el aprendizaje, la innovación y el desarrollo integral de nuestra comunidad.',
  heroImagen:    '',
  campus: [
    makeCampus(1, 'Yanuncay',          'Principal',        'Campus principal de la institución, sede de las especialidades técnicas y bachillerato general.'),
    makeCampus(2, 'Carlos Crespi',     'Técnico',          'Campus especializado en formación técnica con talleres y laboratorios de última generación.'),
    makeCampus(3, 'María Auxiliadora', 'Humanidades',      'Campus dedicado a la formación integral con énfasis en valores salesianos y humanidades.'),
  ],
  plataformasTitulo:      'Nuestras Plataformas',
  plataformasDescripcion: 'Herramientas digitales que potencian tu aprendizaje',
};

@Injectable({ providedIn: 'root' })
export class CampusService {
  get(): CampusConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): CampusConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: CampusConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
