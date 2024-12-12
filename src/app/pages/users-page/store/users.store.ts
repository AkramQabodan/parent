import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, tap } from 'rxjs';

// User interface based on the API response
export interface User {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  name?: string;
  job?: string;
}

// Pagination interface
export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// Store state interface
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
    },
  }),
  withMethods((store) => {
    const httpClient = inject(HttpClient);
    const toastr = inject(ToastrService);
    return {
      // Fetch Users with Pagination
      fetchUsers(page: number = 1) {
        // Set loading state
        patchState(store, {
          loading: true,
          error: null,
        });

        // Create HTTP params
        const params = new HttpParams()
          .set('page', page.toString())
          .set('per_page', '10');

        return httpClient
          .get<{
            page: number;
            per_page: number;
            total: number;
            total_pages: number;
            data: User[];
          }>(`/users`, { params })
          .pipe(
            tap((response) => {
              // Append or replace users based on page
              const users =
                page === 1
                  ? response.data
                  : [...store.users(), ...response.data];

              // Update store
              patchState(store, {
                users,
                loading: false,
                pagination: {
                  page: response.page,
                  per_page: response.per_page,
                  total: response.total,
                  total_pages: response.total_pages,
                },
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              toastr.error('Failed to load users');
              return of(null);
            })
          );
      },

      // Get Single User
      fetchSingleUser(id: number) {
        patchState(store, { loading: true, error: null });

        return httpClient.get<{ data: User }>(`/users/${id}`).pipe(
          tap((response) => {
            patchState(store, {
              selectedUser: response.data,
              loading: false,
            });
          }),
          catchError((error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
            toastr.error('Failed to load user details');
            return of(null);
          })
        );
      },

      // Create User
      createUser(userData: { name: string; job: string }) {
        patchState(store, { loading: true, error: null });

        return httpClient.post<User>(`/users`, userData).pipe(
          tap((response) => {
            // Add new user to the beginning of the list
            patchState(store, {
              users: [response, ...store.users()],
              loading: false,
            });
            toastr.success('User created successfully');
          }),
          catchError((error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
            toastr.error('Failed to create user');
            return of(null);
          })
        );
      },

      // Update User
      updateUser(id: number, userData: { name?: string; job?: string }) {
        patchState(store, { loading: true, error: null });

        return httpClient.put<User>(`/users/${id}`, userData).pipe(
          tap((response) => {
            // Update user in the list
            const updatedUsers = store
              .users()
              .map((user) =>
                user.id === id ? { ...user, ...response } : user
              );

            patchState(store, {
              users: updatedUsers,
              loading: false,
              selectedUser: response,
            });
            toastr.success('User updated successfully');
          }),
          catchError((error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
            toastr.error('Failed to update user');
            return of(null);
          })
        );
      },

      // Delete User
      deleteUser(id: number) {
        patchState(store, { loading: true, error: null });

        return httpClient.delete(`/users/${id}`).pipe(
          tap(() => {
            // Remove user from the list
            const filteredUsers = store
              .users()
              .filter((user) => user.id !== id);

            patchState(store, {
              users: filteredUsers,
              loading: false,
            });
            toastr.success('User deleted successfully');
          }),
          catchError((error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
            toastr.error('Failed to delete user');
            return of(null);
          })
        );
      },

      // Reset Store
      resetStore() {
        patchState(store, {
          users: [],
          selectedUser: null,
          loading: false,
          error: null,
          pagination: {
            page: 1,
            per_page: 6,
            total: 0,
            total_pages: 0,
          },
        });
      },
    };
  })
);
