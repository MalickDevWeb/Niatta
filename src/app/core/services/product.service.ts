import { Injectable, signal } from '@angular/core';
import { IProductService, Product } from '../interfaces/product.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements IProductService {
  private productsSignal = signal<Product[]>([]);

  constructor(private apiService: ApiService) {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.apiService.get<Product[]>('/products').subscribe({
      next: (response) => {
        if (response.success) {
          this.productsSignal.set(response.data);
        }
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  getAllProducts(): Product[] {
    return this.productsSignal();
  }

  getFilteredProducts(category: string, query: string): Product[] {
    let filtered = this.productsSignal();
    
    if (category !== 'Tous') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    const q = query.toLowerCase().trim();
    if (q !== '') {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        p.formats?.some(f => f.label.toLowerCase().includes(q))
      );
    }
    
    return filtered;
  }
}
