import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-biblioteca', standalone: true, imports: [CommonModule],
  template: `<div class="p-8"><h1 class="text-2xl font-bold text-slate-800 dark:text-white">Biblioteca</h1><p class="text-slate-500 mt-2">Editor de contenido de la página de Biblioteca.</p></div>` })
export class Biblioteca {}
