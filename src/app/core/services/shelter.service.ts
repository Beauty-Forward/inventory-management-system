import { Injectable, inject } from '@angular/core';
import { executeQuery, QueryFetchPolicy } from 'firebase/data-connect';
import {
  createShelter,
  updateShelter,
  deactivateShelter,
  deleteShelter,
  reactivateShelter,
  listAllSheltersRef,
  listSheltersRef,
  getShelterRef,
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

  // Reads call executeQuery directly with the query ref rather than the
  // generated wrappers. The wrappers forward `options.fetchPolicy` (a string)
  // where executeQuery expects the full options object, so SERVER_ONLY is
  // dropped and the SDK falls back to PREFER_CACHE — returning stale data
  // after a mutation (e.g. deactivate). See product.service.listInStock.
  async listAll(): Promise<ShelterListRow[]> {
    const result = await executeQuery(listAllSheltersRef(this.firebase.dataConnect), {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
    return result.data.shelters;
  }

  async listByActive(isActive: boolean): Promise<ShelterListRow[]> {
    const result = await executeQuery(
      listSheltersRef(this.firebase.dataConnect, { isActive }),
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    return result.data.shelters;
  }

  async get(id: string): Promise<ShelterDetail | null> {
    const result = await executeQuery(getShelterRef(this.firebase.dataConnect, { id }), {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
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

  // Hard delete. Only safe when the shelter has no batches referencing it
  // (guarded in the UI); otherwise callers should deactivate instead.
  async delete(id: string): Promise<void> {
    await deleteShelter(this.firebase.dataConnect, { id });
  }
}

export type { ShelterListRow, ShelterDetail };
