/**
 * @file app.config.ts
 * @description Configuración global de la aplicación Angular.
 * Registra los providers necesarios: router, animaciones y error listeners.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Captura errores globales del navegador
    provideRouter(routes),
    provideAnimations(),
  ]
};
