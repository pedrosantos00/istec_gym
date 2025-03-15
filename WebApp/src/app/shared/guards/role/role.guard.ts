import { CanActivateFn, Router } from '@angular/router';
import { JWTTokenService } from '../../services/jwt-token/jwt-token.service';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JWTTokenService);
  const messageService = inject(MessageService);

  const userRole = jwtService.getRole();
  const allowedRoles = route.data?.['roles'] as string[];

  if (!allowedRoles || allowedRoles.includes(userRole ?? '')) {
    return true;
  }

  messageService.add({
    severity: 'warn',
    summary: 'Missing Permissions',
    detail: 'You do not have permission to access this page',
    life: 3000,
  });

  inject(Router).navigate(['/dashboard']);

  return false;
};
