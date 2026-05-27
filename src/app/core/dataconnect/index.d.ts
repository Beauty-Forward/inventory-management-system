import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum BatchStatus {
  DRAFT = "DRAFT",
  FINALIZED = "FINALIZED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
};

export enum ProductStatus {
  IN_STOCK = "IN_STOCK",
  ALLOCATED = "ALLOCATED",
  SHIPPED = "SHIPPED",
  EXPIRED = "EXPIRED",
  DISCARDED = "DISCARDED",
};



export interface AllocateProductToBatchData {
  product_update?: Product_Key | null;
}

export interface AllocateProductToBatchVariables {
  productId: UUIDString;
  batchId: UUIDString;
}

export interface Batch_Key {
  id: UUIDString;
  __typename?: 'Batch_Key';
}

export interface CreateBatchData {
  batch_insert: Batch_Key;
}

export interface CreateBatchVariables {
  shelterId: UUIDString;
  createdBy: string;
  notes?: string | null;
}

export interface CreateDonationData {
  donation_insert: Donation_Key;
}

export interface CreateDonationVariables {
  donorId: UUIDString;
  donationRequestId?: string | null;
  warehouseReference: string;
  date: DateString;
  method: string;
  notes?: string | null;
  processedBy: string;
}

export interface CreateDonorData {
  donor_insert: Donor_Key;
}

export interface CreateDonorVariables {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  smsOptIn?: boolean | null;
  instagramHandle?: string | null;
  linkedRequestId?: string | null;
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  donationId: UUIDString;
  name: string;
  brand: string;
  type: string;
  quantity: number;
  price?: string | null;
  color?: string | null;
  colorCategory?: string | null;
  keyIngredients?: string | null;
  details?: unknown | null;
  expirationDate?: DateString | null;
  barcode?: string | null;
}

export interface CreateShelterData {
  shelter_insert: Shelter_Key;
}

export interface CreateShelterVariables {
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes?: string[] | null;
  rejectedTypes?: string[] | null;
  preferredBrands?: string[] | null;
  notes?: string | null;
  capacityPerBatch?: number | null;
}

export interface DashboardInStockCountData {
  products: ({
    id: UUIDString;
  } & Product_Key)[];
}

export interface DashboardStatsData {
  inStock: ({
    id: UUIDString;
  } & Product_Key)[];
    allocated: ({
      id: UUIDString;
    } & Product_Key)[];
      shipped: ({
        id: UUIDString;
      } & Product_Key)[];
}

export interface DeactivateShelterData {
  shelter_update?: Shelter_Key | null;
}

export interface DeactivateShelterVariables {
  id: UUIDString;
}

export interface DeliverBatchData {
  batch_update?: Batch_Key | null;
}

export interface DeliverBatchVariables {
  id: UUIDString;
}

export interface Donation_Key {
  id: UUIDString;
  __typename?: 'Donation_Key';
}

export interface Donor_Key {
  id: UUIDString;
  __typename?: 'Donor_Key';
}

export interface FinalizeBatchData {
  batch_update?: Batch_Key | null;
}

export interface FinalizeBatchVariables {
  id: UUIDString;
}

export interface GetBatchData {
  batch?: {
    id: UUIDString;
    status: BatchStatus;
    notes?: string | null;
    createdBy: string;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    createdAt: TimestampString;
    shelter: {
      id: UUIDString;
      name: string;
      addressLine1: string;
      addressLine2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      contactName: string;
      contactEmail?: string | null;
      acceptedTypes?: string[] | null;
    } & Shelter_Key;
      products: ({
        id: UUIDString;
        name: string;
        brand: string;
        type: string;
        quantity: number;
        status: ProductStatus;
        expirationDate?: DateString | null;
      } & Product_Key)[];
  } & Batch_Key;
}

export interface GetBatchVariables {
  id: UUIDString;
}

