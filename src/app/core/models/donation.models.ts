export type DonationMethod = 'pickup' | 'shipping' | 'dropoff' | 'walk-in';

export interface Donation {
  id: string;
  donorId: string;
  donationRequestId: string;
  date: Date;
  method: DonationMethod;
  notes?: string;
  processedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
