import { Injectable } from '@angular/core';

export interface Plataforma {
  id:    number;
  name:  string;
  image: string;  // URL del logo
  url:   string;  // enlace externo
}

const KEY = 'edu_plataformas';

const DEFAULT: Plataforma[] = [
  { id: 1, name: 'Moodle',     image: '', url: '#' },
  { id: 2, name: 'Microsoft',  image: '', url: '#' },
  { id: 3, name: 'Google',     image: '', url: '#' },
];

@Injectable({ providedIn: 'root' })
export class PlataformasService {
  get(): Plataforma[] {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT.map(p => ({ ...p }));
  }
  getCopia(): Plataforma[] { return JSON.parse(JSON.stringify(this.get())); }
  guardar(list: Plataforma[]): void { localStorage.setItem(KEY, JSON.stringify(list)); }
  nextId(): number { return Date.now(); }
}
