import { Component } from '@angular/core';
import { NivelEditor } from '../nivel-editor/nivel-editor';

@Component({
  selector: 'app-basica-elemental',
  standalone: true,
  imports: [NivelEditor],
  template: `<app-nivel-editor nivelId="basica-elemental" titulo="Básica Elemental"></app-nivel-editor>`,
})
export class BasicaElemental {}
