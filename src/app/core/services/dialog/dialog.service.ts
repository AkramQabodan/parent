import { isPlatformBrowser } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  PLATFORM_ID,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogComponentRef: ComponentRef<DialogComponent> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Open a dialog with any component
   * @param vcr ViewContainerRef to create the dialog in
   * @param component The component to display in the dialog
   * @param data Optional data to pass to the component
   */
  open<T extends object>(
    vcr: ViewContainerRef,
    component: Type<T>,
    data?: Partial<T>
  ) {
    // Ensure we're in a browser environment
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Dialog cannot be opened in non-browser environment');
      return null;
    }

    // Close any existing dialog
    this.close();

    // Create the dialog component
    this.dialogComponentRef = vcr.createComponent(DialogComponent);

    // Create the content component inside the dialog
    const contentComponentRef =
      this.dialogComponentRef.instance.contentContainer.createComponent(
        component
      );

    // Pass data to the content component if provided
    if (data) {
      // Type-safe way to assign properties
      Object.keys(data).forEach((key) => {
        (contentComponentRef.instance as any)[key] = (data as any)[key];
      });
    }

    return contentComponentRef.instance;
  }

  /**
   * Close the currently open dialog
   */
  close() {
    if (this.dialogComponentRef) {
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}
