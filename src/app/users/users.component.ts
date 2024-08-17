import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from '../components/add-employee-dialog/add-employee-dialog.component';
import { EditUserDialogComponent } from '../components/edit-user-dialog/edit-user-dialog.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, AsyncPipe, FormsModule, MatDialogModule, MatInputModule,
    ReactiveFormsModule, MatOptionModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  dialog = inject(MatDialog);
  user$ = this.authService.getAll();
  role$ = this.roleService.getRoles();

  filteredUser$!: Observable<any[]>; // Store filtered users
  searchQuery: string = '';
  selectedRole: string = '';

  constructor() {
    // Initialize filteredUser$ with all users
    this.filteredUser$ = this.user$;
  }

  ngOnInit() {
    // Filter users whenever searchQuery or selectedRole changes
    this.filteredUser$ = this.user$.pipe(
      map(users => this.applyFilter(users))
    );
  }

  applyFilter(users: any[]): any[] {
    return users.filter(user => {
      const matchesQuery =
        !this.searchQuery ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesRole =
        !this.selectedRole || user.roles.includes(this.selectedRole);

      return matchesQuery && matchesRole;
    });
  }

  onSearchQueryChange(event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement) {
      this.searchQuery = inputElement.value;
      this.updateFilteredUsers();
    }
  }

  onRoleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      this.selectedRole = selectElement.value;
      this.updateFilteredUsers();
    }
  }

  updateFilteredUsers() {
    this.filteredUser$ = this.user$.pipe(map(users => this.applyFilter(users)));
  }

  trackById(index: number, item: any): string {
    return item.id;
  }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '600px', // Set the width of the dialog
      data: { roles$: this.role$ } // Pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // You may refresh the list or take some other action
    });
  }

  openEditUserDialog(user: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '600px', // Set the width of the dialog
      data: { user, roles$: this.role$ }, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // You may refresh the list or take some other action
    });
  }
}




