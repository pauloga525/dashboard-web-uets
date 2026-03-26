/**
 * @file bachillerato.service.ts
 * @description Gestiona el contenido de la página pública de Bachillerato.
 */
import { Injectable } from '@angular/core';
import { BachilleratoConfig } from '../models';

const KEY = 'edu_bachillerato';

const DEFAULT: BachilleratoConfig = {
  heroImagenFondo: '',
  heroTitulo:      'Bachillerato Técnico',
  heroDescripcion: 'Descubre nuestras especialidades técnicas diseñadas para formar profesionales con valores y excelencia académica.',
  ctaTitulo:       '¿Listo para construir tu futuro?',
  ctaDescripcion:  'Únete a nuestra comunidad educativa y comienza tu camino hacia la excelencia profesional y humana.',
  ctaUrlDescarga:  '',
};

@Injectable({ providedIn: 'root' })
export class BachilleratoService {

  get(): BachilleratoConfig {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }

  getCopia(): BachilleratoConfig {
    return { ...this.get() };
  }

  guardar(config: BachilleratoConfig): void {
    localStorage.setItem(KEY, JSON.stringify(config));
  }
}
