import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, UserStore } from './store/users.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  userStore = inject(UserStore);
  selectedUser = signal<User | null>(null);

  ngOnInit() {
    this.userStore.fetchUsers().subscribe();
  }

  onScroll(event: Event): void {
    const { pagination, loading } = this.userStore;

    // Check if the user has scrolled to the bottom of the content
    const scrollPosition = event.target as HTMLElement;
    const isAtBottom =
      scrollPosition.scrollHeight ===
      scrollPosition.scrollTop + scrollPosition.clientHeight;

    // Only fetch the next page if we're at the bottom, not loading, and there are more pages
    if (
      isAtBottom &&
      !loading() &&
      pagination().page < pagination().total_pages
    ) {
      // Fetch the next page
      const nextPage = pagination().page + 1;
      this.userStore.fetchUsers(nextPage).subscribe();
    }
  }

  onWindowScroll() {
    const { pagination, loading } = this.userStore;

    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading() && // Check if not loading
      pagination().page < pagination().total_pages // Check if more pages are available
    ) {
      // Load next page
      this.userStore.fetchUsers(pagination().page + 1).subscribe();
    }
  }

  viewUser(id: number) {
    this.userStore.fetchSingleUser(id);
  }

  deleteUser(event: MouseEvent, id: number | undefined) {
    event.stopPropagation();
    if (id) {
      this.userStore.deleteUser(id).subscribe();
      if (id === this.selectedUser()?.id) {
        this.deSelectUser();
      }
    }
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
  }

  deSelectUser() {
    this.selectedUser.set(null);
  }
}
