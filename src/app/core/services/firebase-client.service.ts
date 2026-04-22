import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { DataConnect, connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { Functions, connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectorConfig } from '../dataconnect';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseClientService {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly functions: Functions;
  readonly dataConnect: DataConnect;

  constructor() {
    this.app = getApps().length ? getApp() : initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    this.functions = getFunctions(this.app, environment.firebase.functionsRegion);
    this.dataConnect = getDataConnect(this.app, connectorConfig);

    if (environment.firebase.useEmulators) {
      this.connectToEmulators();
    }
  }

  private connectToEmulators(): void {
    try {
      connectAuthEmulator(this.auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFunctionsEmulator(this.functions, '127.0.0.1', 5001);
      connectDataConnectEmulator(this.dataConnect, '127.0.0.1', 9399);
    } catch {
      // Emulator connections are no-op if already connected.
    }
  }
}
