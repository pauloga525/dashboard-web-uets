import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoridadesService, Autoridad } from '../../services/autoridades.service';

@Component({
  selector: 'app-autoridades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './autoridades.html',
})
export class Autoridades implements OnInit {

  lista: Autoridad[] = [];
  seleccionada: Autoridad | null = null;
  guardado = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private svc: AutoridadesService) {}

  ngOnInit(): void { this.lista = this.svc.getAll(); }

  seleccionar(a: Autoridad): void {
    // Guarda cambios pendientes antes de cambiar
    if (this.seleccionada) this.svc.guardar(this.seleccionada);
    this.seleccionada = { ...a };
    this.guardado = false;
  }

  onChange(): void { this.guardado = false; }

  guardar(): void {
    if (!this.seleccionada) return;
    this.svc.guardar(this.seleccionada);
    // Actualiza la lista local
    const idx = this.lista.findIndex(a => a.id === this.seleccionada!.id);
    if (idx !== -1) this.lista[idx] = { ...this.seleccionada };
    this.guardado = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.guardado = false, 3000);
  }
}
