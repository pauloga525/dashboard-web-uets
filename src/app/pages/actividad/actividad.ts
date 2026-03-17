import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../services/activity';
import { interval } from 'rxjs';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css'
})
export class Actividad {

actividades:any[] = [];

    constructor(public activityService: ActivityService){}

    ngOnInit(){

      this.actividades =
      this.activityService.getActividadesRecientes();

      interval(60000).subscribe(()=>{
      this.actividades = [...this.actividades];

      });
    }

    getActividadesAgrupadas(){
    return this.activityService.getActividadesAgrupadas();
    }

    isNuevaActividad(a:any){
    return this.activityService.isNuevaActividad(a);
    }
}