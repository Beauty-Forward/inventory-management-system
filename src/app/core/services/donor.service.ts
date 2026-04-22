import { Injectable, inject } from '@angular/core';
import {
  createDonor,
  getDonorByEmail,
  incrementDonorDonationCount,
  updateDonor,
  GetDonorByEmailData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';
import type { DonorFormInput } from '../validators/donation.validators';

type DonorRow = GetDonorByEmailData['donors'][number];

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly firebase = inject(FirebaseClientService);

  async findByEmail(email: string): Promise<DonorRow | null> {
    const result = await getDonorByEmail(this.firebase.dataConnect, {
      email: email.toLowerCase().trim(),
    });
    return result.data.donors[0] ?? null;
  }

  /**
   * Find-or-create pattern. Since Data Connect _upsert requires the
   * primary key, we do the two-step lookup-then-insert-or-update here.
   * Returns the donor ID in either case.
   */
  async upsertByEmail(
    input: DonorFormInput & { linkedRequestId?: string },
  ): Promise<string> {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      await updateDonor(this.firebase.dataConnect, {
        id: existing.id,
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        state: input.state,
        smsOptIn: input.smsOptIn,
        instagramHandle: input.instagramHandle ?? null,
        linkedRequestId: input.linkedRequestId ?? null,
      });
      return existing.id;
    }

    const created = await createDonor(this.firebase.dataConnect, {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      city: input.city,
      state: input.state,
      smsOptIn: input.smsOptIn,
      instagramHandle: input.instagramHandle ?? null,
      linkedRequestId: input.linkedRequestId ?? null,
    });
    return created.data.donor_insert.id;
  }

  async incrementDonationCount(id: string): Promise<void> {
    await incrementDonorDonationCount(this.firebase.dataConnect, { id });
  }
}
