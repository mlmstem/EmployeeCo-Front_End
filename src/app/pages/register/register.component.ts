import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    AsyncPipe,
    CommonModule,
    MatSnackBarModule,
    NgxPayPalModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  MatSnackBar = inject(MatSnackBar);
  roles$!: Observable<Role[]>;
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  companyForm!: FormGroup;
  router = inject(Router);
  confirmPasswordHide = true;
  passwordHide = true;
  errors!: ValidationError[];
  isCompanyFormSubmitted = false;
  companies = ['Sindy Lab', 'Perfect World', 'Deloitte'];
  plans = ['Basic', 'Plus', 'Pro'];

  public payPalConfig?: IPayPalConfig;
  paymentApproved = false;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      company: [''],
      companyName: [''],
      plan: [''],
    }, { validators: this.companyNameOrSelectionValidator });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      fullName: ['', Validators.required],
      roles: [''],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.roles$ = this.roleService.getRoles();
    this.initPaypalConfig();
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private companyNameOrSelectionValidator(control: AbstractControl): ValidationErrors | null {
    const company = control.get('company')?.value;
    const companyName = control.get('companyName')?.value;
    const plan = control.get('plan')?.value;
    if (!company && (!companyName || !plan)) {
      return { companyNameOrSelectionRequired: true };
    }
    return null;
  }

  submitCompanyForm() {
    if (this.companyForm.valid) {
      const companyName = this.companyForm.get('companyName')?.value;
      const plan = this.companyForm.get('plan')?.value;

      if (companyName && plan) {
        console.log("Initiating PayPal payment...");
        // Initiate PayPal payment
        this.initiatePaypalPayment();
      } else if (this.companyForm.get('company')?.value) {
        // If an existing company is selected, proceed to the next form step
        this.isCompanyFormSubmitted = true;
      } else {
        this.MatSnackBar.open('Please select a company or enter a company name and select a plan.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
        });
      }
    } else {
      this.MatSnackBar.open('Please select a company or enter a company name and select a plan.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
      });
    }
  }

  private initPaypalConfig() {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AS4fQNfBmOrpDh4MkQsFRx2Y8vrpatG6sf3IM5gTjcsoSAAhIyL92jIhOS_shR5QE95NjHJuPBqjSg1Q',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.getPlanPrice(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.getPlanPrice()
              }
            }
          },
          items: [{
            name: this.companyForm.get('plan')?.value,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: this.getPlanPrice(),
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
          this.paymentApproved = true;
          this.cdr.detectChanges();
        });
      },
      onClientAuthorization: (data) => {
        console.log('Transaction completed successfully', data);
        this.paymentApproved = true;
        this.isCompanyFormSubmitted = true;
        this.cdr.detectChanges();
      },
      onCancel: (data, actions) => {
        console.log('Transaction cancelled', data, actions);
      },
      onError: err => {
        console.log('Error during transaction', err);
        this.MatSnackBar.open('Payment error. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
        });
      },
      onClick: (data, actions) => {
        console.log('PayPal button clicked', data, actions);
      },
    };
  }

  private initiatePaypalPayment(): void {
    console.log("Initiating PayPal payment...");

    if (this.payPalConfig) {
        // This would show the PayPal button if it was not already shown
        // Ensure the PayPal button is visible and setup
        this.cdr.detectChanges();
    } else {
        this.MatSnackBar.open('PayPal configuration is not defined.', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
        });
    }
  }

  private getPlanPrice(): string {
    const plan = this.companyForm.get('plan')?.value;
    switch (plan) {
      case 'Basic':
        return '6';
      case 'Plus':
        return '19';
      case 'Pro':
        return '39';
      default:
        return '0';
    }
  }

  register() {
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
    }
  }
}






