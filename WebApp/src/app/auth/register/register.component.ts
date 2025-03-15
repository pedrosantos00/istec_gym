import { CommonModule } from '@angular/common';
import { AfterContentInit, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { PasswordModule } from 'primeng/password';
import { UserRegistration } from '../../shared/interfaces/user-registation.interface';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Role } from '../../shared/enums/role.enum';
import { Gender } from '../../shared/enums/gender.enum';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    SelectModule,
    IftaLabelModule,
    DatePickerModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  formGroup: FormGroup;

  constructor(
    private formBuider: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formGroup = this.formBuider.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      nIF: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      gender: [Gender.Male, Validators.required],
      role: [Role.Member, Validators.required],
      birthDate: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.markAsDirty();
      return;
    }

    const userRegistration: UserRegistration = {
      ...this.formGroup.value,
    };
    userRegistration.gender = this.gender?.value.code;

    this.authService.register(userRegistration).subscribe({
      next: (val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Awesome',
          detail: 'Your account has been successfully created',
          life: 3000,
        });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'There was an issue while creating your account, please try again later',
          life: 3000,
        });
      },
    });
  }

  get firstName() {
    return this.formGroup.get('firstName');
  }

  get lastName() {
    return this.formGroup.get('lastName');
  }

  get email() {
    return this.formGroup.get('email');
  }

  get nIF() {
    return this.formGroup.get('nIF');
  }

  get password() {
    return this.formGroup.get('password');
  }

  get confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }

  get gender() {
    return this.formGroup.get('gender');
  }

  get role() {
    return this.formGroup.get('role');
  }

  get birthDate() {
    return this.formGroup.get('birthDate');
  }

  get height() {
    return this.formGroup.get('height');
  }

  get weight() {
    return this.formGroup.get('weight');
  }
}
