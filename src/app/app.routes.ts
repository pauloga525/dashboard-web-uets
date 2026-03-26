/**
 * @file app.routes.ts
 * @description Configuración de rutas de la aplicación.
 * Todas las rutas del panel están protegidas por authGuard.
 */
import { Routes } from '@angular/router';

import { Login }             from './pages/login/login';
import { Dashboard }         from './pages/dashboard/dashboard';
import { HeaderEditor }      from './pages/header-editor/header-editor';
import { FooterEditor }      from './pages/footer-editor/footer-editor';
import { Preparatoria }      from './pages/preparatoria/preparatoria';
import { BasicaElemental }   from './pages/basica-elemental/basica-elemental';
import { BasicaMedia }       from './pages/basica-media/basica-media';
import { BasicaSuperior }    from './pages/basica-superior/basica-superior';
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
  { path: 'login', component: Login },

  { path: '',                   canActivate: [authGuard], component: Dashboard,       data: { animation: 'Dashboard',        breadcrumb: 'Panel Principal'    } },
  { path: 'header',             canActivate: [authGuard], component: HeaderEditor,    data: { animation: 'HeaderEditor',     breadcrumb: 'Header del sitio'   } },
  { path: 'footer',             canActivate: [authGuard], component: FooterEditor,    data: { animation: 'FooterEditor',     breadcrumb: 'Footer del sitio'   } },
  { path: 'preparatoria',       canActivate: [authGuard], component: Preparatoria,    data: { animation: 'Preparatoria',     breadcrumb: 'Preparatoria'       } },
  { path: 'basica-elemental',   canActivate: [authGuard], component: BasicaElemental, data: { animation: 'BasicaElemental',  breadcrumb: 'Básica Elemental'   } },
  { path: 'basica-media',       canActivate: [authGuard], component: BasicaMedia,     data: { animation: 'BasicaMedia',      breadcrumb: 'Básica Media'       } },
  { path: 'basica-superior',    canActivate: [authGuard], component: BasicaSuperior,  data: { animation: 'BasicaSuperior',   breadcrumb: 'Básica Superior'    } },
  { path: 'especialidades',     canActivate: [authGuard], component: Especialidades,  data: { animation: 'Especialidades',   breadcrumb: 'Bachillerato'       } },
  { path: 'especialidades/:id', canActivate: [authGuard], component: EspecialidadEditor, data: { animation: 'EspecialidadEditor' } },
  { path: 'recursos',           canActivate: [authGuard], component: Recursos,        data: { animation: 'Recursos',         breadcrumb: 'Recursos'           } },
  { path: 'estudiantes',        canActivate: [authGuard], component: Estudiantes,     data: { animation: 'Estudiantes',      breadcrumb: 'Estudiantes'        } },
  { path: 'eventos',            canActivate: [authGuard], component: Eventos,         data: { animation: 'Eventos',          breadcrumb: 'Eventos'            } },
  { path: 'eventos/:id',        canActivate: [authGuard], component: EventoEditor,    data: { animation: 'EventoEditor'                                       } },
  { path: 'configuracion',      canActivate: [authGuard], component: Configuracion,   data: { animation: 'Configuracion',    breadcrumb: 'Configuración'      } },
  { path: 'actividad',          canActivate: [authGuard], component: Actividad,       data: { animation: 'Actividad',        breadcrumb: 'Actividad reciente' } },
  {
    path: 'notificaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/notificaciones/notificaciones').then(m => m.Notificaciones),
    data: { breadcrumb: 'Notificaciones' }
  },
];
