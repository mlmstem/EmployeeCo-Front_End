import { UserDetail } from './../../interfaces/user-detail';
import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    MatInputModule, ReactiveFormsModule, MatIconModule,
    MatSelectModule, MatSnackBarModule,CommonModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  roles$!: Observable<Role[]>;
  userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roles$ = data.roles$;
    this.userForm = this.fb.group({
      UserId : data.user.id,
      fullName: [data.user.fullName, Validators.required],
      email: [data.user.email, [Validators.required, Validators.email]],
      phoneNumber: [data.user.phoneNumber],
      roles: [data.user.roles, Validators.required]
    });
  }


  onSave(): void {
    if (this.userForm.valid) {
      this.authService.updateUserDetail(this.userForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close(this.userForm.value);
        },
        error: (error) => {
          console.error(error);
          this.dialogRef.close();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
