import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserStore } from '../../store/users.store';
import { UsersComponent } from '../../users.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  userStore = inject(UserStore);
  formBuilder = inject(NonNullableFormBuilder);
  form = this.formBuilder.group({
    name: ['', Validators.required],
    job: ['', Validators.required],
  });
  fetchedAvatar = signal<string | undefined>(undefined);

  constructor(private dialogRef: DialogRef<UsersComponent>) {}

  ngOnInit(): void {
    const id = this.dialogRef.config.data?.id;
    if (id) {
      this.userStore.fetchSingleUser(id).subscribe(() => {
        const value = {
          name: this.userStore.selectedUser()?.first_name,
          // the api doesn't give job property
          job: this.userStore.selectedUser()?.last_name,
        };
        this.form.patchValue(value);
        this.fetchedAvatar.set(this.userStore.selectedUser()?.avatar);
      });
    }
  }

  onSubmit() {
    const id = this.dialogRef.config.data?.id;
    if (this.form.invalid) {
      return;
    }
    const { name, job } = this.form.getRawValue();
    if (id) {
      this.userStore
        .updateUser(id, {
          job,
          name,
        })
        .subscribe(() => {
          this.close();
        });
    } else {
      this.userStore
        .createUser({
          name,
          job,
        })
        .subscribe(() => {
          this.close();
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
