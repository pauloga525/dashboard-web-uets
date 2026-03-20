/**
 * @file evento.service.ts
 * @description Servicio centralizado para gestión de eventos institucionales.
 * Maneja persistencia en localStorage y expone observables reactivos.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evento, CategoriaEvento, HeroEventos } from '../models';

const KEY_EVENTOS     = 'eventos';
const KEY_CATEGORIAS  = 'eventos_categorias';
const KEY_HERO        = 'eventos_hero';

const CATEGORIAS_INICIALES: CategoriaEvento[] = [
  { id: 1, nombre: 'Académico',    color: 'blue'    },
  { id: 2, nombre: 'Cultural',     color: 'purple'  },
  { id: 3, nombre: 'Deportivo',    color: 'green'   },
  { id: 4, nombre: 'Institucional',color: 'orange'  },
  { id: 5, nombre: 'Tecnología',   color: 'cyan'    },
];

const HERO_INICIAL: HeroEventos = {
  etiqueta:    'Calendario Institucional',
  titulo:      'Eventos y Actividades',
  subtitulo:   'Mantente al día con todo lo que ocurre en nuestra institución',
  imagenFondo: '',
};

const EVENTOS_INICIALES: Evento[] = [
  {
    id: 1, slug: 'feria-de-ciencias-2026',
    titulo: 'Feria de Ciencias 2026',
    descripcionCorta: 'Exposición anual de proyectos científicos de los estudiantes.',
    descripcionCompleta: 'La Feria de Ciencias es el evento más esperado del año académico. Los estudiantes presentan sus proyectos de investigación ante jurados especializados y la comunidad educativa.',
    categoria: 'Académico', categoriaColor: 'blue',
    fecha: '2026-04-15', horaInicio: '08:00', horaFin: '17:00',
    ubicacion: 'Auditorio Principal', direccion: 'Av. Principal s/n',
    imagenPrincipal: '', galeria: [],
    agenda: [
      { id: 1, hora: '08:00', titulo: 'Apertura e inscripción', descripcion: 'Registro de participantes' },
      { id: 2, hora: '09:00', titulo: 'Presentación de proyectos', descripcion: 'Ronda de exposiciones' },
      { id: 3, hora: '15:00', titulo: 'Premiación', descripcion: 'Entrega de reconocimientos' },
    ],
    registro: { habilitado: true, labelBoton: 'Registrarse', url: '' },
    publicado: true, destacado: true,
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: 2, slug: 'olimpiadas-deportivas',
    titulo: 'Olimpiadas Deportivas',
    descripcionCorta: 'Competencias deportivas inter-cursos en múltiples disciplinas.',
    descripcionCompleta: 'Las Olimpiadas Deportivas reúnen a todos los cursos en competencias de fútbol, básquet, atletismo y más.',
    categoria: 'Deportivo', categoriaColor: 'green',
    fecha: '2026-05-20', horaInicio: '07:00', horaFin: '18:00',
    ubicacion: 'Canchas Deportivas', direccion: '',
    imagenPrincipal: '', galeria: [],
    agenda: [],
    registro: { habilitado: false, labelBoton: 'Inscribirse', url: '' },
    publicado: true, destacado: false,
    fechaCreacion: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class EventoService {

  private eventosSubject    = new BehaviorSubject<Evento[]>(this.cargarEventos());
  private categoriasSubject = new BehaviorSubject<CategoriaEvento[]>(this.cargarCategorias());
  private heroSubject       = new BehaviorSubject<HeroEventos>(this.cargarHero());

  eventos$    = this.eventosSubject.asObservable();
  categorias$ = this.categoriasSubject.asObservable();
  hero$       = this.heroSubject.asObservable();

  // ─── Carga ──────────────────────────────────────────────────────────────────

  private cargarEventos(): Evento[] {
    const raw = localStorage.getItem(KEY_EVENTOS);
    return raw ? JSON.parse(raw) : EVENTOS_INICIALES;
  }

  private cargarCategorias(): CategoriaEvento[] {
    const raw = localStorage.getItem(KEY_CATEGORIAS);
    return raw ? JSON.parse(raw) : CATEGORIAS_INICIALES;
  }

  private cargarHero(): HeroEventos {
    const raw = localStorage.getItem(KEY_HERO);
    return raw ? JSON.parse(raw) : HERO_INICIAL;
  }

  // ─── Persistencia ───────────────────────────────────────────────────────────

  private guardarEventos(lista: Evento[]): void {
    localStorage.setItem(KEY_EVENTOS, JSON.stringify(lista));
    this.eventosSubject.next(lista);
  }

  private guardarCategorias(lista: CategoriaEvento[]): void {
    localStorage.setItem(KEY_CATEGORIAS, JSON.stringify(lista));
    this.categoriasSubject.next(lista);
  }

  // ─── Consultas ──────────────────────────────────────────────────────────────

  getAll(): Evento[] { return this.eventosSubject.value; }

  getById(id: number | string): Evento | undefined {
    const found = this.eventosSubject.value.find(e => e.id == id);
    return found ? JSON.parse(JSON.stringify(found)) : undefined;
  }

  getBySlug(slug: string): Evento | undefined {
    const found = this.eventosSubject.value.find(e => e.slug === slug);
    return found ? JSON.parse(JSON.stringify(found)) : undefined;
  }

  getDestacado(): Evento | undefined {
    return this.eventosSubject.value.find(e => e.destacado && e.publicado);
  }

  /** Filtra eventos publicados con búsqueda, categoría, mes y año. */
  filtrar(params: { q?: string; categoria?: string; mes?: number; anio?: number; pagina?: number; porPagina?: number }): { items: Evento[]; total: number } {
    let lista = this.eventosSubject.value.filter(e => e.publicado);

    if (params.q) {
      const q = params.q.toLowerCase();
      lista = lista.filter(e => e.titulo.toLowerCase().includes(q) || e.descripcionCorta.toLowerCase().includes(q));
    }
    if (params.categoria) lista = lista.filter(e => e.categoria === params.categoria);
    if (params.mes)  lista = lista.filter(e => new Date(e.fecha).getMonth() + 1 === params.mes);
    if (params.anio) lista = lista.filter(e => new Date(e.fecha).getFullYear() === params.anio);

    lista.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const total     = lista.length;
    const porPagina = params.porPagina ?? 6;
    const pagina    = params.pagina    ?? 1;
    const items     = lista.slice((pagina - 1) * porPagina, pagina * porPagina);
    return { items, total };
  }

  // ─── Mutaciones ─────────────────────────────────────────────────────────────

  agregar(datos: Omit<Evento, 'id' | 'fechaCreacion'>): Evento {
    const nuevo: Evento = { ...datos, id: Date.now(), fechaCreacion: new Date().toISOString() };
    this.guardarEventos([...this.getAll(), nuevo]);
    return nuevo;
  }

  actualizar(evento: Evento): void {
    this.guardarEventos(this.getAll().map(e => e.id === evento.id ? evento : e));
  }

  eliminar(id: number): void {
    this.guardarEventos(this.getAll().filter(e => e.id !== id));
  }

  /** Marca un evento como destacado y quita el destacado de los demás. */
  setDestacado(id: number): void {
    this.guardarEventos(this.getAll().map(e => ({ ...e, destacado: e.id === id })));
  }

  togglePublicado(id: number): void {
    this.guardarEventos(this.getAll().map(e => e.id === id ? { ...e, publicado: !e.publicado } : e));
  }

  // ─── Categorías ─────────────────────────────────────────────────────────────

  getCategorias(): CategoriaEvento[] { return this.categoriasSubject.value; }

  agregarCategoria(datos: Omit<CategoriaEvento, 'id'>): void {
    const lista = [...this.getCategorias(), { ...datos, id: Date.now() }];
    this.guardarCategorias(lista);
  }

  actualizarCategoria(cat: CategoriaEvento): void {
    this.guardarCategorias(this.getCategorias().map(c => c.id === cat.id ? cat : c));
  }

  eliminarCategoria(id: number): void {
    this.guardarCategorias(this.getCategorias().filter(c => c.id !== id));
  }

  // ─── Hero ───────────────────────────────────────────────────────────────────

  getHero(): HeroEventos { return this.heroSubject.value; }

  actualizarHero(hero: HeroEventos): void {
    localStorage.setItem(KEY_HERO, JSON.stringify(hero));
    this.heroSubject.next(hero);
  }

  // ─── Utilidades ─────────────────────────────────────────────────────────────

  generarSlug(titulo: string): string {
    return titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  }
}
