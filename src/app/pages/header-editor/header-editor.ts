import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteHeaderService, SiteHeaderConfig, NavLink } from '../../services/site-header.service';

@Component({
  selector: 'app-header-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-editor.html',
})
export class HeaderEditor implements OnInit {

  config!: SiteHeaderConfig;
  guardado = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private svc: SiteHeaderService) {}

  ngOnInit(): void { this.config = this.svc.getCopia(); }

  onChange(): void { this.guardado = false; }

  guardar(): void {
    this.svc.guardar(this.config);
    this.guardado = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.guardado = false, 3000);
  }

  trackById(_i: number, item: { id: number }): number { return item.id; }

  agregarLink(): void {
    this.config.navLinks.push({ id: this.svc.nextId(), label: '', url: '' });
    this.onChange();
  }
  eliminarLink(id: number): void {
    this.config.navLinks = this.config.navLinks.filter(l => l.id !== id);
    this.onChange();
  }
}
