import { Injectable, inject } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import { FirebaseClientService } from './firebase-client.service';

export interface ReferenceLookupResult {
  found: boolean;
  requestId?: string;
  donationType?: 'pickup' | 'shipping' | 'dropoff';
  status?: string;
  donor?: {
    fullName: string;
    email: string;
    phone: string;
  };
  dropoff?: {
    preferredDate?: string;
    preferredTimeWindow?: string;
    referenceCode?: string;
    dropoffNotes?: string;
  };
  pickup?: {
    preferredDate?: string;
    preferredTimeWindow?: string;
  };
  shipping?: unknown;
  createdAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ReferenceLookupService {
  private readonly firebase = inject(FirebaseClientService);

  async lookup(referenceCode: string): Promise<ReferenceLookupResult> {
    const fn = httpsCallable<
      { referenceCode: string },
      ReferenceLookupResult
    >(this.firebase.functions, 'lookupDonationByReference');
    const result = await fn({ referenceCode });
    return result.data;
  }
}
