import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const profileGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated() ||
  inject(Router).createUrlTree([''], {
    queryParams: { redirect: '/profile', login: true },
  });
