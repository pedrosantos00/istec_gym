import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { JWTTokenService } from '../../services/jwt-token/jwt-token.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

export const AuthGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(JWTTokenService).isLoggedIn();
  const messageService = inject(MessageService);

  if (!isLoggedIn) {
    messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Need to be logged in to access this page',
    });
    inject(Router).navigate(['']);
  }

  return isLoggedIn;
};
