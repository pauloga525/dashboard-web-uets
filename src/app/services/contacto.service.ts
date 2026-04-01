import { Injectable } from '@angular/core';

export interface ContactoAsunto {
  id:            number;
  label:         string;   // lo que ve el usuario en el select
  emailDestino:  string;   // correo al que se envía el mensaje
}

export interface ContactoInfo {
  id:      number;
  icon:    string;         // material icon name
  title:   string;
  details: string[];       // líneas de detalle
  extra?:  string;         // texto secundario opcional
}

export interface ContactoRed {
  id:      number;
  nombre:  string;
  url:     string;
  red:     'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
}

export interface ContactoConfig {
  // Hero
  heroTitulo:      string;
  heroDescripcion: string;
  // Mapa
  mapImageUrl:     string;
  mapLinkUrl:      string;
  // Info de contacto
  infoCards:       ContactoInfo[];
  // Redes sociales
  redes:           ContactoRed[];
  // Formulario
  formTitulo:      string;
  formDescripcion: string;
  formBotonLabel:  string;
  asuntos:         ContactoAsunto[];
}

const KEY = 'edu_contacto';

const DEFAULT: ContactoConfig = {
  heroTitulo:      'Ponte en contacto',
  heroDescripcion: 'Estamos aquí para resolver tus dudas y apoyarte en tu proceso académico. Envíanos un mensaje o visítanos en nuestro campus.',
  mapImageUrl:     '',
  mapLinkUrl:      'https://maps.google.com',
  infoCards: [
    { id: 1, icon: 'location_on',  title: 'Dirección',          details: ['Av. Don Bosco s/n, Cuenca, Ecuador'],          extra: 'Campus Principal UETS' },
    { id: 2, icon: 'phone',        title: 'Teléfono',           details: ['+593 7 000 0000', '+593 7 000 0001'],           extra: 'Lun – Vie: 07:00 – 17:00' },
    { id: 3, icon: 'email',        title: 'Correo electrónico', details: ['info@uets.edu.ec'],                             extra: 'Respondemos en 24 horas' },
    { id: 4, icon: 'schedule',     title: 'Horario de atención', details: ['Lunes a Viernes: 07:00 – 17:00'],             extra: 'Sábados: 08:00 – 12:00' },
  ],
  redes: [
    { id: 1, nombre: 'Facebook',  url: 'https://facebook.com',  red: 'facebook'  },
    { id: 2, nombre: 'Twitter',   url: 'https://twitter.com',   red: 'twitter'   },
    { id: 3, nombre: 'Instagram', url: 'https://instagram.com', red: 'instagram' },
    { id: 4, nombre: 'LinkedIn',  url: 'https://linkedin.com',  red: 'linkedin'  },
  ],
  formTitulo:      'Envíanos un mensaje',
  formDescripcion: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible.',
  formBotonLabel:  'Enviar mensaje',
  asuntos: [
    { id: 1, label: 'Información general',  emailDestino: 'info@uets.edu.ec'        },
    { id: 2, label: 'Admisiones',           emailDestino: 'admisiones@uets.edu.ec'  },
    { id: 3, label: 'Secretaría',           emailDestino: 'secretaria@uets.edu.ec'  },
    { id: 4, label: 'Psicología',           emailDestino: 'psicologia@uets.edu.ec'  },
    { id: 5, label: 'Coordinación académica', emailDestino: 'coordinacion@uets.edu.ec' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ContactoService {
  get(): ContactoConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }
  getCopia(): ContactoConfig { return JSON.parse(JSON.stringify(this.get())); }
  guardar(c: ContactoConfig): void { localStorage.setItem(KEY, JSON.stringify(c)); }
  nextId(): number { return Date.now(); }
}
