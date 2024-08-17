import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService  = inject(AuthService);
  accountDetail$ = this.authService.getDetail();



}
