import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { IconService } from '../../services/icon.service';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { ActivityService } from '../../services/activity';
import { Router, RouterLink } from '@angular/router';



interface Especialidad {
  id: number
  icono: string
  titulo: string
  descripcion: string
  coordinador: string
  color: string
}


@Component({
  selector: 'app-especialidades',
  imports: [ RouterLink, NgClass, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',

  
  
})



export class Especialidades implements OnInit{

  constructor(
    public iconService: IconService,
    private activityService: ActivityService,
    public router: Router
  ) {}

  iconoSeleccionado = ''

especialidades: Especialidad[] = [



{
id: 1,
icono: 'ciencias',
titulo: 'Ciencias',
descripcion: 'Física, Química, Biología y Matemáticas',
coordinador: 'Dr. Juan Pérez',
color: 'purple'
},

{
id: 2,
icono: 'informatica',
titulo: 'Informática',
descripcion: 'Sistemas y Tecnología de la Información (TIC)',
coordinador: 'Ing. Mateo Pesantez',
color: 'blue'
},

{
id: 3,  
icono: 'mecatronica',
titulo: 'Mecatrónica',
descripcion: 'Mecánica, Electrónica e Informática',
coordinador: 'Ing. Rodney Siguenza',
color: 'emerald'
},

{
id: 4,
icono: 'mecanizado',
titulo: 'Mecanizado y Construcciones Metálicas',
descripcion: 'Manufactura y CNC',
coordinador: 'Ing. Oswaldo Zumba',
color: 'orange'
},

{
  id: 5,
icono: 'automotriz',
titulo: 'Electromecánica Automotriz',
descripcion: 'Sistemas Eléctricos y Mecánicos de Vehículos',
coordinador: 'Ing. Rene Urgilés',
color: 'red'
},

{
  id: 6,
icono: 'electricidad',
titulo: 'Instalaciones, Equipos y Máquinas Eléctricas',
descripcion: 'Generación y Distribución de Energía Eléctrica',
coordinador: 'Dr. Juan Pérez',
color: 'yellow'
}



]


ngOnInit(){

const data = localStorage.getItem('especialidades')

if(data){
this.especialidades = JSON.parse(data)
}

}

modalAbierto = false

nuevaEspecialidad = {
titulo: '',
descripcion: '',
coordinador: ''
}

abrirModal(){

this.modalAbierto = true


}

cerrarModal(){

this.modalAbierto = false

this.nuevaEspecialidad = {
titulo: '',
descripcion: '',
coordinador: ''
}

this.iconoSeleccionado = ''


}

colores = ['purple','blue','emerald','orange','red','yellow','cyan','pink','teal']

obtenerColorDisponible() {

const usados = this.especialidades.map(e => e.color)

const disponible = this.colores.find(c => !usados.includes(c))

return disponible || 'gray'

}

guardarEspecialidad(){

if(
!this.nuevaEspecialidad.titulo ||
!this.nuevaEspecialidad.descripcion ||
!this.nuevaEspecialidad.coordinador ||
!this.iconoSeleccionado
){
return
}



if(this.especialidadEditando !== null){
  const espAnterior = this.especialidades[this.especialidadEditando]


  if(espAnterior.titulo !== this.nuevaEspecialidad.titulo){
    this.activityService.agregarActividad(
      'especialidad',
      'Nombre de especialidad actualizado',
      `Se cambió el nombre de "${espAnterior.titulo}" a "${this.nuevaEspecialidad.titulo}".`
    )
  }

  if(espAnterior.descripcion !== this.nuevaEspecialidad.descripcion){
    this.activityService.agregarActividad(
      'especialidad',
      'Descripción actualizada',
      `Se actualizó la descripción de la especialidad "${espAnterior.titulo}".`
    )
  }

  if(espAnterior.coordinador !== this.nuevaEspecialidad.coordinador){
    this.activityService.agregarActividad(
      'especialidad',
      'Coordinador actualizado',
      `Se actualizó el coordinador de la especialidad "${espAnterior.titulo}".`
    )
  }

  if(espAnterior.icono !== this.iconoSeleccionado){
    this.activityService.agregarActividad(
      'especialidad',
      'Icono actualizado',
      `Se actualizó el icono de la especialidad "${espAnterior.titulo}".`
    )
  }

this.especialidades[this.especialidadEditando] = {

id: this.especialidades[this.especialidadEditando].id,
icono: this.iconoSeleccionado,
titulo: this.nuevaEspecialidad.titulo,
descripcion: this.nuevaEspecialidad.descripcion,
coordinador: this.nuevaEspecialidad.coordinador,
color: this.especialidades[this.especialidadEditando].color

}


}else{

const color = this.obtenerColorDisponible()

this.especialidades.push({
id: Date.now(),
icono: this.iconoSeleccionado,
titulo: this.nuevaEspecialidad.titulo,
descripcion: this.nuevaEspecialidad.descripcion,
coordinador: this.nuevaEspecialidad.coordinador,
color: color

})
this.activityService.agregarActividad(
'especialidad',
'Especialidad creada',
`Se creó la especialidad "${this.nuevaEspecialidad.titulo}".`
)

}

localStorage.setItem(
'especialidades',
JSON.stringify(this.especialidades)
)

this.especialidadEditando = null

this.cerrarModal()

}


iconosDisponibles = [
'ciencias',
'mecatronica',
'atom',
'microscope',
'computer',
'chip',
'terminal',
'robot',
'gear',
'wrench',
'factory',
'hammer',
'car',
'engine',
'bolt',
'plug',
'battery',
'users',
'book',
'clipboard'
]

seleccionarIcono(icono: string) {

this.iconoSeleccionado = icono

}

mostrarSelectorIconos = false
toggleIconos(){
  this.mostrarSelectorIconos = !this.mostrarSelectorIconos
}

badgeColor: Record<string, string> = {

purple:
'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',

blue:
'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',

emerald:
'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',

orange:
'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',

red:
'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',

yellow:
'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',

cyan:
'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',

pink:
'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',

teal:
'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700'

}

menuAbierto: number | null = null
especialidadEditando: number | null = null

toggleMenu(index: number){

this.menuAbierto = this.menuAbierto === index ? null : index

}

pedirEliminar(esp: Especialidad){

this.especialidadEliminar = esp
this.confirmarEliminar = true

}

confirmarEliminarEspecialidad(){

if(!this.especialidadEliminar) return

this.activityService.agregarActividad(
'especialidad',
'Especialidad eliminada',
`Se eliminó la especialidad "${this.especialidadEliminar.titulo}".`
)

this.especialidades =
this.especialidades.filter(e => e !== this.especialidadEliminar)

localStorage.setItem(
'especialidades',
JSON.stringify(this.especialidades)
)


this.especialidadEliminar = null
this.confirmarEliminar = false
this.menuAbierto = null

}

@HostListener('document:click')
cerrarMenuFuera(){
this.menuAbierto = null
}

@HostListener('document:keydown.escape')
cerrarConEscape(){

this.menuAbierto = null
this.confirmarEliminar = false

}

filaEliminando: Especialidad | null = null



cancelarEliminar(){

this.confirmarEliminar = false
this.indexEliminar = null

}


editarEspecialidad(index: number){

const esp = this.especialidades[index]

this.nuevaEspecialidad = {
titulo: esp.titulo,
descripcion: esp.descripcion,
coordinador: esp.coordinador
}

this.iconoSeleccionado = esp.icono

this.especialidadEditando = index

this.menuAbierto = null

this.modalAbierto = true

}

confirmarEliminar = false
indexEliminar: number | null = null
especialidadEliminar: Especialidad | null = null

}


