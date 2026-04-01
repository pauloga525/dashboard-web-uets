import { Injectable } from '@angular/core';

export interface NavSubItem { label: string; routerLink: string; }
export interface NavItem {
  label:       string;
  routerLink:  string;
  hasDropdown: boolean;
  submenu:     NavSubItem[];
}

export interface SiteHeaderConfig {
  logoUrl:        string;
  logoAlt:        string;
  aulaVirtualUrl: string;
  aulaVirtualLabel: string;
  navItems:       NavItem[];
}

const KEY = 'edu_site_header';

const DEFAULT: SiteHeaderConfig = {
  logoUrl:          '/logo.png',
  logoAlt:          'Logo Unidad Educativa Ecuador',
  aulaVirtualUrl:   'https://edu.esemtia.com/LoginEsemtia.aspx',
  aulaVirtualLabel: 'Aula Virtual',
  navItems: [
    { label: 'Inicio',       routerLink: '/',            hasDropdown: false, submenu: [] },
    { label: 'Nosotros',     routerLink: '/nosotros',    hasDropdown: false, submenu: [] },
    {
      label: 'Académico', routerLink: '/academico', hasDropdown: true,
      submenu: [
        { label: 'Preparatoria',     routerLink: '/preparatoria'     },
        { label: 'Básica Elemental', routerLink: '/basica-elemental' },
        { label: 'Básica Media',     routerLink: '/basica-media'     },
        { label: 'Básica Superior',  routerLink: '/basica-superior'  },
        { label: 'Bachillerato',     routerLink: '/especialidades'   },
      ],
    },
    { label: 'Campus',       routerLink: '/campus',      hasDropdown: false, submenu: [] },
    { label: 'Eventos',      routerLink: '/eventos',     hasDropdown: false, submenu: [] },
    { label: 'Noticias',     routerLink: '/noticias',    hasDropdown: false, submenu: [] },
    { label: 'Contacto',     routerLink: '/contacto',    hasDropdown: false, submenu: [] },
  ],
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
