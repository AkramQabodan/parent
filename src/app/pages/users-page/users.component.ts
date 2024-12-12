import { Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserStore } from './store/users.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  @HostListener('window:scroll', ['$event'])
  userStore = inject(UserStore);

  ngOnInit() {
    // Load first page of users
    this.userStore.fetchUsers().subscribe((res) => {
      console.log(res);
    });
  }

  // Infinite Scrolling
  onWindowScroll() {
    const { pagination, loading } = this.userStore;

    // Check if we're at the bottom of the page and there are more pages
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading() &&
      pagination().page < pagination().total_pages
    ) {
      // Load next page
      this.userStore.fetchUsers(pagination().page + 1);
    }
  }

  viewUser(id: number) {
    this.userStore.fetchSingleUser(id);
  }

  deleteUser(id: number) {
    this.userStore.deleteUser(id);
  }
}
