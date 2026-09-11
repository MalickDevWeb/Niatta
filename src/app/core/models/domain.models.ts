export type ReportStatus = 'pending' | 'under_review' | 'confirmed' | 'rejected';

export interface Product {
  id: string;
  name: string;
  slug: string;
  unit: string;
  categoryName?: string;
  imageUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  city?: string;
  neighborhood?: string;
  imageUrl?: string;
  photos?: string[];
}

export interface PriceObservation {
  id: string;
  productId: string;
  storeId: string;
  price: number;
  status: ReportStatus;
  observedAt: string;
}
