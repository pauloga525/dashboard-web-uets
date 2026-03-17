import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../services/activity';
import { interval } from 'rxjs';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [RouterModule, CommonModule],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{

  stats = {
    estudiantes: 1240,
    estudiantesCambio: 12,

    especialidades: 42,

    eventos: 15,

    usuarios: 856,
    usuariosCambio: 5
  };

  

  actividades:any[] = [];

    constructor(public activityService: ActivityService){}

    ngOnInit(){

// actualizar número de especialidades
const data = localStorage.getItem('especialidades');

if(data){
const especialidades = JSON.parse(data);
this.stats.especialidades = especialidades.length;
}

// cargar actividades recientes
this.actividades =
this.activityService.getActividadesRecientes();

// refrescar tiempo relativo cada minuto
interval(60000).subscribe(()=>{
this.actividades = [...this.actividades];
});

}
  

  seccionesHome = [
    {
    nombre: 'Slider Principal',
    estado: 'activo',
    detalle: '4 slides'
    },
    {
    nombre: 'Próximos Cursos',
    estado: 'activo',
    detalle: 'Auto-update'
    },
    {
    nombre: 'Testimonios',
    estado: 'revision',
    detalle: 'Pendiente de revisión'
    }
  ];

  getActividadesAgrupadas(){

    const grupos:any = {};

    this.actividades.forEach(a => {

    const fecha = new Date(a.fecha);
    const hoy = new Date();

    const diff = Math.floor(
    (hoy.getTime() - fecha.getTime()) / 86400000
    );

    let grupo = '';
    let orden = 0;

    if(diff === 0){
      grupo = 'Hoy';
      orden = 0;
    }
    else if(diff === 1){
      grupo = 'Ayer';
      orden = 1;
    }
    else{
      grupo = `Hace ${diff} días`;
      orden = diff;
    }

    if(!grupos[grupo]){
      grupos[grupo] = {
      orden: orden,
      items: []
      };
    }

    grupos[grupo].items.push(a);

  });

    return Object.entries(grupos)
      .sort((a:any,b:any)=> a[1].orden - b[1].orden)
      .map(([titulo,data]:any)=>({
      titulo,
      items:data.items
    }));

  }

  isNuevaActividad(a:any){

const ahora = new Date().getTime();
const fecha = new Date(a.fecha).getTime();

const minutos = (ahora - fecha) / 60000;

return minutos <= 5;

}

}

  
