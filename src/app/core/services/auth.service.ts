import { Injectable, signal } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { FirebaseClientService } from './firebase-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);

  constructor(private firebase: FirebaseClientService) {
    onAuthStateChanged(this.firebase.auth, (user) => {
      this.user.set(user);
      this.loading.set(false);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.firebase.auth, email, password);
  }

  async signOut(): Promise<void> {
    await signOut(this.firebase.auth);
  }

  get isAuthenticated(): boolean {
    return this.user() !== null;
  }
}
