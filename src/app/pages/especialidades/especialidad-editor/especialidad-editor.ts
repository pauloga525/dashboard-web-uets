import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-especialidad-editor',
  standalone: true,
  templateUrl: './especialidad-editor.html',
  styleUrl: './especialidad-editor.css',
  imports: [FormsModule]
})
export class EspecialidadEditor implements OnInit {

  especialidad:any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){

    const id = this.route.snapshot.paramMap.get('id');

    const data = localStorage.getItem('especialidades');

    if(data){

      const lista = JSON.parse(data);

      this.especialidad = lista.find((e:any)=> e.id == id);

    }

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

}