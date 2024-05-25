import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const jwtHelperService = inject(JwtHelperService);

  if (authService.token && jwtHelperService.isTokenExpired(authService.token)) {
    authService.logout();
  }

  return next(req);
};
