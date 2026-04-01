import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiasService, NoticiasConfig, Noticia, NoticiaImagen } from '../../services/noticias.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="p-8 max-w-7xl mx-auto w-full space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-slate-800 dark:text-white">Noticias</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gestiona el hero y todas las noticias del sitio público.</p>
    </div>
    <div class="flex items-center gap-3">
      <button type="button" (click)="agregarNoticia()" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-primary text-primary hover:bg-primary/5 transition">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Nueva noticia
      </button>
      <button type="button" (click)="guardar()" [class]="guardado ? 'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-green-500 text-white transition' : 'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition shadow-md shadow-primary/20'">
        @if (guardado) { <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Guardado
        } @else { <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Guardar cambios }
      </button>
    </div>
  </div>

  <!-- HERO -->
  <div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
    <h2 class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hero de la página</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Título</label>
        <input [(ngModel)]="config.heroTitulo" (ngModelChange)="onChange()" class="input-field" /></div>
      <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">URL imagen de fondo</label>
        <input [(ngModel)]="config.heroImagenFondo" (ngModelChange)="onChange()" placeholder="https://..." class="input-field" /></div>
      <div class="md:col-span-2"><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Descripción</label>
        <textarea [(ngModel)]="config.heroDescripcion" (ngModelChange)="onChange()" rows="2" class="input-field resize-none"></textarea></div>
    </div>
  </div>

  <!-- LAYOUT -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

    <!-- LISTA -->
    <div class="lg:col-span-2 space-y-2">
      <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Noticias ({{config.noticias.length}})</p>
      @for (n of config.noticias; track n.id) {
      <div class="group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
           [ngClass]="seleccionada?.id === n.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark'"
           (click)="seleccionar(n)">
        <div class="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          @if (n.image || n.featuredImage) { <img [src]="n.image || n.featuredImage" [alt]="n.title" class="w-full h-full object-cover" /> }
          @else { <div class="w-full h-full flex items-center justify-center text-slate-300"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div> }
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-primary truncate">{{n.tag || n.category || 'Sin categoría'}}</p>
          <p class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{n.title || 'Sin título'}}</p>
          <p class="text-[11px] text-slate-400 truncate">{{n.date || 'Sin fecha'}}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          @if (n.destacada) { <span class="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">★</span> }
          <button type="button" (click)="eliminarNoticia(n.id); $event.stopPropagation()" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition p-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      }
      @if (!config.noticias.length) { <p class="text-sm text-slate-400 italic text-center py-8">Sin noticias — crea una arriba.</p> }
    </div>

    <!-- EDITOR -->
    <div class="lg:col-span-3">
      @if (!seleccionada) {
        <div class="h-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <svg class="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <p class="text-sm text-slate-500 dark:text-slate-400">Selecciona una noticia para editarla.</p>
        </div>
      } @else {
      <div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p class="text-sm font-bold text-slate-800 dark:text-white truncate max-w-xs">{{seleccionada.title || 'Nueva noticia'}}</p>
          <label class="flex items-center gap-2 cursor-pointer shrink-0">
            <input type="checkbox" [(ngModel)]="seleccionada.destacada" (ngModelChange)="onChange()" class="rounded" />
            <span class="text-xs text-slate-500">Destacada (carousel)</span>
          </label>
        </div>
        <div class="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <button type="button" (click)="tabDetalle = 'info'" [class]="tabDetalle==='info' ? 'px-4 py-2.5 text-xs font-bold border-b-2 border-primary text-primary' : 'px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 transition'">Información</button>
          <button type="button" (click)="tabDetalle = 'contenido'" [class]="tabDetalle==='contenido' ? 'px-4 py-2.5 text-xs font-bold border-b-2 border-primary text-primary' : 'px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 transition'">Contenido</button>
          <button type="button" (click)="tabDetalle = 'galeria'" [class]="tabDetalle==='galeria' ? 'px-4 py-2.5 text-xs font-bold border-b-2 border-primary text-primary' : 'px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 transition'">Galería & Tags</button>
        </div>
        <div class="p-5 space-y-4">

          @if (tabDetalle === 'info') {
          <div class="space-y-4 animate-[fadeIn_.2s_ease_forwards]">
            <div class="grid grid-cols-2 gap-3">
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tag (listado)</label><input [(ngModel)]="seleccionada.tag" (ngModelChange)="onChange()" placeholder="Ej: Académico" class="input-field" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Categoría (detalle)</label><input [(ngModel)]="seleccionada.category" (ngModelChange)="onChange()" placeholder="Ej: Académico" class="input-field" /></div>
              <div class="col-span-2"><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Título</label><input [(ngModel)]="seleccionada.title" (ngModelChange)="onChange()" class="input-field font-semibold" /></div>
              <div class="col-span-2"><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Descripción corta</label><textarea [(ngModel)]="seleccionada.description" (ngModelChange)="onChange()" rows="2" class="input-field resize-none"></textarea></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Imagen tarjeta (listado)</label><input [(ngModel)]="seleccionada.image" (ngModelChange)="onChange()" placeholder="https://..." class="input-field text-xs" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Imagen hero (detalle)</label><input [(ngModel)]="seleccionada.featuredImage" (ngModelChange)="onChange()" placeholder="https://..." class="input-field text-xs" /></div>
            </div>
            <hr class="border-slate-100 dark:border-slate-800" />
            <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Autor</p>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nombre del autor</label><input [(ngModel)]="seleccionada.author" (ngModelChange)="onChange()" class="input-field" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Foto del autor (URL)</label><input [(ngModel)]="seleccionada.authorImage" (ngModelChange)="onChange()" placeholder="https://..." class="input-field text-xs" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Fecha</label><input [(ngModel)]="seleccionada.date" (ngModelChange)="onChange()" placeholder="Ej: 15 Ene 2024" class="input-field" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tiempo de lectura</label><input [(ngModel)]="seleccionada.readTime" (ngModelChange)="onChange()" placeholder="Ej: 3 min" class="input-field" /></div>
            </div>
          </div>
          }

          @if (tabDetalle === 'contenido') {
          <div class="space-y-3 animate-[fadeIn_.2s_ease_forwards]">
            <p class="text-xs text-slate-400 dark:text-slate-500">Escribe el artículo completo. Separa los párrafos con una línea en blanco.</p>
            <textarea [(ngModel)]="seleccionada.content" (ngModelChange)="onChange()" rows="18" class="input-field resize-y font-mono text-sm leading-relaxed"></textarea>
          </div>
          }

          @if (tabDetalle === 'galeria') {
          <div class="space-y-5 animate-[fadeIn_.2s_ease_forwards]">
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Galería de imágenes</p>
                <button type="button" (click)="agregarImagen()" class="text-xs text-primary hover:underline flex items-center gap-1"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Agregar</button>
              </div>
              <div class="space-y-2">
                @for (img of seleccionada.images; track trackById($index, img)) {
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    @if (img.url) { <img [src]="img.url" [alt]="img.alt" class="w-full h-full object-cover" /> }
                  </div>
                  <input [(ngModel)]="img.url" (ngModelChange)="onChange()" placeholder="URL imagen" class="flex-1 input-field text-xs" />
                  <input [(ngModel)]="img.alt" (ngModelChange)="onChange()" placeholder="Descripción" class="flex-1 input-field text-xs" />
                  <button type="button" (click)="eliminarImagen(img.id)" class="text-slate-300 hover:text-red-500 transition shrink-0"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                }
                @if (!seleccionada.images.length) { <p class="text-xs text-slate-400 italic">Sin imágenes en la galería.</p> }
              </div>
            </div>
            <hr class="border-slate-100 dark:border-slate-800" />
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Tags</p>
              <div class="flex flex-wrap gap-2 mb-3">
                @for (tag of seleccionada.tags; track tag) {
                <span class="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                  {{tag}}
                  <button type="button" (click)="eliminarTag(tag)" class="text-slate-400 hover:text-red-500 transition"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </span>
                }
              </div>
              <div class="flex gap-2">
                <input [(ngModel)]="nuevoTag" (keyup.enter)="agregarTag()" placeholder="Nuevo tag..." class="flex-1 input-field text-sm" />
                <button type="button" (click)="agregarTag()" class="px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition shrink-0">Agregar</button>
              </div>
            </div>
          </div>
          }

        </div>
      </div>
      }
    </div>
  </div>
