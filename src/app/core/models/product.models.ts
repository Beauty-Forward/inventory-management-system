export type ProductStatus = 'in_stock' | 'allocated' | 'shipped' | 'expired' | 'discarded';

export interface ProductDetails {
  hairType?: string;
  skinType?: string;
  scentFamily?: string;
  size?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  donationId: string;
  name: string;
  brand: string;
  type: string;
  quantity: number;
  price?: string;
  color?: string;
  colorCategory?: string;
  keyIngredients?: string;
  details?: ProductDetails;
  expirationDate?: Date;
  barcode?: string;
  status: ProductStatus;
  batchId?: string;
  createdAt: Date;
  updatedAt: Date;
}
