import { Injectable } from '@angular/core';

export interface NoticiaImagen { id: number; url: string; alt: string; }

export interface Noticia {
  id:            number;
  // Listado
  tag:           string;
  title:         string;
  description:   string;
  image:         string;      // imagen para la tarjeta del listado
  destacada:     boolean;     // aparece en el carousel de destacadas
  // Detalle
  category:      string;
  featuredImage: string;      // imagen hero del detalle
  author:        string;
  authorImage:   string;
  date:          string;
  readTime:      string;
  content:       string;      // texto completo, párrafos separados por \n\n
  images:        NoticiaImagen[];
  tags:          string[];    // etiquetas al pie del artículo
}

export interface NoticiasConfig {
  heroTitulo:      string;
  heroDescripcion: string;
  heroImagenFondo: string;
  noticias:        Noticia[];
}

const KEY = 'edu_noticias';

const DEFAULT: NoticiasConfig = {
  heroTitulo:      'Noticias y Eventos',
  heroDescripcion: 'Mantente actualizado con las últimas novedades, logros y eventos de nuestra institución educativa.',
  heroImagenFondo: '',
  noticias: [
    {
      id: 1,
      tag: 'Académico', title: 'Estudiantes ganan olimpiada nacional de robótica',
      description: 'Nuestros estudiantes de Mecatrónica obtuvieron el primer lugar en la competencia nacional.',
      image: '', destacada: true,
      category: 'Académico', featuredImage: '',
      author: 'Redacción UETS', authorImage: '', date: '15 Ene 2024', readTime: '3 min',
      content: 'El equipo de robótica de la UETS demostró su talento y preparación en la olimpiada nacional.\n\nLos estudiantes trabajaron durante meses para perfeccionar su robot y su estrategia de competencia.',
      images: [], tags: ['Robótica', 'Mecatrónica', 'Logros'],
    },
    {
      id: 2,
      tag: 'Institucional', title: 'Inauguración del nuevo laboratorio de informática',
      description: 'Contamos con 40 nuevas estaciones de trabajo de última generación para nuestros estudiantes.',
      image: '', destacada: true,
      category: 'Institucional', featuredImage: '',
      author: 'Redacción UETS', authorImage: '', date: '10 Ene 2024', readTime: '2 min',
      content: 'La institución inauguró un moderno laboratorio equipado con tecnología de punta.\n\nEste espacio permitirá a los estudiantes desarrollar sus habilidades digitales en un entorno profesional.',
      images: [], tags: ['Infraestructura', 'Tecnología'],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  get(): NoticiasConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): NoticiasConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: NoticiasConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
