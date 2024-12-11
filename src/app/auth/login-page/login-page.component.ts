import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginPageComponent {
  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  imagePath = 'assets/images/modern-office-room-with-white-walls-1024x683.webp';

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loading = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const payload = this.loginForm.value;

    this.http
      .post('/login', payload)
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.errorMessage =
            error.error.error || 'An error occurred. Please try again.';
          return of(null);
        })
      )
      .subscribe((response) => {
        this.loading = false;
        if (response) {
          this.router.navigate(['/users']);
        }
      });
  }

  get emailError() {
    return (
      this.loginForm.get('username')?.invalid &&
      (this.loginForm.get('username')?.dirty ||
        this.loginForm.get('username')?.touched)
    );
  }
  get passwordError() {
    return (
      this.loginForm.get('password')?.invalid &&
      (this.loginForm.get('password')?.dirty ||
        this.loginForm.get('password')?.touched)
    );
  }
}
