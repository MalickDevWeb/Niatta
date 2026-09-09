export interface Product {
  id: string;
  icon: string;
  name: string;
  unit: string;
  price: number;
  category: string;
  officialPriceCap?: number;
  brand?: string;
  weight?: string;
  shopCount?: number;
}

export interface IProductService {
  getAllProducts(): Product[];
  getFilteredProducts(category: string, query: string): Product[];
}
