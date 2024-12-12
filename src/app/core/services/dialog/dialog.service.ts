import { Dialog } from '@angular/cdk/dialog'; // CDK Approach
import { Injectable, TemplateRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CdkDialogService {
  constructor(private dialog: Dialog) {}

  // CDK Dialog implementation (previous example)
  open<T>(component: Type<T>, config?: any) {
    return this.dialog.open(component, config);
  }
}

@Injectable({
  providedIn: 'root',
})
export class NativeDialogService {
  private dialogElement: HTMLDialogElement | null = null;

  /**
   * Open a dialog using native HTML dialog element
   * @param content HTML content or component template
   */
  open(content: string | TemplateRef<any>) {
    // Create dialog if it doesn't exist
    if (!this.dialogElement) {
      this.dialogElement = document.createElement('dialog');
      document.body.appendChild(this.dialogElement);
    }

    // Set content
    if (typeof content === 'string') {
      this.dialogElement.innerHTML = content;
    } else {
      // For Angular templates, you'd need additional rendering logic
      // This is a simplified example
    }

    // Show the dialog
    this.dialogElement.showModal();
  }

  /**
   * Close the dialog
   */
  close() {
    this.dialogElement?.close();
  }
}
