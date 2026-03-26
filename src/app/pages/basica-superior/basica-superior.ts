import { Component } from '@angular/core';
import { NivelEditor } from '../nivel-editor/nivel-editor';

@Component({
  selector: 'app-basica-superior',
  standalone: true,
  imports: [NivelEditor],
  template: `<app-nivel-editor nivelId="basica-superior" titulo="Básica Superior"></app-nivel-editor>`,
})
export class BasicaSuperior {}
