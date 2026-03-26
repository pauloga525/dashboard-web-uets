/**
 * @file theme.service.ts
 * @description Gestiona el tema (claro/oscuro) de forma centralizada.
 * Persiste la preferencia en localStorage y sincroniza la clase `dark` en el DOM.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY = 'edu_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private _dark = new BehaviorSubject<boolean>(this.cargar());
  dark$ = this._dark.asObservable();

  constructor() {
    this.aplicar(this._dark.value);
  }

  get isDark(): boolean { return this._dark.value; }

  toggle(): void { this.set(!this._dark.value); }

  set(dark: boolean): void {
    this._dark.next(dark);
    localStorage.setItem(KEY, dark ? '1' : '0');
    this.aplicar(dark);
  }

  private cargar(): boolean {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) return saved === '1';
    // Respeta preferencia del sistema si no hay guardado
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private aplicar(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