export interface GetCatalogByBarcodeData {
  productCatalog?: {
    barcode: string;
    name: string;
    brand: string;
    type: string;
    price?: string | null;
    color?: string | null;
    keyIngredients?: string | null;
    source: string;
    timesUsed: number;
  } & ProductCatalog_Key;
}

export interface GetCatalogByBarcodeVariables {
  barcode: string;
}

export interface GetDonationData {
  donation?: {
    id: UUIDString;
    donationRequestId?: string | null;
    warehouseReference: string;
    date: DateString;
    method: string;
    notes?: string | null;
    processedBy: string;
    createdAt: TimestampString;
    donor: {
      id: UUIDString;
      fullName: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    } & Donor_Key;
      products: ({
        id: UUIDString;
        name: string;
        brand: string;
        type: string;
        quantity: number;
        status: ProductStatus;
        expirationDate?: DateString | null;
      } & Product_Key)[];
  } & Donation_Key;
}

export interface GetDonationVariables {
  id: UUIDString;
}

export interface GetDonorByEmailData {
  donors: ({
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    smsOptIn: boolean;
    city: string;
    state: string;
    instagramHandle?: string | null;
    donationCount: number;
  } & Donor_Key)[];
}

export interface GetDonorByEmailVariables {
  email: string;
}

export interface GetDonorData {
  donor?: {
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    smsOptIn: boolean;
    city: string;
    state: string;
    instagramHandle?: string | null;
    linkedRequestId?: string | null;
    donationCount: number;
    createdAt: TimestampString;
  } & Donor_Key;
}

export interface GetDonorVariables {
  id: UUIDString;
}

export interface GetProductData {
  product?: {
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    price?: string | null;
    color?: string | null;
    colorCategory?: string | null;
    keyIngredients?: string | null;
    details?: unknown | null;
    expirationDate?: DateString | null;
    barcode?: string | null;
    status: ProductStatus;
    createdAt: TimestampString;
    donation: {
      id: UUIDString;
      date: DateString;
      method: string;
      donor: {
        id: UUIDString;
        fullName: string;
        email: string;
      } & Donor_Key;
    } & Donation_Key;
      batch?: {
        id: UUIDString;
        status: BatchStatus;
        shelter: {
          id: UUIDString;
          name: string;
        } & Shelter_Key;
      } & Batch_Key;
  } & Product_Key;
}

export interface GetProductVariables {
  id: UUIDString;
}

export interface GetShelterData {
  shelter?: {
    id: UUIDString;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    preferredBrands?: string[] | null;
    notes?: string | null;
    capacityPerBatch?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    batches: ({
      id: UUIDString;
      status: BatchStatus;
      createdAt: TimestampString;
      finalizedAt?: TimestampString | null;
      shippedAt?: TimestampString | null;
    } & Batch_Key)[];
  } & Shelter_Key;
}

export interface GetShelterVariables {
  id: UUIDString;
}

export interface IncrementCatalogUsageData {
  productCatalog_update?: ProductCatalog_Key | null;
}

export interface IncrementCatalogUsageVariables {
  barcode: string;
}

export interface IncrementDonorDonationCountData {
  donor_update?: Donor_Key | null;
}

export interface IncrementDonorDonationCountVariables {
  id: UUIDString;
}

export interface ListAllBatchesData {
  batches: ({
    id: UUIDString;
    status: BatchStatus;
    createdAt: TimestampString;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    shelter: {
      id: UUIDString;
      name: string;
      city: string;
      state: string;
    } & Shelter_Key;
  } & Batch_Key)[];
}

export interface ListAllSheltersData {
  shelters: ({
    id: UUIDString;
    name: string;
    city: string;
    state: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    isActive: boolean;
  } & Shelter_Key)[];
}

export interface ListAvailableProductsForShelterData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    color?: string | null;
    expirationDate?: DateString | null;
  } & Product_Key)[];
}

export interface ListAvailableProductsForShelterVariables {
  types?: string[] | null;
  limit?: number | null;
}

