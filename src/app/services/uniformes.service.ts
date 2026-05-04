import { Injectable } from '@angular/core';

export interface UniformeImagen {
  id:  number;
  url: string;
  alt: string;
}

export interface Uniforme {
  id:           number;
  name:         string;
  category:     string;
  description:  string;
  price:        string;
  availability: string;
  images:       UniformeImagen[];
}

export interface UniformesConfig {
  // Hero
  heroTitulo:      string;
  heroDescripcion: string;
  heroImagen:      string;
  // Info cards (los 3 bloques de estadísticas)
  card1Titulo:     string;
  card1Desc:       string;
  card2Titulo:     string;
  card2Desc:       string;
  card3Valor:      string;
  card3Titulo:     string;
  card3Desc:       string;
  // Uniformes
  uniformes:       Uniforme[];
}

const KEY = 'edu_uniformes';

const DEFAULT: UniformesConfig = {
  heroTitulo:      'Uniformes Escolares',
  heroDescripcion: 'Visualiza nuestros uniformes escolares con todas las características y detalles',
  heroImagen:      '',
  card1Titulo:     'Tipos de Uniformes',
  card1Desc:       'Opciones para todos los niveles educativos',
  card2Titulo:     'Categorías',
  card2Desc:       'Diario, deportivo, ceremonia y más',
  card3Valor:      '100%',
  card3Titulo:     'Calidad Garantizada',
  card3Desc:       'Tela de primera calidad y durabilidad',
  uniformes: [
    {
      id: 1,
      name:         'Uniforme Diario Masculino',
      category:     'Diario',
      description:  'Uniforme de uso diario para estudiantes masculinos. Incluye pantalón azul marino, camisa blanca con logo bordado y cinturón negro.',
      price:        '$45.00',
      availability: 'En stock',
      images: [
        { id: 1, url: '', alt: 'Vista frontal' },
        { id: 2, url: '', alt: 'Vista lateral' },
      ],
    },
    {
      id: 2,
      name:         'Uniforme Diario Femenino',
      category:     'Diario',
      description:  'Uniforme de uso diario para estudiantes femeninas. Incluye falda azul marino, blusa blanca con logo bordado y medias azules.',
      price:        '$42.00',
      availability: 'En stock',
      images: [
        { id: 1, url: '', alt: 'Vista frontal' },
        { id: 2, url: '', alt: 'Vista lateral' },
      ],
    },
    {
      id: 3,
      name:         'Uniforme Deportivo',
      category:     'Deportivo',
      description:  'Conjunto deportivo para educación física y actividades extracurriculares. Incluye camiseta, pantaloneta y medias institucionales.',
      price:        '$35.00',
      availability: 'En stock',
      images: [
        { id: 1, url: '', alt: 'Vista frontal' },
      ],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class UniformesService {
  get(): UniformesConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): UniformesConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: UniformesConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
