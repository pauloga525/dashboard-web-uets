import { Injectable } from '@angular/core';

export interface LibroCategoria { id: number; nombre: string; }
export interface Libro {
  id: number;
  title:     string;
  author:    string;
  image:     string;
  url:       string;
  available: boolean;
  isNew:     boolean;
  categoria: string;
}

export interface BibliotecaConfig {
  heroTitulo:      string;
  heroDescripcion: string;
  catalogoTitulo:  string;
  categorias:      LibroCategoria[];
  libros:          Libro[];
}

const KEY = 'edu_biblioteca';

const DEFAULT: BibliotecaConfig = {
  heroTitulo:      'Biblioteca UETS',
  heroDescripcion: 'Centro de recursos para el aprendizaje y la investigación. Accede a nuestro catálogo global, reserva espacios de estudio y descubre las últimas novedades editoriales.',
  catalogoTitulo:  'Catálogo de Libros',
  categorias: [
    { id: 1, nombre: 'Todo el catálogo' },
    { id: 2, nombre: 'Libros físicos'   },
    { id: 3, nombre: 'E-books'          },
    { id: 4, nombre: 'Tesis'            },
  ],
  libros: [
    { id: 1, title: 'Fundamentos de Electrónica',    author: 'Boylestad, R.',    image: '', url: '', available: true,  isNew: false, categoria: 'Libros físicos' },
    { id: 2, title: 'Programación en Python',        author: 'Lutz, M.',         image: '', url: '', available: true,  isNew: true,  categoria: 'E-books'        },
    { id: 3, title: 'Mecatrónica: Sistemas Integrados', author: 'Bolton, W.',    image: '', url: '', available: false, isNew: false, categoria: 'Libros físicos' },
    { id: 4, title: 'Diseño de Circuitos Eléctricos', author: 'Hayt, W.',       image: '', url: '', available: true,  isNew: false, categoria: 'Libros físicos' },
    { id: 5, title: 'Inteligencia Artificial',       author: 'Russell, S.',      image: '', url: '', available: true,  isNew: true,  categoria: 'E-books'        },
  ],
};

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  get(): BibliotecaConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): BibliotecaConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: BibliotecaConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
