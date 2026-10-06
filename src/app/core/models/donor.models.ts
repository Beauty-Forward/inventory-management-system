export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}
