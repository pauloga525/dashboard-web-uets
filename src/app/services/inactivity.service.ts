/**
 * @file inactivity.service.ts
 * @description Cierra la sesión automáticamente tras 10 minutos de inactividad.
 *
 * Estrategia:
 * - Guarda el timestamp de la última actividad en localStorage (no sessionStorage)
 *   para que persista si el usuario cierra y reabre la pestaña.
 * - Escucha eventos del DOM (mousemove, keydown, click, scroll, touchstart)
 *   para resetear el contador.
 * - Comprueba la expiración cada 30 segundos con un intervalo interno.
 * - Al iniciar sesión, escribe el timestamp. Al cerrar sesión, lo borra.
 */
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

const ACTIVITY_KEY  = 'edu_last_activity';
const TIMEOUT_MS    = 10 * 60 * 1000;   // 10 minutos
const CHECK_EVERY   = 30 * 1000;         // comprueba cada 30 s

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

@Injectable({ providedIn: 'root' })
export class InactivityService implements OnDestroy {

  private timer: ReturnType<typeof setInterval> | null = null;
  private boundReset = this.resetTimer.bind(this);

  constructor(private router: Router, private ngZone: NgZone) {}

  /** Llama a esto justo después de un login exitoso. */
  start(): void {
    this.touch();
    this.attachListeners();
    // Corre el intervalo fuera de la zona Angular para no disparar CD innecesariamente
    this.ngZone.runOutsideAngular(() => {
      this.timer = setInterval(() => this.check(), CHECK_EVERY);
    });
  }

  /** Llama a esto en logout o al inicializar la app si no hay sesión válida. */
  stop(): void {
    this.detachListeners();
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    localStorage.removeItem(ACTIVITY_KEY);
  }

  /**
   * Comprueba si la sesión expiró.
   * Retorna true si expiró (y ejecuta el logout), false si sigue activa.
   */
  check(): boolean {
    const last = Number(localStorage.getItem(ACTIVITY_KEY) ?? 0);
    if (!last) return false; // no hay sesión activa registrada
    if (Date.now() - last > TIMEOUT_MS) {
      this.ngZone.run(() => {
        this.stop();
        this.router.navigate(['/login'], { queryParams: { expired: '1' } });
      });
      return true;
    }
    return false;
  }

  /** Actualiza el timestamp de última actividad. */
  touch(): void {
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
  }

  /** ¿Hay un timestamp guardado y no ha expirado? */
  isSessionValid(): boolean {
    const last = Number(localStorage.getItem(ACTIVITY_KEY) ?? 0);
    if (!last) return false;
    return Date.now() - last <= TIMEOUT_MS;
  }

  private resetTimer(): void {
    // Corre fuera de Angular para no disparar change detection en cada movimiento
    this.touch();
  }

  private attachListeners(): void {
    ACTIVITY_EVENTS.forEach(ev =>
      window.addEventListener(ev, this.boundReset, { passive: true })
    );
  }

  private detachListeners(): void {
    ACTIVITY_EVENTS.forEach(ev =>
      window.removeEventListener(ev, this.boundReset)
    );
  }

  ngOnDestroy(): void { this.stop(); }
}
