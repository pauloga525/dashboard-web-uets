import { Injectable } from '@angular/core';

export interface FooterQuickLink  { id: number; label: string; href: string; }
export interface FooterBottomLink { id: number; label: string; href: string; }
export interface FooterRedSocial  { id: number; icon: string; href: string; label: string; }

export interface SiteFooterConfig {
  // Marca
  logoUrl:     string;
  logoAlt:     string;
  descripcion: string;
  // Redes sociales (iconos en la sección de marca)
  redes:       FooterRedSocial[];
  // Enlaces rápidos
  quickLinksTitulo: string;
  quickLinks:       FooterQuickLink[];
  // Contacto
  contactoTitulo: string;
  direccion:      string;
  telefono1:      string;
  telefono2:      string;
  email:          string;
  // Mapa
  mapaImagen:  string;
  mapaUrl:     string;
  // Pie
  copyright:   string;
  footerLinks: FooterBottomLink[];
}

const KEY = 'edu_site_footer';

const DEFAULT: SiteFooterConfig = {
  logoUrl:     '/logo.png',
  logoAlt:     'Logo Unidad Educativa Ecuador',
  descripcion: 'Educar es nuestra pasión, la excelencia nuestra meta. Una institución comprometida con el desarrollo integral de la juventud ecuatoriana.',
  redes: [
    { id: 1, icon: 'public',   href: '#', label: 'Sitio web'  },
    { id: 2, icon: 'videocam', href: '#', label: 'YouTube'    },
  ],
  quickLinksTitulo: 'Enlaces Rápidos',
  quickLinks: [
    { id: 1, label: 'Inicio',        href: '/'              },
    { id: 2, label: 'Nosotros',      href: '/nosotros'      },
    { id: 3, label: 'Especialidades',href: '/especialidades'},
    { id: 4, label: 'Admisiones',    href: '/admisiones'    },
    { id: 5, label: 'Eventos',       href: '/eventos'       },
    { id: 6, label: 'Contacto',      href: '/contacto'      },
  ],
  contactoTitulo: 'Contacto',
  direccion:  'Av. Don Bosco s/n, Cuenca, Ecuador',
  telefono1:  '+593 7 000 0000',
  telefono2:  '+593 7 000 0001',
  email:      'info@uets.edu.ec',
  mapaImagen: '',
  mapaUrl:    'https://maps.google.com',
  copyright:  `© ${new Date().getFullYear()} Unidad Educativa. Todos los derechos reservados. | Desarrollado con excelencia.`,
  footerLinks: [
    { id: 1, label: 'Política de privacidad', href: '#' },
    { id: 2, label: 'Términos de uso',        href: '#' },
  ],
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