export interface ListBatchesData {
  batches: ({
    id: UUIDString;
    status: BatchStatus;
    createdAt: TimestampString;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    shelter: {
      id: UUIDString;
      name: string;
      city: string;
      state: string;
    } & Shelter_Key;
  } & Batch_Key)[];
}

export interface ListBatchesVariables {
  status?: BatchStatus | null;
}

export interface ListExpiringSoonData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    expirationDate?: DateString | null;
    quantity: number;
  } & Product_Key)[];
}

export interface ListExpiringSoonVariables {
  beforeDate: DateString;
}

export interface ListInventoryInStockData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    color?: string | null;
    colorCategory?: string | null;
    expirationDate?: DateString | null;
    barcode?: string | null;
    status: ProductStatus;
    createdAt: TimestampString;
    donation: {
      id: UUIDString;
      date: DateString;
      donor: {
        fullName: string;
      };
    } & Donation_Key;
  } & Product_Key)[];
}

export interface ListInventoryInStockVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface ListProductsInBatchData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    status: ProductStatus;
  } & Product_Key)[];
}

export interface ListProductsInBatchVariables {
  batchId: UUIDString;
}

export interface ListRecentDonationsData {
  donations: ({
    id: UUIDString;
    date: DateString;
    method: string;
    notes?: string | null;
    createdAt: TimestampString;
    donor: {
      id: UUIDString;
      fullName: string;
      email: string;
    } & Donor_Key;
  } & Donation_Key)[];
}

export interface ListRecentDonationsVariables {
  limit?: number | null;
}

export interface ListSheltersData {
  shelters: ({
    id: UUIDString;
    name: string;
    city: string;
    state: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    isActive: boolean;
  } & Shelter_Key)[];
}

export interface ListSheltersVariables {
  isActive?: boolean | null;
}

export interface MarkBatchProductsShippedData {
  product_updateMany: number;
}

export interface MarkBatchProductsShippedVariables {
  batchId: UUIDString;
}

export interface MarkProductDiscardedData {
  product_update?: Product_Key | null;
}

export interface MarkProductDiscardedVariables {
  productId: UUIDString;
}

export interface MarkProductExpiredData {
  product_update?: Product_Key | null;
}

export interface MarkProductExpiredVariables {
  productId: UUIDString;
}

export interface ProductCatalog_Key {
  barcode: string;
  __typename?: 'ProductCatalog_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface ReactivateShelterData {
  shelter_update?: Shelter_Key | null;
}

export interface ReactivateShelterVariables {
  id: UUIDString;
}

export interface Shelter_Key {
  id: UUIDString;
  __typename?: 'Shelter_Key';
}

export interface ShipBatchData {
  batch_update?: Batch_Key | null;
}

export interface ShipBatchVariables {
  id: UUIDString;
}

export interface UnallocateProductData {
  product_update?: Product_Key | null;
}

export interface UnallocateProductVariables {
  productId: UUIDString;
}

export interface UpdateBatchNotesData {
  batch_update?: Batch_Key | null;
}

export interface UpdateBatchNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface UpdateDonorData {
  donor_update?: Donor_Key | null;
}

export interface UpdateDonorVariables {
  id: UUIDString;
  fullName?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  smsOptIn?: boolean | null;
  instagramHandle?: string | null;
  linkedRequestId?: string | null;
}

export interface UpdateShelterData {
  shelter_update?: Shelter_Key | null;
}

export interface UpdateShelterVariables {
  id: UUIDString;
  name?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes?: string[] | null;
  rejectedTypes?: string[] | null;
  preferredBrands?: string[] | null;
  notes?: string | null;
  capacityPerBatch?: number | null;
}

export interface UpsertCatalogEntryData {
  productCatalog_upsert: ProductCatalog_Key;
}

export interface UpsertCatalogEntryVariables {
  barcode: string;
  name: string;
  brand: string;
  type: string;
  price?: string | null;
  color?: string | null;
  keyIngredients?: string | null;
  source: string;
}

