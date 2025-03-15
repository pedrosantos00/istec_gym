import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { JWTTokenService } from '../../services/jwt-token/jwt-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JWTTokenService);
  const token = jwtService.getToken();

  const router = inject(Router);
  const messageService = inject(MessageService);
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');

        router.navigate(['/login']);
        messageService.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please log in again.',
          life: 5000,
        });
      }

      return throwError(() => error);
    })
  );
};
