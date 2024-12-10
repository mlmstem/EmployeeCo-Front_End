import { Component, EventEmitter, Output, Input, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isCollapsed = false; // Collapsed state
  @Output() toggleSidebar = new EventEmitter<void>(); // Event emitter for collapse toggle

  sidebarHeight = window.innerHeight; // Track sidebar height dynamically

  // Inject services
  router = inject(Router);
  authService = inject(AuthService);

  // Determine if the user is logged in
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Determine if the user is an admin
  get isAdmin(): boolean {
    return this.authService.getRoles()?.includes('admin') ?? false;
  }

  // Emit the toggle event for collapsing the sidebar
  toggleSidebarEvent(): void {
    this.isCollapsed = !this.isCollapsed; // Toggle collapse state
    this.toggleSidebar.emit(); // Emit the toggle event
  }

  // Update sidebar height dynamically on window resize
  private updateSidebarHeight(): void {
    this.sidebarHeight = window.innerHeight;
  }

  // Listen for window resize events and update the sidebar state and height
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isCollapsed = window.innerWidth <= 768; // Auto-collapse for smaller screens
    this.updateSidebarHeight();
  }
}



