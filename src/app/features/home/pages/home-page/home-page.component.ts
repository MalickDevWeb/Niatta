import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { CategoryPillComponent } from '../../../../shared/components/category-pill/category-pill.component';
import { HomeProductCard } from '../../components/home-product-card/home-product-card';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { VoiceRecognitionService } from '../../../../core/services/voice-recognition.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, FormsModule, HomeProductCard, SearchBarComponent, CategoryPillComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 font-sans animate-fade-in">
      
      <!-- Ultra-Simple Header & Search -->
      <header class="px-4 pt-6 pb-2 bg-gray-50 sticky top-0 z-40">
        <app-search-bar 
          [value]="searchQuery()"
          [isListening]="voiceService.isListening()"
          [isOfflineMode]="voiceService.isOfflineMode()"
          [voskLoading]="voiceService.voskLoadingState() === 'loading'"
          (valueChange)="setSearchQuery($event)" 
          (voiceSearch)="handleVoiceSearch()">
        </app-search-bar>
      </header>

      <!-- Horizontal Category Scroll -->
      <div class="mt-4 w-full">
        <div class="flex overflow-x-auto gap-3 py-4 items-center hide-scrollbar">
          <!-- Left spacer -->
          <div class="w-1 flex-shrink-0"></div>
          
          <app-category-pill (onClick)="setCategory('Tous')" icon="fluent-emoji-flat:star" label="Tous" [active]="activeCategory() === 'Tous'"></app-category-pill>
          <app-category-pill *ngFor="let cat of categoryService.getCategories()" (onClick)="setCategory(cat.name)" [icon]="cat.icon || 'fluent-emoji-flat:package'" [label]="cat.name" [active]="activeCategory() === cat.name"></app-category-pill>
          
          <!-- Right spacer -->
          <div class="w-1 flex-shrink-0"></div>
        </div>
      </div>

      <!-- Ultra-Simple Product Grid -->
      <div class="px-4 mt-6">
        <h2 class="text-[22px] font-black text-gray-900 mb-4 tracking-tight">Les plus recherchés</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <app-home-product-card 
            *ngFor="let product of filteredProducts()"
            [product]="product"
            (cardClick)="goToProduct($event)"
            (reportClick)="onReportPrice($event)">
          </app-home-product-card>
        </div>
      </div>

      <app-bottom-nav currentRoute="home"></app-bottom-nav>
    </div>
    <style>
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  `
})
export class HomePageComponent {
  isFiltersOpen = signal(false);
  activeCategory = signal<string>('Tous');
  searchQuery = signal<string>('');

  filteredProducts = computed(() => {
    return this.productService.getFilteredProducts(this.activeCategory(), this.searchQuery());
  });

  constructor(
    private router: Router,
    private productService: ProductService,
    public categoryService: CategoryService,
    public voiceService: VoiceRecognitionService
  ) {
    // Écoute de la voix
    effect(() => {
      const text = this.voiceService.recognizedText();
      if (text) this.searchQuery.set(text);
    });
  }

  setCategory(category: string) { this.activeCategory.set(category); }
  setSearchQuery(query: string) { this.searchQuery.set(query); }
  
  handleVoiceSearch() {
    this.voiceService.isListening() ? this.voiceService.stopListening() : this.voiceService.startListening();
  }

  goToProduct(id: string) { this.router.navigate(['/product', id]); }
  
  onReportPrice(event: {productId: string, formatId: string}) {
    const product = this.productService.getAllProducts().find(p => p.id === event.productId);
    const format = product?.formats?.find(f => f.id === event.formatId);
    this.router.navigate(['/reports'], { 
      queryParams: { 
        productId: event.productId,
        productName: product?.name,
        formatId: event.formatId,
        formatName: format?.label
      } 
    });
  }
}
