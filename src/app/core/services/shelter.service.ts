import { Injectable, inject } from '@angular/core';
import {
  createShelter,
  updateShelter,
  deactivateShelter,
  reactivateShelter,
  listAllShelters,
  listShelters,
  getShelter,
  ListAllSheltersData,
  GetShelterData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';
import type { ShelterFormInput } from '../validators/shelter.validators';

type ShelterListRow = ListAllSheltersData['shelters'][number];
type ShelterDetail = NonNullable<GetShelterData['shelter']>;

@Injectable({ providedIn: 'root' })
export class ShelterService {
  private readonly firebase = inject(FirebaseClientService);

  async listAll(): Promise<ShelterListRow[]> {
    const result = await listAllShelters(this.firebase.dataConnect);
    return result.data.shelters;
  }

  async listByActive(isActive: boolean): Promise<ShelterListRow[]> {
    const result = await listShelters(this.firebase.dataConnect, { isActive });
    return result.data.shelters;
  }

  async get(id: string): Promise<ShelterDetail | null> {
    const result = await getShelter(this.firebase.dataConnect, { id });
    return result.data.shelter ?? null;
  }

  async create(input: ShelterFormInput): Promise<string> {
    const result = await createShelter(this.firebase.dataConnect, {
      name: input.name,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      contactName: input.contactName,
      contactEmail: input.contactEmail || null,
      contactPhone: input.contactPhone || null,
      acceptedTypes: input.acceptedTypes,
      rejectedTypes: input.rejectedTypes,
      preferredBrands: input.preferredBrands,
      notes: input.notes || null,
      capacityPerBatch: input.capacityPerBatch ?? null,
    });
    return result.data.shelter_insert.id;
  }

  async update(id: string, input: Partial<ShelterFormInput>): Promise<void> {
    await updateShelter(this.firebase.dataConnect, {
      id,
      name: input.name,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 ?? null,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      contactName: input.contactName,
      contactEmail: input.contactEmail ?? null,
      contactPhone: input.contactPhone ?? null,
      acceptedTypes: input.acceptedTypes,
      rejectedTypes: input.rejectedTypes,
      preferredBrands: input.preferredBrands,
      notes: input.notes ?? null,
      capacityPerBatch: input.capacityPerBatch ?? null,
    });
  }

  async deactivate(id: string): Promise<void> {
    await deactivateShelter(this.firebase.dataConnect, { id });
  }

  async reactivate(id: string): Promise<void> {
    await reactivateShelter(this.firebase.dataConnect, { id });
  }
}

export type { ShelterListRow, ShelterDetail };
