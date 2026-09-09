export interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string;
  imageUrl: string;
  officialPriceCap?: number;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  logoType?: 'green' | 'gray'; // For UI mock purposes
}

export interface PriceComparison {
  id: string;
  productId: string;
  shop: Shop;
  price: number;
  currency: string;
  inStock: boolean;
  stockStatus: 'En stock' | 'Stock limité' | 'Rupture';
}
