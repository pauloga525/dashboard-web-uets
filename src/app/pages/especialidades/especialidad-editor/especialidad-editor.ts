import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-especialidad-editor',
  standalone: true,
  templateUrl: './especialidad-editor.html',
  styleUrl: './especialidad-editor.css'
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

}