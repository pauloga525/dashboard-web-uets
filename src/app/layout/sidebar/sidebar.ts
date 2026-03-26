import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService, UserProfile } from '../../services/user.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, AvatarComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {
  collapsed = false;
  profile!: UserProfile;
  private sub = new Subscription();

  // Tooltip flotante
  tooltipText    = '';
  tooltipY       = 0;
  tooltipVisible = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.sub.add(this.userService.profile$.subscribe(p => this.profile = p));
  }
  ngOnDestroy(): void { this.sub.unsubscribe(); }

  toggleSidebar(): void { this.collapsed = !this.collapsed; this.tooltipVisible = false; }

  showTooltip(event: MouseEvent, label: string): void {
    if (!this.collapsed) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tooltipText    = label;
    this.tooltipY       = rect.top + rect.height / 2;
    this.tooltipVisible = true;
  }

  hideTooltip(): void { this.tooltipVisible = false; }
}
