import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStore } from '../../auth/auth.store';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authStore = inject(AuthStore);
  readonly loading = this.authStore.loading;
  readonly errorMessage = this.authStore.errorMessage;
  imagePath = 'assets/images/modern-office-room-with-white-walls-1024x683.webp';

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.authStore.login(username, password);
  }

  get emailError() {
    const control = this.loginForm.get('username');
    return control?.invalid && (control.dirty || control.touched);
  }

  get passwordError() {
    const control = this.loginForm.get('password');
    return control?.invalid && (control.dirty || control.touched);
  }
}
