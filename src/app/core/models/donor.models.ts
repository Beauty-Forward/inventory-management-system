export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  city: string;
  state: string;
  instagramHandle?: string;
  linkedRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}
