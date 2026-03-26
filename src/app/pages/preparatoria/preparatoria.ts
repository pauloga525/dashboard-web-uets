import { Component } from '@angular/core';
import { NivelEditor } from '../nivel-editor/nivel-editor';

@Component({
  selector: 'app-preparatoria',
  standalone: true,
  imports: [NivelEditor],
  template: `<app-nivel-editor nivelId="preparatoria" titulo="Preparatoria"></app-nivel-editor>`,
})
export class Preparatoria {}