interface CreateDonorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDonorVariables): MutationRef<CreateDonorData, CreateDonorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDonorVariables): MutationRef<CreateDonorData, CreateDonorVariables>;
  operationName: string;
}
export const createDonorRef: CreateDonorRef;

export function createDonor(vars: CreateDonorVariables): MutationPromise<CreateDonorData, CreateDonorVariables>;
export function createDonor(dc: DataConnect, vars: CreateDonorVariables): MutationPromise<CreateDonorData, CreateDonorVariables>;

interface UpdateDonorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDonorVariables): MutationRef<UpdateDonorData, UpdateDonorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDonorVariables): MutationRef<UpdateDonorData, UpdateDonorVariables>;
  operationName: string;
}
export const updateDonorRef: UpdateDonorRef;

export function updateDonor(vars: UpdateDonorVariables): MutationPromise<UpdateDonorData, UpdateDonorVariables>;
export function updateDonor(dc: DataConnect, vars: UpdateDonorVariables): MutationPromise<UpdateDonorData, UpdateDonorVariables>;

interface IncrementDonorDonationCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementDonorDonationCountVariables): MutationRef<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: IncrementDonorDonationCountVariables): MutationRef<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;
  operationName: string;
}
export const incrementDonorDonationCountRef: IncrementDonorDonationCountRef;

export function incrementDonorDonationCount(vars: IncrementDonorDonationCountVariables): MutationPromise<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;
export function incrementDonorDonationCount(dc: DataConnect, vars: IncrementDonorDonationCountVariables): MutationPromise<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;

interface CreateDonationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDonationVariables): MutationRef<CreateDonationData, CreateDonationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDonationVariables): MutationRef<CreateDonationData, CreateDonationVariables>;
  operationName: string;
}
export const createDonationRef: CreateDonationRef;

export function createDonation(vars: CreateDonationVariables): MutationPromise<CreateDonationData, CreateDonationVariables>;
export function createDonation(dc: DataConnect, vars: CreateDonationVariables): MutationPromise<CreateDonationData, CreateDonationVariables>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface AllocateProductToBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AllocateProductToBatchVariables): MutationRef<AllocateProductToBatchData, AllocateProductToBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AllocateProductToBatchVariables): MutationRef<AllocateProductToBatchData, AllocateProductToBatchVariables>;
  operationName: string;
}
export const allocateProductToBatchRef: AllocateProductToBatchRef;

export function allocateProductToBatch(vars: AllocateProductToBatchVariables): MutationPromise<AllocateProductToBatchData, AllocateProductToBatchVariables>;
export function allocateProductToBatch(dc: DataConnect, vars: AllocateProductToBatchVariables): MutationPromise<AllocateProductToBatchData, AllocateProductToBatchVariables>;

interface UnallocateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UnallocateProductVariables): MutationRef<UnallocateProductData, UnallocateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UnallocateProductVariables): MutationRef<UnallocateProductData, UnallocateProductVariables>;
  operationName: string;
}
export const unallocateProductRef: UnallocateProductRef;

export function unallocateProduct(vars: UnallocateProductVariables): MutationPromise<UnallocateProductData, UnallocateProductVariables>;
export function unallocateProduct(dc: DataConnect, vars: UnallocateProductVariables): MutationPromise<UnallocateProductData, UnallocateProductVariables>;

interface MarkBatchProductsShippedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkBatchProductsShippedVariables): MutationRef<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkBatchProductsShippedVariables): MutationRef<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;
  operationName: string;
}
export const markBatchProductsShippedRef: MarkBatchProductsShippedRef;

export function markBatchProductsShipped(vars: MarkBatchProductsShippedVariables): MutationPromise<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;
export function markBatchProductsShipped(dc: DataConnect, vars: MarkBatchProductsShippedVariables): MutationPromise<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;

