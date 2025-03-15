import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  imports: [CommonModule, ButtonModule, RouterModule],
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  email: string | null = null;
  token: string | null = null;
  confirmationStatus: string = 'Processing...';
  confirmationFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      console.log(this.token);
      this.token = this.token.replace(/ /g, '+');
      console.log(this.token);
    }

    if (this.email && this.token) {
      this.authService.confirmEmail(this.email, this.token).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email confirmed successfully!',
            life: 5000
          });
          this.confirmationStatus = 'Your email has been successfully confirmed!';
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to confirm email. Please try again.',
            life: 5000
          });
          this.confirmationStatus = 'Email confirmation failed.';
          this.confirmationFailed = true;
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Invalid confirmation link.',
        life: 5000
      });
      this.confirmationStatus = 'Invalid confirmation link.';
      this.confirmationFailed = true;
    }
  }

  resendConfirmationEmail() {
    if (this.email) {
      this.authService.resendConfirmationEmail(this.email).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Confirmation email has been sent!',
            life: 5000
          });
          this.confirmationStatus = 'You can close this page and check your email.';
          this.confirmationFailed = false;
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to resend confirmation email.',
            life: 5000
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Invalid email.',
        life: 5000
      });
    }
  }
}
