import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the overlay and content container', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check for the dialog overlay
    const overlay = compiled.querySelector('.dialog-overlay');
    expect(overlay).toBeTruthy();

    // Check for the dialog content
    const content = compiled.querySelector('.dialog-content');
    expect(content).toBeTruthy();
  });

  it('should initialize contentContainer', () => {
    expect(component.contentContainer).toBeDefined();
  });

  it('should dynamically add content to the dialog', () => {
    @Component({
      template: `<p id="test-dynamic-content">Dynamic Content</p>`,
    })
    class TestDynamicComponent {}

    const dynamicFixture = TestBed.createComponent(TestDynamicComponent);
    const dynamicComponentRef = dynamicFixture.componentRef;

    // Dynamically insert content
    component.contentContainer.insert(dynamicComponentRef.hostView);

    // Detect changes in the dialog component
    fixture.detectChanges();

    // Check that the dynamic content is rendered
    const dynamicContent = fixture.nativeElement.querySelector(
      '#test-dynamic-content'
    );
    expect(dynamicContent).toBeTruthy();
    expect(dynamicContent.textContent).toBe('Dynamic Content');
  });
});
