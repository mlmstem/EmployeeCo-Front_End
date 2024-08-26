import { AuthService } from './../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleService } from './../../services/role.service';
import { Component, inject,  ViewEncapsulation } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleCreateRequest } from '../../interfaces/role-create-requests';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RoleFormComponent, RoleListComponent, MatSelectModule, MatInputModule, AsyncPipe, MatSnackBarModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent {
  RoleService = inject(RoleService);
  AuthService = inject(AuthService);
  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;
  role$ = this.RoleService.getRoles();
  users$ = this.AuthService.getAll();
  selectedUser: string = '';
  selectedRole: string = '';

  snackBar = inject(MatSnackBar);

  createRole(role: RoleCreateRequest) {
    this.RoleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.role$ = this.RoleService.getRoles();
        this.snackBar.open('Role Created Successfully', 'Ok', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = error.error;
        } else {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
          });
        }
      },
    });
  }

  deleteRole(id: string) {
    this.RoleService.delete(id).subscribe({
      next: () => {
        this.role$ = this.RoleService.getRoles();
        this.snackBar.open('Role Deleted Successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  assignRole() {
    this.RoleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next: () => {
        this.role$ = this.RoleService.getRoles();
        this.snackBar.open('Role Assigned Successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}


