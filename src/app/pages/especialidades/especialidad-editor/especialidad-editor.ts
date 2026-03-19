import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-especialidad-editor',
  standalone: true,
  templateUrl: './especialidad-editor.html',
  styleUrl: './especialidad-editor.css',
  imports: [FormsModule, CommonModule]
})


export class EspecialidadEditor implements OnInit {

  especialidad:any;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(){

    const navigation = history.state;

    if(navigation?.nombre){
      this.breadcrumb = navigation.nombre;
    }

    const id = this.route.snapshot.paramMap.get('id');

    const data = localStorage.getItem('especialidades');

    if(data){

      const lista = JSON.parse(data);

      this.especialidad = lista.find((e:any)=> e.id == id);

    }

  }

  volver(){
    this.location.back();
  }


  guardar(){

  const data = localStorage.getItem('especialidades');

  if(data){

    const lista = JSON.parse(data);

    const index = lista.findIndex((e:any)=> e.id == this.especialidad.id);

    lista[index] = this.especialidad;

    localStorage.setItem('especialidades', JSON.stringify(lista));

  }

}

eliminar(){

  const data = localStorage.getItem('especialidades');

  if(data){

    let lista = JSON.parse(data);

    lista = lista.filter((e:any)=> e.id != this.especialidad.id);

    localStorage.setItem('especialidades', JSON.stringify(lista));

    history.back();

  }

}

breadcrumb = '';
tabActiva = 'general';

tabs = [
  { id: 'general', label: 'General' },
  { id: 'imagen', label: 'Imagen' },
  { id: 'malla', label: 'Malla Curricular' },
  { id: 'coordinador', label: 'Coordinador' },
  { id: 'publicacion', label: 'Publicación' },
];

}