</div>
  `,
})
export class Noticias implements OnInit {

  config!: NoticiasConfig;
  seleccionada: Noticia | null = null;
  guardado = false;
  tabDetalle: 'info' | 'contenido' | 'galeria' = 'info';
  nuevoTag = '';
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private svc: NoticiasService) {}

  ngOnInit(): void { this.config = this.svc.getCopia(); }

  onChange(): void { this.guardado = false; }

  guardar(): void {
    // Sincroniza la noticia editada en la lista antes de guardar
    if (this.seleccionada) {
      const idx = this.config.noticias.findIndex(n => n.id === this.seleccionada!.id);
      if (idx !== -1) this.config.noticias[idx] = { ...this.seleccionada };
    }
    this.svc.guardar(this.config);
    this.guardado = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.guardado = false, 3000);
  }

  trackById(_i: number, item: { id: number }): number { return item.id; }

  // ── Lista ──────────────────────────────────────────────────────────────────
  agregarNoticia(): void {
    const nueva: Noticia = {
      id: this.svc.nextId(), tag: '', title: '', description: '', image: '', destacada: false,
      category: '', featuredImage: '', author: '', authorImage: '', date: '', readTime: '',
      content: '', images: [], tags: [],
    };
    this.config.noticias.push(nueva);
    this.seleccionada = { ...nueva };
    this.onChange();
  }

  seleccionar(n: Noticia): void {
    this.guardarSeleccionada();
    this.seleccionada = JSON.parse(JSON.stringify(n));
    this.tabDetalle = 'info';
    this.guardado = false;
  }

  eliminarNoticia(id: number): void {
    this.config.noticias = this.config.noticias.filter(n => n.id !== id);
    if (this.seleccionada?.id === id) this.seleccionada = null;
    this.onChange();
  }

  private guardarSeleccionada(): void {
    if (!this.seleccionada) return;
    const idx = this.config.noticias.findIndex(n => n.id === this.seleccionada!.id);
    if (idx !== -1) this.config.noticias[idx] = { ...this.seleccionada };
  }

  // ── Tags ───────────────────────────────────────────────────────────────────
  agregarTag(): void {
    const t = this.nuevoTag.trim();
    if (!t || !this.seleccionada) return;
    if (!this.seleccionada.tags.includes(t)) this.seleccionada.tags.push(t);
    this.nuevoTag = '';
    this.onChange();
  }
  eliminarTag(tag: string): void {
    if (!this.seleccionada) return;
    this.seleccionada.tags = this.seleccionada.tags.filter(t => t !== tag);
    this.onChange();
  }

  // ── Galería ────────────────────────────────────────────────────────────────
  agregarImagen(): void {
    this.seleccionada?.images.push({ id: this.svc.nextId(), url: '', alt: '' });
    this.onChange();
  }
  eliminarImagen(id: number): void {
    if (!this.seleccionada) return;
    this.seleccionada.images = this.seleccionada.images.filter(i => i.id !== id);
    this.onChange();
  }
}
