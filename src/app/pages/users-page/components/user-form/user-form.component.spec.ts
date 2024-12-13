import { DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UserStore } from '../../store/users.store';
import { UserFormComponent } from './user-form.component';
type UserStore = {
  fetchSingleUser: (id: number) => any;
  selectedUser: () => { first_name: string; last_name: string; avatar: string };
  updateUser: (id: number, userData: { name: string; job: string }) => any;
  createUser: (userData: { name: string; job: string }) => any;
};

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockDialogRef: jasmine.SpyObj<DialogRef<UserFormComponent>>;
  let mockUserStore: jasmine.SpyObj<UserStore>;

  beforeEach(async () => {
    // Mock DialogRef
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['close'], {
      config: { data: { id: 1 } },
    });

    // Mock UserStore
    mockUserStore = jasmine.createSpyObj('UserStore', [
      'fetchSingleUser',
      'selectedUser',
      'updateUser',
      'createUser',
    ]);

    // Mock fetchSingleUser and selectedUser behavior
    mockUserStore.fetchSingleUser.and.returnValue(of(null));
    mockUserStore.selectedUser.and.returnValue({
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'images/avatar.png',
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserFormComponent],
      providers: [
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: UserStore, useValue: mockUserStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with fetched user data if id is provided', () => {
    expect(mockUserStore.fetchSingleUser).toHaveBeenCalledWith(1);
    expect(component.form.value).toEqual({
      name: 'John',
      job: 'Doe',
    });
    expect(component.fetchedAvatar()).toBe('images/avatar.png');
  });

  it('should call createUser on submit if no id is provided', () => {
    // Modify the mock to simulate no ID
    mockDialogRef.config.data = null;
    const createUserSpy = mockUserStore.createUser.and.returnValue(of(null));

    // Update the form with valid data
    component.form.setValue({ name: 'Jane', job: 'Developer' });
    component.onSubmit();

    expect(createUserSpy).toHaveBeenCalledWith({
      name: 'Jane',
      job: 'Developer',
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call updateUser on submit if id is provided', () => {
    const updateUserSpy = mockUserStore.updateUser.and.returnValue(of(null));

    // Update the form with valid data
    component.form.setValue({ name: 'Jane', job: 'Developer' });
    component.onSubmit();

    expect(updateUserSpy).toHaveBeenCalledWith(1, {
      name: 'Jane',
      job: 'Developer',
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not submit the form if invalid', () => {
    component.form.setValue({ name: '', job: '' });
    component.onSubmit();

    expect(mockUserStore.createUser).not.toHaveBeenCalled();
    expect(mockUserStore.updateUser).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog when close is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
