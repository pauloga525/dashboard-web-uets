import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';
import { interval } from 'rxjs';


@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'

})
export class Notificaciones implements OnInit {

  pendientes:any[] = [];
  leidas:any[] = [];
  eliminadas:any[] = [];

  constructor(private notificationService: NotificationService){}

  ngOnInit(){

    interval(60000).subscribe(()=>{
      this.cargarNotificaciones();
    });

    this.notificationService.notificaciones$
    .subscribe(()=>{

    this.cargarNotificaciones();

    });

  }

  cargarNotificaciones(){

    this.pendientes =
    this.notificationService.getPendientes();

    this.leidas =
    this.notificationService.getLeidas();

    this.eliminadas =
    this.notificationService.getEliminadas();

  }


  marcarLeida(n:any){
this.notificationService.marcarComoLeida(n);
}

eliminar(n:any){
this.notificationService.eliminarNotificacion(n);
}

restaurar(n:any){
this.notificationService.restaurarNotificacion(n);
}

get pendientesCount(){
return this.pendientes.length;
}

get leidasCount(){
return this.leidas.length;
}

get eliminadasCount(){
return this.eliminadas.length;
}
tabActiva = 'pendientes';

getTiempo(fecha: Date){
return this.notificationService.getTiempoRelativo(fecha);
}


}
