import { RoleService } from './../../services/role.service';
import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';


@Component({
  selector: 'app-add-employee-dialog',
  standalone: true,
  imports :[MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,AsyncPipe, CommonModule, MatSnackBarModule,],
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css'],


})
export class AddEmployeeDialogComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  MatSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddEmployeeDialogComponent>);
  registerForm: FormGroup;
  passwordHide = true;
  roles$!: Observable<Role[]>;
  errors!: ValidationError[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      roles: [[], Validators.required], 
      password: ['', Validators.required],
    });

    this.roles$ = this.roleService.getRoles();

    console.log(this.roleService.getRoles());
  }

  onSave(): void {
    if (this.registerForm.valid) {

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.MatSnackBar.open(response.message, 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error!.status == 400) {
            console.log(error);
            this.errors = error!.error;
            this.MatSnackBar.open('Validation error', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
            });
          }
        },
        complete: () => {
          console.log("Register Success");
        }
      });
      // Handle form submission
      this.dialogRef.close(this.registerForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

