import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // Assuming you're using date-fns as the adapter

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    NavbarComponent,
    SidebarComponent,
    MatIconModule, // Add CalendarModule with forRoot
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fix typo: `styleUrl` should be `styleUrls`
})
export class AppComponent {
  title = 'client';
  authService = inject(AuthService);
  isSidebarCollapsed = false;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