interface MarkProductExpiredRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkProductExpiredVariables): MutationRef<MarkProductExpiredData, MarkProductExpiredVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkProductExpiredVariables): MutationRef<MarkProductExpiredData, MarkProductExpiredVariables>;
  operationName: string;
}
export const markProductExpiredRef: MarkProductExpiredRef;

export function markProductExpired(vars: MarkProductExpiredVariables): MutationPromise<MarkProductExpiredData, MarkProductExpiredVariables>;
export function markProductExpired(dc: DataConnect, vars: MarkProductExpiredVariables): MutationPromise<MarkProductExpiredData, MarkProductExpiredVariables>;

interface MarkProductDiscardedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkProductDiscardedVariables): MutationRef<MarkProductDiscardedData, MarkProductDiscardedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkProductDiscardedVariables): MutationRef<MarkProductDiscardedData, MarkProductDiscardedVariables>;
  operationName: string;
}
export const markProductDiscardedRef: MarkProductDiscardedRef;

export function markProductDiscarded(vars: MarkProductDiscardedVariables): MutationPromise<MarkProductDiscardedData, MarkProductDiscardedVariables>;
export function markProductDiscarded(dc: DataConnect, vars: MarkProductDiscardedVariables): MutationPromise<MarkProductDiscardedData, MarkProductDiscardedVariables>;

interface CreateShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShelterVariables): MutationRef<CreateShelterData, CreateShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateShelterVariables): MutationRef<CreateShelterData, CreateShelterVariables>;
  operationName: string;
}
export const createShelterRef: CreateShelterRef;

export function createShelter(vars: CreateShelterVariables): MutationPromise<CreateShelterData, CreateShelterVariables>;
export function createShelter(dc: DataConnect, vars: CreateShelterVariables): MutationPromise<CreateShelterData, CreateShelterVariables>;

interface UpdateShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateShelterVariables): MutationRef<UpdateShelterData, UpdateShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateShelterVariables): MutationRef<UpdateShelterData, UpdateShelterVariables>;
  operationName: string;
}
export const updateShelterRef: UpdateShelterRef;

export function updateShelter(vars: UpdateShelterVariables): MutationPromise<UpdateShelterData, UpdateShelterVariables>;
export function updateShelter(dc: DataConnect, vars: UpdateShelterVariables): MutationPromise<UpdateShelterData, UpdateShelterVariables>;

interface DeactivateShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateShelterVariables): MutationRef<DeactivateShelterData, DeactivateShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeactivateShelterVariables): MutationRef<DeactivateShelterData, DeactivateShelterVariables>;
  operationName: string;
}
export const deactivateShelterRef: DeactivateShelterRef;

export function deactivateShelter(vars: DeactivateShelterVariables): MutationPromise<DeactivateShelterData, DeactivateShelterVariables>;
export function deactivateShelter(dc: DataConnect, vars: DeactivateShelterVariables): MutationPromise<DeactivateShelterData, DeactivateShelterVariables>;

interface ReactivateShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReactivateShelterVariables): MutationRef<ReactivateShelterData, ReactivateShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ReactivateShelterVariables): MutationRef<ReactivateShelterData, ReactivateShelterVariables>;
  operationName: string;
}
export const reactivateShelterRef: ReactivateShelterRef;

export function reactivateShelter(vars: ReactivateShelterVariables): MutationPromise<ReactivateShelterData, ReactivateShelterVariables>;
export function reactivateShelter(dc: DataConnect, vars: ReactivateShelterVariables): MutationPromise<ReactivateShelterData, ReactivateShelterVariables>;

interface CreateBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBatchVariables): MutationRef<CreateBatchData, CreateBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBatchVariables): MutationRef<CreateBatchData, CreateBatchVariables>;
  operationName: string;
}
export const createBatchRef: CreateBatchRef;

export function createBatch(vars: CreateBatchVariables): MutationPromise<CreateBatchData, CreateBatchVariables>;
export function createBatch(dc: DataConnect, vars: CreateBatchVariables): MutationPromise<CreateBatchData, CreateBatchVariables>;

