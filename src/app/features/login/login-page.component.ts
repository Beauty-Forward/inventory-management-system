import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  email = '';
  password = '';
  error = signal('');
  submitting = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    this.error.set('');
    this.submitting.set(true);

    try {
      await this.auth.signIn(this.email, this.password);
      this.router.navigate(['/']);
    } catch {
      this.error.set('Invalid email or password.');
    } finally {
      this.submitting.set(false);
    }
  }
}
