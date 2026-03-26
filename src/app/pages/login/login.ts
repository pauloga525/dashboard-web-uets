/**
 * @file login.ts
 * @description Página de inicio de sesión del panel administrativo.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  usuario  = '';
  password = '';
  error    = false;
  cargando = false;
  mostrarPassword = false;
  currentYear = new Date().getFullYear();
  sesionExpirada = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sesionExpirada = this.route.snapshot.queryParamMap.get('expired') === '1';
  }

  submit(): void {
    if (!this.usuario || !this.password) return;
    this.error    = false;
    this.cargando = true;

    setTimeout(() => {
      const ok = this.auth.login(this.usuario.trim(), this.password);
      if (ok) {
        this.router.navigate(['/']);
      } else {
        this.error    = true;
        this.cargando = false;
      }
    }, 600);
  }
}