interface FinalizeBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: FinalizeBatchVariables): MutationRef<FinalizeBatchData, FinalizeBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: FinalizeBatchVariables): MutationRef<FinalizeBatchData, FinalizeBatchVariables>;
  operationName: string;
}
export const finalizeBatchRef: FinalizeBatchRef;

export function finalizeBatch(vars: FinalizeBatchVariables): MutationPromise<FinalizeBatchData, FinalizeBatchVariables>;
export function finalizeBatch(dc: DataConnect, vars: FinalizeBatchVariables): MutationPromise<FinalizeBatchData, FinalizeBatchVariables>;

interface ShipBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ShipBatchVariables): MutationRef<ShipBatchData, ShipBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ShipBatchVariables): MutationRef<ShipBatchData, ShipBatchVariables>;
  operationName: string;
}
export const shipBatchRef: ShipBatchRef;

export function shipBatch(vars: ShipBatchVariables): MutationPromise<ShipBatchData, ShipBatchVariables>;
export function shipBatch(dc: DataConnect, vars: ShipBatchVariables): MutationPromise<ShipBatchData, ShipBatchVariables>;

interface DeliverBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeliverBatchVariables): MutationRef<DeliverBatchData, DeliverBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeliverBatchVariables): MutationRef<DeliverBatchData, DeliverBatchVariables>;
  operationName: string;
}
export const deliverBatchRef: DeliverBatchRef;

export function deliverBatch(vars: DeliverBatchVariables): MutationPromise<DeliverBatchData, DeliverBatchVariables>;
export function deliverBatch(dc: DataConnect, vars: DeliverBatchVariables): MutationPromise<DeliverBatchData, DeliverBatchVariables>;

interface UpdateBatchNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBatchNotesVariables): MutationRef<UpdateBatchNotesData, UpdateBatchNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBatchNotesVariables): MutationRef<UpdateBatchNotesData, UpdateBatchNotesVariables>;
  operationName: string;
}
export const updateBatchNotesRef: UpdateBatchNotesRef;

export function updateBatchNotes(vars: UpdateBatchNotesVariables): MutationPromise<UpdateBatchNotesData, UpdateBatchNotesVariables>;
export function updateBatchNotes(dc: DataConnect, vars: UpdateBatchNotesVariables): MutationPromise<UpdateBatchNotesData, UpdateBatchNotesVariables>;

interface UpsertCatalogEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCatalogEntryVariables): MutationRef<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCatalogEntryVariables): MutationRef<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;
  operationName: string;
}
export const upsertCatalogEntryRef: UpsertCatalogEntryRef;

export function upsertCatalogEntry(vars: UpsertCatalogEntryVariables): MutationPromise<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;
export function upsertCatalogEntry(dc: DataConnect, vars: UpsertCatalogEntryVariables): MutationPromise<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;

interface IncrementCatalogUsageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementCatalogUsageVariables): MutationRef<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: IncrementCatalogUsageVariables): MutationRef<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;
  operationName: string;
}
export const incrementCatalogUsageRef: IncrementCatalogUsageRef;

export function incrementCatalogUsage(vars: IncrementCatalogUsageVariables): MutationPromise<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;
export function incrementCatalogUsage(dc: DataConnect, vars: IncrementCatalogUsageVariables): MutationPromise<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;

interface GetDonorByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonorByEmailVariables): QueryRef<GetDonorByEmailData, GetDonorByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDonorByEmailVariables): QueryRef<GetDonorByEmailData, GetDonorByEmailVariables>;
  operationName: string;
}
export const getDonorByEmailRef: GetDonorByEmailRef;

export function getDonorByEmail(vars: GetDonorByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorByEmailData, GetDonorByEmailVariables>;
export function getDonorByEmail(dc: DataConnect, vars: GetDonorByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorByEmailData, GetDonorByEmailVariables>;

interface GetDonorRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonorVariables): QueryRef<GetDonorData, GetDonorVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDonorVariables): QueryRef<GetDonorData, GetDonorVariables>;
  operationName: string;
}
export const getDonorRef: GetDonorRef;

