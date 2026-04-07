import { Injectable } from '@angular/core';

export type UserRole   = 'super_admin' | 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface AppUser {
  id:       number;
  nombre:   string;
  apellido: string;
  email:    string;
  rol:      UserRole;
  status:   UserStatus;
  color:    string;   // tailwind bg color for avatar
}

export const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin',       label: 'Admin'       },
  { value: 'editor',      label: 'Editor'      },
  { value: 'viewer',      label: 'Viewer'      },
];

const COLORS = ['bg-primary', 'bg-orange-500', 'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-violet-500'];

const KEY = 'edu_users';

const DEFAULT: AppUser[] = [
  { id: 1, nombre: 'Admin',   apellido: '',        email: 'admin@uets.edu.ec',      rol: 'super_admin', status: 'active',   color: 'bg-primary'    },
];

@Injectable({ providedIn: 'root' })
export class UsersService {

  get(): AppUser[] {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT.map(u => ({ ...u }));
  }

  getCopia(): AppUser[] { return JSON.parse(JSON.stringify(this.get())); }

  guardar(list: AppUser[]): void { localStorage.setItem(KEY, JSON.stringify(list)); }

  nextId(): number { return Date.now(); }

  nextColor(list: AppUser[]): string {
    const used = list.map(u => u.color);
    return COLORS.find(c => !used.includes(c)) ?? COLORS[list.length % COLORS.length];
  }

  getIniciales(u: AppUser): string {
    const a = (u.nombre?.[0] ?? '').toUpperCase();
    const b = (u.apellido?.[0] ?? '').toUpperCase();
    return b ? a + b : a || '?';
  }

  getRolLabel(rol: UserRole): string {
    return ROLES.find(r => r.value === rol)?.label ?? rol;
  }
}
