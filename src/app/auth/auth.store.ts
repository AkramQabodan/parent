import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../core/services/local-storage.service';

interface AuthState {
  loading: boolean;
  errorMessage: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({
    loading: false,
    errorMessage: null,
    token: null,
    isAuthenticated: false,
  }),
  withMethods((store) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const toaster = inject(ToastrService);
    const localStorageService = inject(LocalStorageService);

    // Initialize token from localStorage
    const initialToken = localStorageService.getItem('auth_token');

    // Update initial state if token exists
    if (initialToken) {
      patchState(store, {
        token: initialToken,
        isAuthenticated: true,
      });
    }

    return {
      login(username: string, password: string) {
        if (!username || !password) {
          patchState(store, {
            errorMessage: 'Username and password are required.',
          });
          return;
        }

        patchState(store, { loading: true, errorMessage: null });

        http
          .post<{ token: string }>('/login', { username, password })
          .subscribe({
            next: (response) => {
              localStorageService.setItem('auth_token', response.token);

              patchState(store, {
                loading: false,
                token: response.token,
                isAuthenticated: true,
              });

              router.navigate(['/users']);
            },
            error: (error) => {
              patchState(store, {
                loading: false,
                errorMessage:
                  error.error?.error || 'An error occurred. Please try again.',
                token: null,
                isAuthenticated: false,
              });

              toaster.error(
                error.error?.error || 'An error occurred. Please try again.'
              );
            },
          });
      },

      logout() {
        localStorageService.removeItem('auth_token');

        patchState(store, {
          token: null,
          isAuthenticated: false,
        });

        router.navigate(['/login']);
      },
    };
  })
);
