/**
 * @file site-footer.service.ts
 * @description Gestiona el contenido del footer público del sitio.
 */
import { Injectable } from '@angular/core';

export interface FooterEnlace  { id: number; label: string; url: string; }
export interface FooterColumna { id: number; titulo: string; enlaces: FooterEnlace[]; }
export interface RedSocial     { id: number; nombre: string; url: string; icono: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin'; }

export interface SiteFooterConfig {
  // Columna institucional
  logoUrl:          string;
  nombreInstitucion:string;
  descripcion:      string;
  // Contacto
  direccion:        string;
  telefono:         string;
  email:            string;
  horario:          string;
  // Redes sociales
  redes:            RedSocial[];
  // Columnas de navegación
  columnas:         FooterColumna[];
  // Copyright
  copyright:        string;
}

const KEY = 'edu_site_footer';

const DEFAULT: SiteFooterConfig = {
  logoUrl:           '',
  nombreInstitucion: 'Unidad Educativa Técnica Salesiana',
  descripcion:       'Formando líderes con valores salesianos y excelencia académica desde hace más de 50 años.',
  direccion:         'Av. Don Bosco s/n, Cuenca, Ecuador',
  telefono:          '+593 7 000 0000',
  email:             'info@uets.edu.ec',
  horario:           'Lun – Vie: 07:00 – 17:00',
  redes: [
    { id: 1, nombre: 'Facebook',  url: 'https://facebook.com',  icono: 'facebook'  },
    { id: 2, nombre: 'Instagram', url: 'https://instagram.com', icono: 'instagram' },
    { id: 3, nombre: 'YouTube',   url: 'https://youtube.com',   icono: 'youtube'   },
  ],
  columnas: [
    {
      id: 1, titulo: 'Institución',
      enlaces: [
        { id: 1, label: 'Quiénes somos', url: '/nosotros'  },
        { id: 2, label: 'Misión y visión', url: '/mision'  },
        { id: 3, label: 'Historia',        url: '/historia'},
      ],
    },
    {
      id: 2, titulo: 'Académico',
      enlaces: [
        { id: 1, label: 'Bachillerato',    url: '/especialidades' },
        { id: 2, label: 'Básica Superior', url: '/basica-superior'},
        { id: 3, label: 'Básica Media',    url: '/basica-media'   },
        { id: 4, label: 'Básica Elemental',url: '/basica-elemental'},
        { id: 5, label: 'Preparatoria',    url: '/preparatoria'   },
      ],
    },
    {
      id: 3, titulo: 'Servicios',
      enlaces: [
        { id: 1, label: 'Admisiones',  url: '/admisiones' },
        { id: 2, label: 'Eventos',     url: '/eventos'    },
        { id: 3, label: 'Biblioteca',  url: '/biblioteca' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Unidad Educativa Técnica Salesiana. Todos los derechos reservados.`,
};

@Injectable({ providedIn: 'root' })
export class SiteFooterService {
  get(): SiteFooterConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): SiteFooterConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: SiteFooterConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
