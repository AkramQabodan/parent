import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard], // Only allow access if not authenticated
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard], // Only allow access if authenticated
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
