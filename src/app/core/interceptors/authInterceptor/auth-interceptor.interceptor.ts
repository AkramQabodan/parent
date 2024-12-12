import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStore } from '../../../auth/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url === '/login') {
    return next(req);
  }
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toaster = inject(ToastrService);
  const token = authStore.token();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authStore.logout();
          router.navigate(['/login']);
          toaster.error(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
