import { Injectable, inject } from '@angular/core';
import { executeQuery, QueryFetchPolicy } from 'firebase/data-connect';
import {
  createDonation,
  createProduct,
  getDonation,
  listRecentDonationsRef,
  GetDonationData,
  ListRecentDonationsData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';
import { DonorService } from './donor.service';
import type {
  DonationIntakeInput,
  ProductFormInput,
} from '../validators/donation.validators';

type DonationListRow = ListRecentDonationsData['donations'][number];
type DonationDetail = NonNullable<GetDonationData['donation']>;

export interface DonationIntakeResult {
  donationId: string;
  donorId: string;
  productIds: string[];
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly firebase = inject(FirebaseClientService);
  private readonly donorService = inject(DonorService);

  async listRecent(limit = 20): Promise<DonationListRow[]> {
    // SERVER_ONLY so newly-created donations show up immediately. Same
    // wrapper-bypass pattern as product.service — the auto-generated
    // listRecentDonations() drops the fetchPolicy option on the floor.
    const result = await executeQuery(
      listRecentDonationsRef(this.firebase.dataConnect, { limit }),
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    return result.data.donations;
  }

  async get(id: string): Promise<DonationDetail | null> {
    const result = await getDonation(this.firebase.dataConnect, { id });
    return result.data.donation ?? null;
  }

  /**
   * Full donation intake: upsert donor, create donation, insert all products.
   * Not a DB transaction (Data Connect makes multi-mutation transactions
   * awkward), but errors are surfaced so the warehouse manager can retry.
   */
  async processIntake(
    input: DonationIntakeInput,
    processedBy: string,
  ): Promise<DonationIntakeResult> {
    const donorId = await this.donorService.upsertByEmail({
      ...input.donor,
      linkedRequestId: input.donationRequestId,
    });

    const donationResult = await createDonation(this.firebase.dataConnect, {
      donorId,
      donationRequestId: input.donationRequestId || null,
      warehouseReference: input.warehouseReference,
      date: input.date,
      method: input.method,
      notes: input.notes ?? null,
      processedBy,
      // Walk-in intake never goes through the delivery-app lifecycle.
      // Scheduled donations get their status set by the Firestore trigger.
      logisticsStatus: 'walk_in',
    });
    const donationId = donationResult.data.donation_insert.id;

    const productIds: string[] = [];
    for (const product of input.products) {
      const id = await this.createProductForDonation(donationId, product);
      productIds.push(id);
    }

    await this.donorService.incrementDonationCount(donorId);

    return { donationId, donorId, productIds };
  }

  // Used when the manager processes an Arrived donation that came from
  // the delivery-app sync — the Donation row already exists, we just
  // need to attach products to it. No donor upsert, no createDonation.
  async addProductsToDonation(
    donationId: string,
    products: ProductFormInput[],
  ): Promise<string[]> {
    const productIds: string[] = [];
    for (const product of products) {
      const id = await this.createProductForDonation(donationId, product);
      productIds.push(id);
    }
    return productIds;
  }

  async createProductForDonation(
    donationId: string,
    product: ProductFormInput,
  ): Promise<string> {
    const result = await createProduct(this.firebase.dataConnect, {
      donationId,
      name: product.name,
      brand: product.brand,
      type: product.type,
      quantity: product.quantity,
      price: product.price || null,
      color: product.color || null,
      colorCategory: product.colorCategory || null,
      keyIngredients: product.keyIngredients || null,
      details: product.details ?? null,
      expirationDate: product.expirationDate || null,
      barcode: product.barcode || null,
    });
    return result.data.product_insert.id;
  }
}

export type { DonationListRow, DonationDetail };
