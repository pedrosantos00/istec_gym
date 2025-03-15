import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserLogin } from '../../shared/interfaces/user-login.interface';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
})
export class LoginComponent {
  protected formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private jwtTokenService : JWTTokenService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.markAsDirty();
      return;
    }

    const userLogin: UserLogin = {
      ...this.formGroup.value,
    };

    if (this.formGroup.valid) {
      this.authService.login(userLogin).subscribe({
        next: (response: any) => {
          this.jwtTokenService.setToken(response.data);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Watch out!',
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

  get password() {
    return this.formGroup.get('password');
  }
}
