import { Component } from '@angular/core';
import { NivelEditor } from '../nivel-editor/nivel-editor';

@Component({
  selector: 'app-basica-media',
  standalone: true,
  imports: [NivelEditor],
  template: `<app-nivel-editor nivelId="basica-media" titulo="Básica Media"></app-nivel-editor>`,
})
export class BasicaMedia {}
