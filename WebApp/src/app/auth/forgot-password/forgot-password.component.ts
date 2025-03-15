import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { UserForgotPassword } from '../../shared/interfaces/user-forgot-password.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FloatLabel,
    PasswordModule,
  ],
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  protected formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      nIF: ['', Validators.required],
    });
  }

  login() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.markAsDirty();
      return;
    }

    const userLogin: UserForgotPassword = {
      ...this.formGroup.value,
    };

    if (this.formGroup.valid) {
      this.authService.forgotPassword(userLogin).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Check your email',
            life: 3000,
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Failed!',
            detail: error.error.errors,
            life: 3000,
          });
        },
      });
    }
  }

  get email() {
    return this.formGroup.get('email');
  }

  get nIF() {
    return this.formGroup.get('nIF');
  }
}
