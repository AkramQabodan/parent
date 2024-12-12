import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../auth/auth.store';

export const guestGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Check if the user is NOT authenticated
  const isAuthenticated = authStore.isAuthenticated();

  if (!isAuthenticated) {
    return true;
  }

  // Redirect to users page if already authenticated
  return router.createUrlTree(['/users']);
};