export function getDonor(vars: GetDonorVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorData, GetDonorVariables>;
export function getDonor(dc: DataConnect, vars: GetDonorVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorData, GetDonorVariables>;

interface ListRecentDonationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListRecentDonationsVariables): QueryRef<ListRecentDonationsData, ListRecentDonationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListRecentDonationsVariables): QueryRef<ListRecentDonationsData, ListRecentDonationsVariables>;
  operationName: string;
}
export const listRecentDonationsRef: ListRecentDonationsRef;

export function listRecentDonations(vars?: ListRecentDonationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListRecentDonationsData, ListRecentDonationsVariables>;
export function listRecentDonations(dc: DataConnect, vars?: ListRecentDonationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListRecentDonationsData, ListRecentDonationsVariables>;

interface GetDonationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonationVariables): QueryRef<GetDonationData, GetDonationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDonationVariables): QueryRef<GetDonationData, GetDonationVariables>;
  operationName: string;
}
export const getDonationRef: GetDonationRef;

export function getDonation(vars: GetDonationVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonationData, GetDonationVariables>;
export function getDonation(dc: DataConnect, vars: GetDonationVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonationData, GetDonationVariables>;

interface ListSheltersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSheltersVariables): QueryRef<ListSheltersData, ListSheltersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListSheltersVariables): QueryRef<ListSheltersData, ListSheltersVariables>;
  operationName: string;
}
export const listSheltersRef: ListSheltersRef;

export function listShelters(vars?: ListSheltersVariables, options?: ExecuteQueryOptions): QueryPromise<ListSheltersData, ListSheltersVariables>;
export function listShelters(dc: DataConnect, vars?: ListSheltersVariables, options?: ExecuteQueryOptions): QueryPromise<ListSheltersData, ListSheltersVariables>;

interface ListAllSheltersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSheltersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllSheltersData, undefined>;
  operationName: string;
}
export const listAllSheltersRef: ListAllSheltersRef;

export function listAllShelters(options?: ExecuteQueryOptions): QueryPromise<ListAllSheltersData, undefined>;
export function listAllShelters(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSheltersData, undefined>;

interface GetShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShelterVariables): QueryRef<GetShelterData, GetShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetShelterVariables): QueryRef<GetShelterData, GetShelterVariables>;
  operationName: string;
}
export const getShelterRef: GetShelterRef;

export function getShelter(vars: GetShelterVariables, options?: ExecuteQueryOptions): QueryPromise<GetShelterData, GetShelterVariables>;
export function getShelter(dc: DataConnect, vars: GetShelterVariables, options?: ExecuteQueryOptions): QueryPromise<GetShelterData, GetShelterVariables>;

interface ListInventoryInStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListInventoryInStockVariables): QueryRef<ListInventoryInStockData, ListInventoryInStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListInventoryInStockVariables): QueryRef<ListInventoryInStockData, ListInventoryInStockVariables>;
  operationName: string;
}
export const listInventoryInStockRef: ListInventoryInStockRef;

export function listInventoryInStock(vars?: ListInventoryInStockVariables, options?: ExecuteQueryOptions): QueryPromise<ListInventoryInStockData, ListInventoryInStockVariables>;
export function listInventoryInStock(dc: DataConnect, vars?: ListInventoryInStockVariables, options?: ExecuteQueryOptions): QueryPromise<ListInventoryInStockData, ListInventoryInStockVariables>;

interface GetProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  operationName: string;
}
export const getProductRef: GetProductRef;

export function getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface ListAvailableProductsForShelterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAvailableProductsForShelterVariables): QueryRef<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListAvailableProductsForShelterVariables): QueryRef<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;
  operationName: string;
}
export const listAvailableProductsForShelterRef: ListAvailableProductsForShelterRef;

