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

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    // Suscripción reactiva: se actualiza cada vez que se guarda el perfil
    this.sub.add(
      this.userService.profile$.subscribe(p => this.profile = p)
    );
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  toggleSidebar() { this.collapsed = !this.collapsed; }
}
