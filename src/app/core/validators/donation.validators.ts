import { z } from 'zod';
import { PRODUCT_TYPE_VALUES } from '../models/product-types';

export const donorFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().toLowerCase().email('Valid email required'),
  phone: z.string().trim().min(7, 'Phone is required'),
  smsOptIn: z.boolean().default(false),
  city: z.string().trim().min(1, 'City is required'),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'Use 2-letter state code'),
  instagramHandle: z.string().trim().optional(),
});

export type DonorFormInput = z.infer<typeof donorFormSchema>;

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  brand: z.string().trim().min(1, 'Brand is required'),
  type: z.enum(PRODUCT_TYPE_VALUES as [string, ...string[]], {
    message: 'Select a product type',
  }),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.string().trim().optional(),
  color: z.string().trim().optional(),
  colorCategory: z.string().trim().optional(),
  keyIngredients: z.string().trim().optional(),
  details: z
    .object({
      hairType: z.string().optional(),
      skinType: z.string().optional(),
      scentFamily: z.string().optional(),
      size: z.string().optional(),
    })
    .partial()
    .optional(),
  expirationDate: z.string().trim().optional(), // ISO date string
  barcode: z.string().trim().optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const donationIntakeSchema = z.object({
  donor: donorFormSchema,
  // Empty for walk-ins (no upstream donation_request). Present for delivery-app donations.
  donationRequestId: z.string().trim().optional(),
  warehouseReference: z.string().trim().min(1),
  date: z.string().trim().min(1, 'Date is required'),
  method: z.enum(['pickup', 'shipping', 'dropoff', 'walk-in']),
  notes: z.string().trim().optional(),
  products: z.array(productFormSchema).min(1, 'Add at least one product'),
});

export type DonationIntakeInput = z.infer<typeof donationIntakeSchema>;
