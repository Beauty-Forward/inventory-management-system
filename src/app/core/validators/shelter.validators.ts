import { z } from 'zod';
import { PRODUCT_TYPE_VALUES } from '../models/product-types';

const US_STATE_REGEX = /^[A-Z]{2}$/;

export const shelterFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  addressLine1: z.string().trim().min(1, 'Street address is required'),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1, 'City is required'),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(US_STATE_REGEX, 'Use 2-letter state code (e.g. NY)'),
  postalCode: z.string().trim().min(3, 'Postal code is required'),
  contactName: z.string().trim().min(1, 'Contact name is required'),
  contactEmail: z
    .string()
    .trim()
    .email('Valid email required')
    .optional()
    .or(z.literal('')),
  contactPhone: z.string().trim().optional(),
  acceptedTypes: z
    .array(z.enum(PRODUCT_TYPE_VALUES as [string, ...string[]]))
    .default([]),
  rejectedTypes: z
    .array(z.enum(PRODUCT_TYPE_VALUES as [string, ...string[]]))
    .default([]),
  preferredBrands: z.array(z.string().trim()).default([]),
  notes: z.string().trim().optional(),
  capacityPerBatch: z
    .number()
    .int()
    .positive('Must be positive')
    .optional(),
});

export type ShelterFormInput = z.infer<typeof shelterFormSchema>;
