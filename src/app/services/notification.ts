import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

private storageKey = 'notificaciones';

private notificacionesSubject = new BehaviorSubject<any[]>(this.cargarDesdeStorage());

notificaciones$ = this.notificacionesSubject.asObservable();

constructor(){}

private cargarDesdeStorage(){

const data = localStorage.getItem(this.storageKey);

if(data){
return JSON.parse(data);
}

const iniciales = [

{
id:1,
titulo:'Nuevo estudiante registrado',
descripcion:'María José completó su inscripción.',
fecha:new Date(Date.now()-1000*60*2),
leida:false,
eliminada:false
},

{
id:2,
titulo:'Curso publicado',
descripcion:'Se agregó el curso de Física Cuántica.',
fecha:new Date(Date.now()-1000*60*10),
leida:false,
eliminada:false
},

{
id:3,
titulo:'Evento actualizado',
descripcion:'El horario del Open Day fue modificado.',
fecha:new Date(Date.now()-1000*60*25),
leida:true,
eliminada:false
},

{
id:4,
titulo:'Nuevo comentario',
descripcion:'Andrea comentó en el evento Conferencia Tech.',
fecha:new Date(Date.now()-1000*60*60),
leida:false,
eliminada:false
},

{
id:5,
titulo:'Usuario agregado',
descripcion:'Carlos Méndez ahora es administrador.',
fecha:new Date(Date.now()-1000*60*60*2),
leida:true,
eliminada:false
},

{
id:6,
titulo:'Material subido',
descripcion:'Se subió material para el curso Angular.',
fecha:new Date(Date.now()-1000*60*60*4),
leida:true,
eliminada:false
},

{
id:7,
titulo:'Nuevo evento creado',
descripcion:'Evento Taller de Robótica agregado.',
fecha:new Date(Date.now()-1000*60*60*6),
leida:false,
eliminada:false
},

{
id:8,
titulo:'Sistema actualizado',
descripcion:'La plataforma fue actualizada a la versión 2.1.',
fecha:new Date(Date.now()-1000*60*60*10),
leida:true,
eliminada:false
},

{
id:9,
titulo:'Reporte generado',
descripcion:'Reporte académico mensual disponible.',
fecha:new Date(Date.now()-1000*60*60*14),
leida:false,
eliminada:false
},

{
id:10,
titulo:'Nuevo estudiante inscrito',
descripcion:'Pedro Alvarez se inscribió en Matemáticas.',
fecha:new Date(Date.now()-1000*60*60*20),
leida:true,
eliminada:false
},

{
id:11,
titulo:'Evento finalizado',
descripcion:'Conferencia de IA finalizó correctamente.',
fecha:new Date(Date.now()-1000*60*60*28),
leida:true,
eliminada:false
},

{
id:12,
titulo:'Usuario eliminado',
descripcion:'Usuario invitado eliminado del sistema.',
fecha:new Date(Date.now()-1000*60*60*36),
leida:true,
eliminada:true
},

{
id:13,
titulo:'Evento cancelado',
descripcion:'Se canceló el evento de Programación.',
fecha:new Date(Date.now()-1000*60*60*48),
leida:true,
eliminada:true
},

{
id:14,
titulo:'Nuevo curso disponible',
descripcion:'Curso de Inteligencia Artificial agregado.',
fecha:new Date(Date.now()-1000*60*60*60),
leida:false,
eliminada:false
},

{
id:15,
titulo:'Actualización de seguridad',
descripcion:'Se aplicaron mejoras de seguridad.',
fecha:new Date(Date.now()-1000*60*60*72),
leida:true,
eliminada:false
}

];

localStorage.setItem(this.storageKey, JSON.stringify(iniciales));

return iniciales;

}

private guardar(data:any[]){

localStorage.setItem(this.storageKey, JSON.stringify(data));
this.notificacionesSubject.next(data);

}

getPendientes(){

return this.notificacionesSubject.value
.filter(n => !n.leida && !n.eliminada)
.sort((a,b)=> new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

}

getLeidas(){

return this.notificacionesSubject.value
.filter(n => n.leida && !n.eliminada)
.sort((a,b)=> new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

}

getEliminadas(){

return this.notificacionesSubject.value
.filter(n => n.eliminada)
.sort((a,b)=> new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

}

marcarComoLeida(n:any){

const lista = this.notificacionesSubject.value;

const notif = lista.find(x=>x.id===n.id);

if(notif){
notif.leida = true;
}

this.guardar(lista);

}

marcarTodasLeidas(){

const lista = this.notificacionesSubject.value;

lista.forEach(n=>{
if(!n.eliminada){
n.leida = true;
}
});

this.guardar(lista);

}

eliminarNotificacion(n:any){

const lista = this.notificacionesSubject.value;

const notif = lista.find(x=>x.id===n.id);

if(notif){
notif.eliminada = true;
}

this.guardar(lista);

}

agregarNotificacion(n:any){

const lista = this.notificacionesSubject.value;

lista.unshift(n);

this.guardar(lista);

}

restaurarNotificacion(n:any){

    const lista = this.notificacionesSubject.value;

    const notif = lista.find(x => x.id === n.id);

    if(notif){
      notif.eliminada = false;
      notif.leida = false;
    }

    this.guardar(lista);

}

getTiempoRelativo(fecha: Date){

const ahora = Date.now();
const tiempo = new Date(fecha).getTime();
const diff = ahora - tiempo;

const min = Math.floor(diff / 60000);
const horas = Math.floor(diff / 3600000);
const dias = Math.floor(diff / 86400000);
const semanas = Math.floor(diff / 604800000);
const meses = Math.floor(diff / 2592000000);

if(min < 1){
return 'Ahora';
}

if(min < 60){
return `Hace ${min} min`;
}

if(horas < 24){
return `Hace ${horas} h`;
}

if(dias === 1){
return 'Ayer';
}

if(dias < 7){
return `Hace ${dias} días`;
}

if(semanas < 4){
return `Hace ${semanas} sem`;
}

return `Hace ${meses} mes`;
}

}