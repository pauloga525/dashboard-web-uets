/**
 * @file auth.service.ts
 * @description Servicio de autenticación con cierre de sesión por inactividad.
 * - Sesión activa: sessionStorage flag + localStorage timestamp.
 * - Expiración: 10 min sin actividad (gestionado por InactivityService).
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { InactivityService } from './inactivity.service';

const SESSION_KEY = 'edu_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private router: Router,
    private userService: UserService,
    private inactivity: InactivityService,
  ) {}

  login(username: string, password: string): boolean {
    if (this.userService.verificar(username, password)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      this.inactivity.start();
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.inactivity.stop();
    this.router.navigate(['/login']);
  }

  /**
   * Sesión válida si:
   * 1. El flag de sessionStorage existe (misma pestaña), Y
   * 2. El timestamp de actividad no ha expirado.
   *
   * Si el usuario cierra la pestaña y vuelve después de 10 min,
   * sessionStorage se habrá borrado solo (comportamiento nativo del browser),
   * por lo que el guard redirigirá al login de todas formas.
   *
   * Si vuelve antes de 10 min pero el timestamp expiró, también se rechaza.
   */
  isAuthenticated(): boolean {
    const flag = sessionStorage.getItem(SESSION_KEY) === '1';
    if (!flag) return false;
    // Comprueba expiración por inactividad
    if (!this.inactivity.isSessionValid()) {
      // Limpia sin redirigir (el guard se encarga)
      sessionStorage.removeItem(SESSION_KEY);
      this.inactivity.stop();
      return false;
    }
    return true;
  }
}
