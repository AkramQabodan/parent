import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  template: `
    <div class="dialog-overlay">
      <div class="dialog-content">
        <ng-container #content></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .dialog-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
      }
    `,
  ],
})
export class DialogComponent {
  @ViewChild('content', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
}
