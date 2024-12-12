import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';

interface AuthState {
  loading: boolean;
  errorMessage: string | null;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({
    loading: false,
    errorMessage: null,
  }),
  withMethods((store) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const toaster = inject(ToastrService);

    return {
      login(username: string, password: string) {
        if (!username || !password) {
          patchState(store, {
            errorMessage: 'Username and password are required.',
          });
          return;
        }

        patchState(store, { loading: true, errorMessage: null });

        http.post('/login', { username, password }).subscribe({
          next(_value) {
            patchState(store, { loading: false });
            router.navigate(['/users']);
          },
          error(error) {
            patchState(store, {
              loading: false,
              errorMessage:
                error.error?.error || 'An error occurred. Please try again.',
            });
            toaster.error(
              error.error?.error || 'An error occurred. Please try again.'
            );
          },
        });
      },
    };
  })
);
