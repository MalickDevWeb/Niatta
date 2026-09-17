import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        // Si l'URL de la requête contient field-agent, on redirige vers le login homme-terrain
        if (request.url.includes('field-agent')) {
          router.navigate(['/homme-terrain/login']);
        } else {
          // Sinon vers un login public (s'il existe)
          router.navigate(['/']);
        }
      }
      return throwError(() => error);
    })
  );
};
