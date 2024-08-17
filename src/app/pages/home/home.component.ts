import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],  // Ensure CommonModule is imported
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Correct the styleUrls property name
})
export class HomeComponent {
  backgroundImage: string = 'url("EmployeeCoB7.png")';
  authService = inject(AuthService);

  ngOnInit() {
    console.log(this.backgroundImage); // Log to check the value
  }
}
