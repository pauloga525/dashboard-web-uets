import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SiteFooterService, SiteFooterConfig,
  FooterColumna, FooterEnlace, RedSocial,
} from '../../services/site-footer.service';

const ICONOS_REDES = ['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'linkedin'] as const;

@Component({
  selector: 'app-footer-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-editor.html',
})
export class FooterEditor implements OnInit {

  config!: SiteFooterConfig;
  guardado = false;
  iconosRedes = ICONOS_REDES;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private svc: SiteFooterService) {}

  ngOnInit(): void { this.config = this.svc.getCopia(); }

  onChange(): void { this.guardado = false; }

  guardar(): void {
    this.svc.guardar(this.config);
    this.guardado = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.guardado = false, 3000);
  }

  trackById(_i: number, item: { id: number }): number { return item.id; }

  // ── Redes sociales ─────────────────────────────────────────────────────────
  agregarRed(): void {
    this.config.redes.push({ id: this.svc.nextId(), nombre: '', url: '', icono: 'facebook' });
    this.onChange();
  }
  eliminarRed(id: number): void {
    this.config.redes = this.config.redes.filter(r => r.id !== id);
    this.onChange();
  }

  // ── Columnas ───────────────────────────────────────────────────────────────
  agregarColumna(): void {
    this.config.columnas.push({ id: this.svc.nextId(), titulo: '', enlaces: [] });
    this.onChange();
  }
  eliminarColumna(id: number): void {
    this.config.columnas = this.config.columnas.filter(c => c.id !== id);
    this.onChange();
  }
  agregarEnlace(col: FooterColumna): void {
    col.enlaces.push({ id: this.svc.nextId(), label: '', url: '' });
    this.onChange();
  }
  eliminarEnlace(col: FooterColumna, id: number): void {
    col.enlaces = col.enlaces.filter(e => e.id !== id);
    this.onChange();
  }
}
