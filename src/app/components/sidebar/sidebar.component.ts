import { Component, EventEmitter, Output, Input, inject, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  router = inject(Router);
  authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.getRoles()?.includes('admin') ?? false;
  }

  toggleSidebarEvent(): void {
    this.toggleSidebar.emit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isCollapsed = window.innerWidth <= 768;
  }
}


