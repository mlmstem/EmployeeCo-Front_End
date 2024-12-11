import { AuthService } from './../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleService } from './../../services/role.service';
import { Component, inject,  OnInit,  ViewEncapsulation } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleCreateRequest } from '../../interfaces/role-create-requests';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Role } from '../../interfaces/role';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-role',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RoleFormComponent, RoleListComponent, MatSelectModule, MatInputModule, AsyncPipe, MatSnackBarModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})

export class RoleComponent implements OnInit {
  RoleService = inject(RoleService);
  AuthService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;

  // Observables for roles and users
  role$!: Observable<Role[]>;
  users$ = this.AuthService.getAll();

  // Selected role and user
  selectedUser: string = '';
  selectedRole: string = '';

  ngOnInit(): void {
    // Fetch roles and subscribe to updates
    this.role$ = this.RoleService.getRoles();
    this.RoleService.fetchRoles(); // Ensure roles are fetched on initialization
  }

  createRole(role: RoleCreateRequest) {
    this.RoleService.createRole(role).subscribe({
      next: () => {
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

