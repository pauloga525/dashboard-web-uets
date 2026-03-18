import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Analisis } from './pages/analisis/analisis';
import { Cursos } from './pages/cursos/cursos';
import { Especialidades } from './pages/especialidades/especialidades';
import { EspecialidadEditor } from './pages/especialidades/especialidad-editor/especialidad-editor';
import { Recursos } from './pages/recursos/recursos';
import { Estudiantes } from './pages/estudiantes/estudiantes';
import { Eventos } from './pages/eventos/eventos';
import { Configuracion } from './pages/configuracion/configuracion';
import { Actividad } from './pages/actividad/actividad';


export const routes: Routes = [
  { path: '', component: Dashboard, data: { animation: 'Dashboard', breadcrumb: 'Panel Principal' } },

  { path: 'analisis', component: Analisis, data: { animation: 'Analisis', breadcrumb: 'Analisis' } },
  { path: 'cursos', component: Cursos, data: { animation: 'Cursos', breadcrumb: 'Cursos' } },
  { path: 'especialidades', component: Especialidades, data: { animation: 'Especialidades', breadcrumb: 'Especialidades' } },

    {
      path: 'especialidades/:id',
      component: EspecialidadEditor,
      data: { animation: 'EspecialidadEditor' }
  },


  { path: 'recursos', component: Recursos, data: { animation: 'Recursos', breadcrumb: 'Recursos' } },
  { path: 'estudiantes', component: Estudiantes, data: { animation: 'Estudiantes', breadcrumb: 'Estudiantes' } },
  { path: 'eventos', component: Eventos, data: { animation: 'Eventos', breadcrumb: 'Eventos' } },
  { path: 'configuracion', component: Configuracion, data: { animation: 'Configuracion', breadcrumb: 'Configuracion' } },
  {
  path: 'notificaciones',
  loadComponent: () =>
    import('./pages/notificaciones/notificaciones')
      .then(m => m.Notificaciones),
      data: { breadcrumb: 'Notificaciones' }
  },
  { path: 'actividad', component: Actividad, data: { animation: 'Actividad', breadcrumb: 'Actividad reciente' } },

    
];
