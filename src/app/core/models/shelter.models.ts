export interface Shelter {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes: string[];
  rejectedTypes: string[];
  preferredBrands: string[];
  notes?: string | null;
  capacityPerBatch?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Minimal row shape for list views
export interface ShelterListItem {
  id: string;
  name: string;
  city: string;
  state: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes?: string[] | null;
  rejectedTypes?: string[] | null;
  isActive: boolean;
}

export interface ShelterFormValues {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  acceptedTypes: string[];
  rejectedTypes: string[];
  preferredBrands: string[];
  notes?: string;
  capacityPerBatch?: number;
}
