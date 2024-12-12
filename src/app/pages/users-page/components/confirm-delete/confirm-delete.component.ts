import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { UsersComponent } from '../../users.component';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.css',
})
export class ConfirmDeleteComponent {
  constructor(private dialogRef: DialogRef<UsersComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.config.data.confirm();
    this.close();
  }
}
