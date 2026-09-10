export interface ProductFormat {
  id: string;
  label: string;
  unit: string;
  weight?: string | null;
  imageUrl?: string | null;
  officialPriceCap?: number | null;
  price: number;
  shopCount: number;
}

export interface Product {
  id: string;
  icon: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  // Format par défaut (affiché sur la carte)
  defaultFormatId: string;
  price: number;
  unit: string;
  officialPriceCap?: number | null;
  // Tous les formats disponibles (pour le sélecteur)
  formats: ProductFormat[];
  shopCount?: number;
}

export interface IProductService {
  getAllProducts(): Product[];
  getFilteredProducts(category: string, query: string): Product[];
}
