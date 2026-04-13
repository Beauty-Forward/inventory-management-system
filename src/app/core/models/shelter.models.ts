export interface ShelterAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ShelterContact {
  name: string;
  email?: string;
  phone?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: ShelterAddress;
  contact: ShelterContact;
  acceptedTypes: string[];
  rejectedTypes: string[];
  preferredBrands: string[];
  notes?: string;
  capacityPerBatch?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
