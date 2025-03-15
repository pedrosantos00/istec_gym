import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AppUsersService } from '../../../shared/services/app-users/app-users.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({});

  constructor(private usersService: AppUsersService, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: [{ value: '', disabled: true }],
      surname: [{ value: '', disabled: true }],
      nif: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      height: [{ value: '', disabled: true }],
      weight: [{ value: '', disabled: true }],
    });
  }

  async ngOnInit(): Promise<void> {
    const user = (await lastValueFrom(this.usersService.getLoggedUser())).data;

    console.log(user)

    if (user) {
      this.formGroup.patchValue({
        name: user.firstName,
        surname: user.lastName,
        nif: user.nif,
        email: user.email,
        height: user.height,
        weight: user.weight,
      });
    }
  }
}
