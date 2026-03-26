/**
 * @file user.service.ts
 * @description Gestiona el perfil del administrador y sus credenciales.
 * Persiste en localStorage. Es la fuente de verdad para login y configuración.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  nombre:    string;
  apellido:  string;
  username:  string;
  email:     string;
  cargo:     string;
  avatar:    string;   // URL o base64
  password:  string;
}

const KEY = 'edu_user_profile';

const DEFAULT: UserProfile = {
  nombre:   'Admin',
  apellido: '',
  username: 'admin',
  email:    'admin@uets.edu.ec',
  cargo:    'Administrador',
  avatar:   '',
  password: 'admin',
};

@Injectable({ providedIn: 'root' })
export class UserService {

  private subject = new BehaviorSubject<UserProfile>(this.cargar());
  profile$ = this.subject.asObservable();

  private cargar(): UserProfile {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  }

  get(): UserProfile { return this.subject.value; }

  guardar(p: UserProfile): void {
    localStorage.setItem(KEY, JSON.stringify(p));
    this.subject.next({ ...p });
  }

  getCopia(): UserProfile { return { ...this.subject.value }; }

  /** Iniciales para el avatar de texto. */
  getIniciales(): string {
    const p = this.subject.value;
    const a = (p.nombre?.[0] ?? '').toUpperCase();
    const b = (p.apellido?.[0] ?? '').toUpperCase();
    return b ? a + b : a || 'A';
  }

  /** Nombre completo. */
  getNombreCompleto(): string {
    const p = this.subject.value;
    return [p.nombre, p.apellido].filter(Boolean).join(' ');
  }

  /** Verifica credenciales (usado por AuthService). */
  verificar(username: string, password: string): boolean {
    const p = this.subject.value;
    return p.username === username && p.password === password;
  }
}
