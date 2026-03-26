/**
 * @file app.routes.ts
 * @description Configuración de rutas de la aplicación.
 * Todas las rutas del panel están protegidas por authGuard.
 */
import { Routes } from '@angular/router';

import { Login }             from './pages/login/login';
import { Dashboard }         from './pages/dashboard/dashboard';
import { Analisis }          from './pages/analisis/analisis';
import { Cursos }            from './pages/cursos/cursos';
import { Especialidades }    from './pages/especialidades/especialidades';
import { EspecialidadEditor } from './pages/especialidades/especialidad-editor/especialidad-editor';
import { Recursos }          from './pages/recursos/recursos';
import { Estudiantes }       from './pages/estudiantes/estudiantes';
import { Eventos }           from './pages/eventos/eventos';
import { EventoEditor }      from './pages/eventos/evento-editor/evento-editor';
import { Configuracion }     from './pages/configuracion/configuracion';
import { Actividad }         from './pages/actividad/actividad';
import { authGuard }         from './guards/auth.guard';

export const routes: Routes = [
  // Ruta pública — login
  { path: 'login', component: Login },

  // Rutas protegidas
  { path: '',               canActivate: [authGuard], component: Dashboard,         data: { animation: 'Dashboard',        breadcrumb: 'Panel Principal'    } },
  { path: 'analisis',       canActivate: [authGuard], component: Analisis,          data: { animation: 'Analisis',         breadcrumb: 'Análisis'           } },
  { path: 'cursos',         canActivate: [authGuard], component: Cursos,            data: { animation: 'Cursos',           breadcrumb: 'Cursos'             } },
  { path: 'especialidades', canActivate: [authGuard], component: Especialidades,    data: { animation: 'Especialidades',   breadcrumb: 'Especialidades'     } },
  { path: 'especialidades/:id', canActivate: [authGuard], component: EspecialidadEditor, data: { animation: 'EspecialidadEditor' } },
  { path: 'recursos',       canActivate: [authGuard], component: Recursos,          data: { animation: 'Recursos',         breadcrumb: 'Recursos'           } },
  { path: 'estudiantes',    canActivate: [authGuard], component: Estudiantes,       data: { animation: 'Estudiantes',      breadcrumb: 'Estudiantes'        } },
  { path: 'eventos',        canActivate: [authGuard], component: Eventos,           data: { animation: 'Eventos',          breadcrumb: 'Eventos'            } },
  { path: 'eventos/:id',    canActivate: [authGuard], component: EventoEditor,      data: { animation: 'EventoEditor'                                       } },
  { path: 'configuracion',  canActivate: [authGuard], component: Configuracion,     data: { animation: 'Configuracion',    breadcrumb: 'Configuración'      } },
  { path: 'actividad',      canActivate: [authGuard], component: Actividad,         data: { animation: 'Actividad',        breadcrumb: 'Actividad reciente' } },
  {
    path: 'notificaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notificaciones/notificaciones').then(m => m.Notificaciones),
    data: { breadcrumb: 'Notificaciones' }
  },
];
