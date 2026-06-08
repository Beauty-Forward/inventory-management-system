import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  DataConnect,
  QueryFetchPolicy,
  QueryRef,
  connectDataConnectEmulator,
  executeQuery,
  getDataConnect,
} from 'firebase/data-connect';
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

  /**
   * Run a Data Connect query against the server, never the cache.
   *
   * The web SDK defaults reads to PREFER_CACHE, and because we don't configure
   * `cacheSettings` it falls back to an in-memory cache that never expires and
   * is never invalidated by mutations. That makes every mutate-then-reload flow
   * — finalize a batch, add a batch to a shelter, create a shelter — show stale
   * data: the write lands on the server but the reload returns the cached
   * pre-write result, so the UI looks frozen. The generated query wrappers
   * can't be used to fix this either; they forward `options.fetchPolicy` as a
   * bare string where `executeQuery` expects an options object, so the policy
   * is silently dropped. Routing every read through here forces SERVER_ONLY and
   * keeps lists and detail pages in sync with the latest server state.
   */
  async read<Data, Variables>(ref: QueryRef<Data, Variables>): Promise<Data> {
    const result = await executeQuery(ref, {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
    return result.data;
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
