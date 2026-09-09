import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSignal = signal<Category[]>([]);

  constructor(private apiService: ApiService) {
    this.fetchCategories();
  }

  private fetchCategories() {
    this.apiService.get<Category[]>('/categories').subscribe({
      next: (response) => {
        if (response.success) {
          this.categoriesSignal.set(response.data);
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCategories(): Category[] {
    return this.categoriesSignal();
  }
}