export function listAvailableProductsForShelter(vars?: ListAvailableProductsForShelterVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;
export function listAvailableProductsForShelter(dc: DataConnect, vars?: ListAvailableProductsForShelterVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;

interface ListProductsInBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsInBatchVariables): QueryRef<ListProductsInBatchData, ListProductsInBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsInBatchVariables): QueryRef<ListProductsInBatchData, ListProductsInBatchVariables>;
  operationName: string;
}
export const listProductsInBatchRef: ListProductsInBatchRef;

export function listProductsInBatch(vars: ListProductsInBatchVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsInBatchData, ListProductsInBatchVariables>;
export function listProductsInBatch(dc: DataConnect, vars: ListProductsInBatchVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsInBatchData, ListProductsInBatchVariables>;

interface ListExpiringSoonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListExpiringSoonVariables): QueryRef<ListExpiringSoonData, ListExpiringSoonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListExpiringSoonVariables): QueryRef<ListExpiringSoonData, ListExpiringSoonVariables>;
  operationName: string;
}
export const listExpiringSoonRef: ListExpiringSoonRef;

export function listExpiringSoon(vars: ListExpiringSoonVariables, options?: ExecuteQueryOptions): QueryPromise<ListExpiringSoonData, ListExpiringSoonVariables>;
export function listExpiringSoon(dc: DataConnect, vars: ListExpiringSoonVariables, options?: ExecuteQueryOptions): QueryPromise<ListExpiringSoonData, ListExpiringSoonVariables>;

interface ListBatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListBatchesVariables): QueryRef<ListBatchesData, ListBatchesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListBatchesVariables): QueryRef<ListBatchesData, ListBatchesVariables>;
  operationName: string;
}
export const listBatchesRef: ListBatchesRef;

export function listBatches(vars?: ListBatchesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBatchesData, ListBatchesVariables>;
export function listBatches(dc: DataConnect, vars?: ListBatchesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBatchesData, ListBatchesVariables>;

interface ListAllBatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllBatchesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllBatchesData, undefined>;
  operationName: string;
}
export const listAllBatchesRef: ListAllBatchesRef;

export function listAllBatches(options?: ExecuteQueryOptions): QueryPromise<ListAllBatchesData, undefined>;
export function listAllBatches(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllBatchesData, undefined>;

interface GetBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBatchVariables): QueryRef<GetBatchData, GetBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBatchVariables): QueryRef<GetBatchData, GetBatchVariables>;
  operationName: string;
}
export const getBatchRef: GetBatchRef;

export function getBatch(vars: GetBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetBatchData, GetBatchVariables>;
export function getBatch(dc: DataConnect, vars: GetBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetBatchData, GetBatchVariables>;

interface DashboardInStockCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DashboardInStockCountData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<DashboardInStockCountData, undefined>;
  operationName: string;
}
export const dashboardInStockCountRef: DashboardInStockCountRef;

export function dashboardInStockCount(options?: ExecuteQueryOptions): QueryPromise<DashboardInStockCountData, undefined>;
export function dashboardInStockCount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<DashboardInStockCountData, undefined>;

interface DashboardStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DashboardStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<DashboardStatsData, undefined>;
  operationName: string;
}
export const dashboardStatsRef: DashboardStatsRef;

export function dashboardStats(options?: ExecuteQueryOptions): QueryPromise<DashboardStatsData, undefined>;
export function dashboardStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<DashboardStatsData, undefined>;

interface GetCatalogByBarcodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCatalogByBarcodeVariables): QueryRef<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCatalogByBarcodeVariables): QueryRef<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;
  operationName: string;
}
export const getCatalogByBarcodeRef: GetCatalogByBarcodeRef;

export function getCatalogByBarcode(vars: GetCatalogByBarcodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;
export function getCatalogByBarcode(dc: DataConnect, vars: GetCatalogByBarcodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;

