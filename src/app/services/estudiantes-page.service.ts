import { Injectable } from '@angular/core';

export interface GaleriaImagen  { id: number; url: string; alt: string; caption: string; }
export interface Club           { id: number; icon: string; title: string; description: string; }
export interface Promocion      { id: number; classOf: string; image: string; url: string; }
export interface Logro          { id: number; badge: string; date: string; title: string; description: string; image: string; }
export interface Instalacion    { id: number; title: string; description: string; image: string; }

export interface EstudiantesPageConfig {
  // Hero
  heroTitulo:       string;
  heroDescripcion:  string;
  heroImagen:       string;
  heroBoton1Label:  string;
  heroBoton1Url:    string;
  heroBoton2Label:  string;
  heroBoton2Url:    string;
  // Galería
  galeriaTitulo:    string;
  galeriaUrl:       string;
  galeria:          GaleriaImagen[];
  // Clubes
  clubesTitulo:     string;
  clubes:           Club[];
  // Promociones
  promocionesTitulo:       string;
  promocionesDescripcion:  string;
  promociones:             Promocion[];
  // Logros
  logrosTitulo:     string;
  logrosUrl:        string;
  logros:           Logro[];
  // Instalaciones
  instalacionesTitulo: string;
  instalaciones:       Instalacion[];
}

const KEY = 'edu_estudiantes_page';

const DEFAULT: EstudiantesPageConfig = {
  heroTitulo:      'Experiencia en Campus',
  heroDescripcion: 'Únete a una comunidad vibrante de innovadores, creativos y líderes. Descubre dónde tu pasión se encuentra con el propósito en un ambiente diseñado para el crecimiento.',
  heroImagen:      '',
  heroBoton1Label: 'Tour Virtual',
  heroBoton1Url:   '#',
  heroBoton2Label: 'Descargar Folleto',
  heroBoton2Url:   '#',

  galeriaTitulo: 'Vida en Movimiento',
  galeriaUrl:    '#',
  galeria: [
    { id: 1, url: '', alt: 'Laboratorio', caption: 'Laboratorios de Investigación Avanzada' },
    { id: 2, url: '', alt: 'Espacios verdes', caption: 'Espacios Verdes' },
    { id: 3, url: '', alt: 'Atletismo', caption: 'Atletismo' },
    { id: 4, url: '', alt: 'Campus', caption: 'Arquitectura Moderna del Campus' },
  ],

  clubesTitulo: 'Clubes y Organizaciones Estudiantiles',
  clubes: [
    { id: 1, icon: 'science',      title: 'Club de Ciencias',     description: 'Explora el mundo científico con experimentos y proyectos innovadores.' },
    { id: 2, icon: 'sports_soccer',title: 'Deportes',             description: 'Fútbol, básquet, atletismo y más actividades físicas para todos.' },
    { id: 3, icon: 'music_note',   title: 'Arte y Música',        description: 'Expresa tu creatividad a través del arte, la música y el teatro.' },
    { id: 4, icon: 'computer',     title: 'Club de Tecnología',   description: 'Programación, robótica y proyectos tecnológicos de vanguardia.' },
    { id: 5, icon: 'eco',          title: 'Medio Ambiente',       description: 'Iniciativas ecológicas y proyectos de sostenibilidad ambiental.' },
    { id: 6, icon: 'volunteer_activism', title: 'Voluntariado',   description: 'Servicio comunitario y proyectos de impacto social.' },
  ],

  promocionesTitulo:      'Nuestros Alumnos',
  promocionesDescripcion: 'Honrando el legado de excelencia de nuestros graduados. Cada generación marca un hito en nuestra historia académica.',
  promociones: [
    { id: 1, classOf: 'Promoción 2024', image: '', url: '#' },
    { id: 2, classOf: 'Promoción 2023', image: '', url: '#' },
    { id: 3, classOf: 'Promoción 2022', image: '', url: '#' },
  ],

  logrosTitulo: 'Logros Estudiantiles',
  logrosUrl:    '#',
  logros: [
    { id: 1, badge: '1er Lugar', date: 'Enero 2024', title: 'Olimpiada Nacional de Robótica', description: 'Nuestros estudiantes obtuvieron el primer lugar en la competencia nacional.', image: '' },
    { id: 2, badge: 'Destacado', date: 'Marzo 2024', title: 'Feria de Ciencias Regional',     description: 'Tres proyectos seleccionados para representar a la institución.',              image: '' },
  ],

  instalacionesTitulo: 'Instalaciones de Clase Mundial',
  instalaciones: [
    { id: 1, title: 'Laboratorios Técnicos',  description: 'Equipados con tecnología de última generación para la formación práctica.',  image: '' },
    { id: 2, title: 'Biblioteca y Recursos',  description: 'Amplio acervo bibliográfico físico y digital para la investigación.',         image: '' },
    { id: 3, title: 'Áreas Deportivas',       description: 'Canchas, pista atlética y espacios para el desarrollo físico integral.',      image: '' },
  ],
};

@Injectable({ providedIn: 'root' })
export class EstudiantesPageService {
  get(): EstudiantesPageConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): EstudiantesPageConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: EstudiantesPageConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
