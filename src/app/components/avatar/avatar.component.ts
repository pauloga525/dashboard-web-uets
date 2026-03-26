/**
 * @file avatar.component.ts
 * @description Componente reutilizable que renderiza el avatar del usuario
 * a partir de su id. Usado en header, sidebar y configuración.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';

// Catálogo centralizado de avatares (mismo que en configuracion.ts)
export const AVATARES = [
  { id: 'profe-1',  bg: 'bg-blue-600',   svg: `<circle cx="32" cy="22" r="12" fill="white" opacity=".9"/><path d="M10 58c0-12 10-20 22-20s22 8 22 20" fill="white" opacity=".9"/><rect x="24" y="4" width="16" height="6" rx="2" fill="white" opacity=".6"/>` },
  { id: 'profe-2',  bg: 'bg-indigo-600', svg: `<circle cx="32" cy="22" r="11" fill="white" opacity=".9"/><path d="M12 58c0-11 9-19 20-19s20 8 20 19" fill="white" opacity=".9"/><path d="M20 10 L32 4 L44 10 L44 18 L20 18 Z" fill="white" opacity=".6"/>` },
  { id: 'profe-3',  bg: 'bg-violet-600', svg: `<circle cx="32" cy="21" r="11" fill="white" opacity=".9"/><path d="M11 58c0-11 9-20 21-20s21 9 21 20" fill="white" opacity=".9"/><rect x="22" y="36" width="20" height="14" rx="2" fill="white" opacity=".5"/><line x1="26" y1="40" x2="38" y2="40" stroke="white" stroke-width="2"/><line x1="26" y1="44" x2="34" y2="44" stroke="white" stroke-width="2"/>` },
  { id: 'profe-4',  bg: 'bg-sky-600',    svg: `<circle cx="32" cy="20" r="11" fill="white" opacity=".9"/><path d="M10 58c0-12 10-20 22-20s22 8 22 20" fill="white" opacity=".9"/><path d="M26 36 L38 36 L42 48 L22 48 Z" fill="white" opacity=".5"/><circle cx="32" cy="42" r="3" fill="white" opacity=".8"/>` },
  { id: 'cool-1',   bg: 'bg-slate-800',  svg: `<circle cx="32" cy="24" r="13" fill="white" opacity=".15"/><rect x="14" y="20" width="36" height="8" rx="4" fill="white" opacity=".8"/><circle cx="24" cy="24" r="3" fill="#1b1be4"/><circle cx="40" cy="24" r="3" fill="#1b1be4"/><path d="M14 32 Q32 58 50 32" fill="white" opacity=".6"/>` },
  { id: 'cool-2',   bg: 'bg-slate-700',  svg: `<circle cx="32" cy="28" r="16" fill="white" opacity=".2" stroke="white" stroke-width="2"/><circle cx="32" cy="26" r="10" fill="white" opacity=".85"/><circle cx="28" cy="24" r="2" fill="#334155"/><circle cx="36" cy="24" r="2" fill="#334155"/><path d="M27 30 Q32 34 37 30" fill="none" stroke="#334155" stroke-width="1.5"/><rect x="20" y="40" width="24" height="16" rx="4" fill="white" opacity=".5"/>` },
  { id: 'cool-3',   bg: 'bg-green-900',  svg: `<circle cx="32" cy="22" r="11" fill="#4ade80" opacity=".7"/><path d="M12 58c0-11 9-19 20-19s20 8 20 19" fill="#4ade80" opacity=".5"/><text x="20" y="26" font-size="10" fill="#052e16" font-family="monospace" font-weight="bold">&lt;/&gt;</text><rect x="14" y="36" width="36" height="18" rx="3" fill="#4ade80" opacity=".3"/><text x="18" y="49" font-size="7" fill="#4ade80" font-family="monospace">01101</text>` },
  { id: 'cool-4',   bg: 'bg-pink-600',   svg: `<circle cx="32" cy="22" r="11" fill="white" opacity=".9"/><path d="M12 58c0-11 9-19 20-19s20 8 20 19" fill="white" opacity=".9"/><circle cx="20" cy="44" r="5" fill="white" opacity=".7"/><circle cx="32" cy="40" r="5" fill="white" opacity=".7"/><circle cx="44" cy="44" r="5" fill="white" opacity=".7"/>` },
  { id: 'fun-1',    bg: 'bg-cyan-600',   svg: `<rect x="18" y="14" width="28" height="24" rx="4" fill="white" opacity=".9"/><circle cx="26" cy="24" r="4" fill="#0e7490"/><circle cx="38" cy="24" r="4" fill="#0e7490"/><circle cx="26" cy="24" r="2" fill="white"/><circle cx="38" cy="24" r="2" fill="white"/><rect x="24" y="32" width="16" height="4" rx="2" fill="#0e7490" opacity=".6"/><rect x="28" y="8" width="8" height="8" rx="1" fill="white" opacity=".7"/><circle cx="32" cy="8" r="2" fill="#0e7490"/><rect x="14" y="38" width="36" height="18" rx="4" fill="white" opacity=".7"/>` },
  { id: 'fun-2',    bg: 'bg-lime-600',   svg: `<ellipse cx="32" cy="24" rx="14" ry="16" fill="white" opacity=".9"/><ellipse cx="25" cy="20" rx="5" ry="7" fill="#365314" opacity=".8"/><ellipse cx="39" cy="20" rx="5" ry="7" fill="#365314" opacity=".8"/><ellipse cx="25" cy="20" rx="3" ry="5" fill="white"/><ellipse cx="39" cy="20" rx="3" ry="5" fill="white"/><circle cx="25" cy="21" r="2" fill="#1a2e05"/><circle cx="39" cy="21" r="2" fill="#1a2e05"/><path d="M24 34 Q32 40 40 34" fill="none" stroke="white" stroke-width="2"/><line x1="18" y1="16" x2="10" y2="8" stroke="white" stroke-width="2"/><line x1="46" y1="16" x2="54" y2="8" stroke="white" stroke-width="2"/>` },
  { id: 'fun-3',    bg: 'bg-amber-700',  svg: `<circle cx="32" cy="26" r="12" fill="white" opacity=".9"/><path d="M12 58c0-11 9-18 20-18s20 7 20 18" fill="white" opacity=".9"/><path d="M20 18 Q32 8 44 18 L44 22 Q32 14 20 22 Z" fill="#78350f"/><circle cx="27" cy="26" r="2.5" fill="#1c1917"/><circle cx="37" cy="26" r="2.5" fill="#1c1917"/><rect x="34" y="23" width="8" height="6" rx="1" fill="#78350f" opacity=".7"/><path d="M26 32 Q32 37 38 32" fill="none" stroke="#1c1917" stroke-width="1.5"/>` },
  { id: 'fun-4',    bg: 'bg-purple-700', svg: `<circle cx="32" cy="26" r="11" fill="white" opacity=".9"/><path d="M12 58c0-11 9-18 20-18s20 7 20 18" fill="white" opacity=".9"/><path d="M20 22 L32 4 L44 22 Z" fill="white" opacity=".8"/><circle cx="32" cy="6" r="3" fill="#fbbf24"/><circle cx="27" cy="25" r="2" fill="#581c87"/><circle cx="37" cy="25" r="2" fill="#581c87"/><path d="M27 31 Q32 36 37 31" fill="none" stroke="#581c87" stroke-width="1.5"/>` },
  { id: 'silly-1',  bg: 'bg-amber-800',  svg: `<rect x="18" y="20" width="28" height="28" rx="14" fill="white" opacity=".9"/><circle cx="26" cy="30" r="3" fill="#78350f"/><circle cx="38" cy="30" r="3" fill="#78350f"/><path d="M24 38 Q32 46 40 38" fill="none" stroke="#78350f" stroke-width="2"/><path d="M28 20 Q32 12 36 20" fill="none" stroke="white" stroke-width="3" opacity=".7"/><rect x="44" y="28" width="8" height="12" rx="4" fill="white" opacity=".6"/>` },
  { id: 'silly-2',  bg: 'bg-orange-500', svg: `<circle cx="32" cy="28" r="14" fill="white" opacity=".9"/><path d="M18 20 L14 8 L24 16 Z" fill="white" opacity=".9"/><path d="M46 20 L50 8 L40 16 Z" fill="white" opacity=".9"/><circle cx="26" cy="26" r="3" fill="#7c2d12"/><circle cx="38" cy="26" r="3" fill="#7c2d12"/><ellipse cx="32" cy="31" rx="3" ry="2" fill="#fda4af"/><line x1="20" y1="30" x2="30" y2="31" stroke="#7c2d12" stroke-width="1"/><line x1="44" y1="30" x2="34" y2="31" stroke="#7c2d12" stroke-width="1"/>` },
  { id: 'silly-3',  bg: 'bg-green-600',  svg: `<ellipse cx="32" cy="30" rx="16" ry="14" fill="white" opacity=".9"/><circle cx="26" cy="26" r="3" fill="#14532d"/><circle cx="38" cy="26" r="3" fill="#14532d"/><circle cx="27" cy="25" r="1.5" fill="white"/><circle cx="39" cy="25" r="1.5" fill="white"/><path d="M25 35 L28 38 L32 35 L36 38 L39 35" fill="none" stroke="#14532d" stroke-width="2"/><path d="M32 16 Q36 8 40 12 Q38 16 34 16" fill="white" opacity=".8"/>` },
  { id: 'silly-4',  bg: 'bg-slate-500',  svg: `<path d="M16 56 L16 28 Q16 12 32 12 Q48 12 48 28 L48 56 L42 50 L36 56 L30 50 L24 56 L18 50 Z" fill="white" opacity=".9"/><circle cx="26" cy="30" r="4" fill="#334155"/><circle cx="38" cy="30" r="4" fill="#334155"/><circle cx="27" cy="29" r="2" fill="white"/><circle cx="39" cy="29" r="2" fill="white"/><path d="M26 40 Q32 46 38 40" fill="none" stroke="#334155" stroke-width="2"/>` },
];

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="sizeClass + ' rounded-full flex items-center justify-center overflow-hidden shrink-0 ' + (av ? av.bg : 'bg-primary')">
      @if (av) {
        <svg [attr.viewBox]="'0 0 64 64'" [innerHTML]="safe" class="w-full h-full"></svg>
      } @else {
        <span [class]="textClass + ' font-bold text-white select-none'">{{initials}}</span>
      }
    </div>
  `,
})
export class AvatarComponent implements OnChanges {
  @Input() avatarId = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  av: typeof AVATARES[0] | undefined;
  safe!: SafeHtml;
  initials = '';

  get sizeClass(): string {
    return { xs: 'w-6 h-6', sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-20 h-20' }[this.size];
  }
  get textClass(): string {
    return { xs: 'text-[9px]', sm: 'text-[10px]', md: 'text-xs', lg: 'text-xl', xl: 'text-2xl' }[this.size];
  }

  constructor(private sanitizer: DomSanitizer, private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['avatarId']) {
      this.av = AVATARES.find(a => a.id === this.avatarId);
      this.safe = this.av
        ? this.sanitizer.bypassSecurityTrustHtml(this.av.svg)
        : this.sanitizer.bypassSecurityTrustHtml('');
    }
    this.initials = this.userService.getIniciales();
  }
}
