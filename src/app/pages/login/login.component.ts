import { AuthService } from './../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'
import { Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  AuthService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);

  hide: boolean = true;
  form !: FormGroup;
  fb = inject(FormBuilder);

  login(){
    this.AuthService.login(this.form.value).subscribe({
      next : (response) =>{
        this.matSnackBar.open(response.message, 'Close',{
          duration : 5000,
          horizontalPosition : 'center'
        })
        this.router.navigate(['/'])
      },
      error : (error)=>{
        this.matSnackBar.open(error.error.message, 'Close',{
          duration : 5000,
          horizontalPosition : 'center'
        })
      }
    }
    )

  }

  ngOnInit(): void {
    this.form= this.fb.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required],

    })
  }


}
