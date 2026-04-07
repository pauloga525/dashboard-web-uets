import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstructivosService, InstructivosConfig, Instructivo, InstructivoCategoria } from '../../services/instructivos.service';

type Tab = 'hero' | 'categorias' | 'instructivos';

@Component({
  selector: 'app-instructivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="p-8 max-w-5xl mx-auto w-full space-y-6">

  <!-- HEADER -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-800 dark:text-white">Instructivos</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Editor de la página pública de Instructivos y Tutoriales.</p>
    </div>
    <button type="button" (click)="guardar()" [class]="guardado ? 'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500 text-white transition' : 'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition shadow-md shadow-primary/20'">
      @if (guardado) { <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Guardado
      } @else { <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Guardar cambios }
    </button>
  </div>

  <div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
    <div class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
      <div class="flex">
        @for (t of tabs; track t.id) {
          <button type="button" (click)="tabActiva = t.id" [class]="tabActiva === t.id ? 'px-5 py-3 text-xs font-bold border-b-2 border-primary text-primary' : 'px-5 py-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition'">{{t.label}}</button>
        }
      </div>
    </div>
    <div class="p-6">

      <!-- ══ HERO ══ -->
      @if (tabActiva === 'hero') {
      <div class="space-y-4 animate-[fadeIn_.2s_ease_forwards]">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hero de la página</h3>
        <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Título</label>
          <input [(ngModel)]="config.heroTitulo" (ngModelChange)="onChange()" class="input-field" /></div>
        <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Descripción</label>
          <textarea [(ngModel)]="config.heroDescripcion" (ngModelChange)="onChange()" rows="3" class="input-field resize-none"></textarea></div>
        <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">URL "Contactar Soporte"</label>
          <input [(ngModel)]="config.soporteUrl" (ngModelChange)="onChange()" placeholder="/contacto" class="input-field" /></div>
      </div>
      }

      <!-- ══ CATEGORÍAS ══ -->
      @if (tabActiva === 'categorias') {
      <div class="space-y-4 animate-[fadeIn_.2s_ease_forwards]">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Categorías del sidebar</h3>
          <button type="button" (click)="agregarCategoria()" class="text-xs text-primary hover:underline flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Agregar
          </button>
        </div>
        <div class="space-y-2">
          @for (c of config.categorias; track trackById($index, c)) {
          <div class="flex items-center gap-2">
            <input [(ngModel)]="c.icon" (ngModelChange)="onChange()" placeholder="Ícono material" class="w-36 input-field text-xs" />
            <input [(ngModel)]="c.name" (ngModelChange)="onChange()" placeholder="Nombre de la categoría" class="flex-1 input-field text-sm" />
            <button type="button" (click)="eliminarCategoria(c.id)" class="text-slate-300 hover:text-red-500 transition shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
          }
        </div>
      </div>
      }

      <!-- ══ INSTRUCTIVOS ══ -->
      @if (tabActiva === 'instructivos') {
      <div class="space-y-4 animate-[fadeIn_.2s_ease_forwards]">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Instructivos ({{config.instructivos.length}})</h3>
          <button type="button" (click)="agregarInstructivo()" class="text-xs text-primary hover:underline flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Agregar
          </button>
        </div>
        <div class="space-y-4">
          @for (inst of config.instructivos; track trackById($index, inst)) {
          <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
            <!-- Fila 1: tipo + título + eliminar -->
            <div class="flex items-center gap-2">
              <select [(ngModel)]="inst.type" (ngModelChange)="onChange()"
                class="text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0">
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
              </select>
              <input [(ngModel)]="inst.title" (ngModelChange)="onChange()" placeholder="Título" class="flex-1 input-field font-semibold" />
              <button type="button" (click)="eliminarInstructivo(inst.id)" class="text-slate-300 hover:text-red-500 transition shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
            <!-- Fila 2: descripción -->
            <textarea [(ngModel)]="inst.description" (ngModelChange)="onChange()" rows="2" placeholder="Descripción breve" class="w-full input-field resize-none text-sm"></textarea>
            <!-- Fila 3: categoría + fecha + texto botón -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select [(ngModel)]="inst.categoria" (ngModelChange)="onChange()"
                class="text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30">
                @for (cat of config.categorias; track cat.id) { <option [value]="cat.name">{{cat.name}}</option> }
              </select>
              <input [(ngModel)]="inst.fecha" (ngModelChange)="onChange()" type="date" class="input-field text-sm" />
              <input [(ngModel)]="inst.buttonText" (ngModelChange)="onChange()" placeholder="Texto del botón" class="input-field text-sm" />
            </div>
            <!-- Fila 4: URL -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <input [(ngModel)]="inst.url" (ngModelChange)="onChange()" placeholder="URL del recurso (PDF o video)" class="flex-1 input-field text-sm" />
            </div>
          </div>
          }
          @if (!config.instructivos.length) {
            <p class="text-sm text-slate-400 italic text-center py-8">Sin instructivos — agrega uno arriba.</p>
          }
        </div>
      </div>
      }

    </div>
  </div>
</div>
  `,
})
export class Instructivos implements OnInit {

  config!: InstructivosConfig;
  tabActiva: Tab = 'hero';
  guardado = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  tabs: { id: Tab; label: string }[] = [
    { id: 'hero',         label: 'Hero'         },
    { id: 'categorias',   label: 'Categorías'   },
    { id: 'instructivos', label: 'Instructivos' },
  ];

  constructor(private svc: InstructivosService) {}
  ngOnInit(): void { this.config = this.svc.getCopia(); }
  onChange(): void { this.guardado = false; }

  guardar(): void {
    this.svc.guardar(this.config);
    this.guardado = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.guardado = false, 3000);
  }

  trackById(_i: number, item: { id: number }): number { return item.id; }

  agregarCategoria(): void {
    this.config.categorias.push({ id: this.svc.nextId(), icon: 'folder', name: '' });
    this.onChange();
  }
  eliminarCategoria(id: number): void {
    this.config.categorias = this.config.categorias.filter(c => c.id !== id);
    this.onChange();
  }

  agregarInstructivo(): void {
    this.config.instructivos.push({
      id: this.svc.nextId(), title: '', description: '', type: 'pdf',
      categoria: this.config.categorias[0]?.name ?? '',
      fecha: new Date().toISOString().split('T')[0],
      url: '', buttonText: 'Descargar PDF',
    });
    this.onChange();
  }
  eliminarInstructivo(id: number): void {
    this.config.instructivos = this.config.instructivos.filter(i => i.id !== id);
    this.onChange();
  }
}
