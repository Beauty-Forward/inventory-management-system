import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects === '/login';
      }
    });
  }

  // Nav is visible on every route except the login page.
  // When auth is turned on later, add `&& this.auth.isAuthenticated`.
  get showNav(): boolean {
    return !this.isLoginPage;
  }
}
