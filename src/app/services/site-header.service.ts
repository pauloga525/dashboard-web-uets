/**
 * @file site-header.service.ts
 * @description Gestiona el contenido del header público del sitio.
 */
import { Injectable } from '@angular/core';

export interface NavLink {
  id: number;
  label: string;
  url: string;
}

export interface SiteHeaderConfig {
  logoUrl:      string;   // URL imagen del logo
  logoTexto:    string;   // Texto alternativo / nombre institución
  tagline:      string;   // Texto pequeño bajo el logo
  navLinks:     NavLink[];
  ctaLabel:     string;   // Texto del botón principal
  ctaUrl:       string;   // URL del botón principal
  mostrarCta:   boolean;
}

const KEY = 'edu_site_header';

const DEFAULT: SiteHeaderConfig = {
  logoUrl:    '',
  logoTexto:  'UETS',
  tagline:    'Unidad Educativa Técnica Salesiana',
  navLinks: [
    { id: 1, label: 'Inicio',          url: '/'              },
    { id: 2, label: 'Nosotros',        url: '/nosotros'      },
    { id: 3, label: 'Académico',       url: '/academico'     },
    { id: 4, label: 'Especialidades',  url: '/especialidades'},
    { id: 5, label: 'Eventos',         url: '/eventos'       },
    { id: 6, label: 'Contacto',        url: '/contacto'      },
  ],
  ctaLabel:   'Admisiones',
  ctaUrl:     '/admisiones',
  mostrarCta: true,
};

@Injectable({ providedIn: 'root' })
export class SiteHeaderService {
  get(): SiteHeaderConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): SiteHeaderConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: SiteHeaderConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
