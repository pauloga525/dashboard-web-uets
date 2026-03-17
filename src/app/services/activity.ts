import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

private actividades:any[] = [];

constructor(){

const guardadas = localStorage.getItem('actividades');

if(guardadas){

this.actividades = JSON.parse(guardadas).map((a:any)=>({
...a,
fecha: new Date(a.fecha)
}));

}else{

this.actividades = [];

this.guardar();

}

this.ordenar();

}

guardar(){
localStorage.setItem('actividades',JSON.stringify(this.actividades));
}

ordenar(){

this.actividades.sort((a,b)=>
new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
);

}

getActividades(){
return this.actividades;
}

getActividadesRecientes(){

this.ordenar();
return this.actividades.slice(0,5);

}

agregarActividad(tipo:string,titulo:string,descripcion:string){

const nueva = {

tipo:tipo,
titulo:titulo,
descripcion:descripcion,
fecha:new Date()

};

this.actividades.unshift(nueva);

this.guardar();

}

getTiempoRelativo(fecha:Date){

const ahora = new Date().getTime();
const tiempo = ahora - new Date(fecha).getTime();

const minutos = Math.floor(tiempo/60000);
const horas = Math.floor(tiempo/3600000);
const dias = Math.floor(tiempo/86400000);

if(minutos<60){
return `Hace ${minutos} min`;
}

if(horas<24){
return `Hace ${horas} h`;
}

return `Hace ${dias} día${dias>1?'s':''}`;

}

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