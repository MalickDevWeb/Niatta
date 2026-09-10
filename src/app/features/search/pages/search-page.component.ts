import { Component, signal, computed, effect, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { CategoryPillComponent } from '../../../shared/components/category-pill/category-pill.component';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { VoiceRecognitionService } from '../../../core/services/voice-recognition.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, SearchBarComponent, CategoryPillComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="min-h-screen bg-white pb-24 font-sans animate-fade-in">
      
      <!-- Search Header -->
      <header class="sticky top-0 bg-white z-40 px-4 pt-4 pb-3 border-b border-gray-100">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <button (click)="goBack()" class="text-gray-900 flex-shrink-0 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            
            <app-search-bar 
              [value]="searchQuery()"
              [isListening]="voiceService.isListening()"
              [isOfflineMode]="voiceService.isOfflineMode()"
              [voskLoading]="voiceService.voskLoadingState() === 'loading'"
              (valueChange)="setSearchQuery($event)"
              (voiceSearch)="handleVoiceSearch()"
              class="flex-grow">
            </app-search-bar>
          </div>
          
          <!-- Category Pills -->
          <div class="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            <app-category-pill (onClick)="setCategory('Tous')" icon="fluent-emoji-flat:star" label="Tous" [active]="activeCategory() === 'Tous'"></app-category-pill>
            <app-category-pill *ngFor="let cat of categoryService.getCategories()" (onClick)="setCategory(cat.name)" [icon]="cat.icon || 'fluent-emoji-flat:package'" [label]="cat.name" [active]="activeCategory() === cat.name"></app-category-pill>
          </div>
        </div>
      </header>

      <!-- Search Results -->
      <div class="px-4 pt-4">
        <!-- No results message -->
        <div *ngIf="filteredProducts().length === 0 && searchQuery().length > 0" class="flex flex-col items-center justify-center py-12 text-center">
          <div class="text-[48px] mb-4">🔍</div>
          <h3 class="font-black text-[18px] text-gray-900 mb-1">Aucun résultat</h3>
          <p class="text-[14px] text-gray-500 font-medium">Essayez un autre mot ou utilisez le micro 🎙️</p>
        </div>

        <div class="flex flex-col gap-3">
          <!-- Dynamic Result Items -->
          <div *ngFor="let product of filteredProducts()"
            class="flex items-center bg-white rounded-[24px] border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-[#00a859] transition-all"
            (click)="goToProduct(product.id)">
            <div class="w-[70px] h-[70px] rounded-2xl bg-gray-50 p-2 flex-shrink-0 flex items-center justify-center border border-gray-100 text-[40px] drop-shadow-sm leading-none">
              <ng-container *ngIf="product.icon.startsWith('http') || product.icon.startsWith('/'); else iconify">
                <img [src]="product.icon" [alt]="product.name" class="w-full h-full object-contain rounded-md" />
              </ng-container>
              <ng-template #iconify>
                <iconify-icon [attr.icon]="product.icon"></iconify-icon>
              </ng-template>
            </div>
            
            <div class="ml-4 flex-grow flex justify-between items-center">
              <div>
                <h3 class="font-black text-[18px] text-gray-900 leading-tight">{{ product.name }}</h3>
                <p class="text-[13px] text-gray-500 mt-0.5 font-bold mb-1">{{ product.unit }}</p>
                <div class="bg-[#f2fbf5] text-[#00a859] px-3 py-1 rounded-full font-black text-[14px] inline-block border border-[#cbebd6]">
                  {{ product.price }} FCFA
                </div>
              </div>
              <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#00a859]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Shared Bottom Navigation -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `
})
export class SearchPageComponent {
  activeCategory = signal<string>('Tous');
  searchQuery = signal<string>('');

  filteredProducts = computed(() => {
    return this.productService.getFilteredProducts(this.activeCategory(), this.searchQuery());
  });

  constructor(
    private router: Router,
    private productService: ProductService,
    public voiceService: VoiceRecognitionService,
    public categoryService: CategoryService
  ) {
    // Écoute du texte reconnu par la voix
    effect(() => {
      const text = this.voiceService.recognizedText();
      if (text) this.searchQuery.set(text);
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  setCategory(category: string) {
    this.activeCategory.set(category);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  handleVoiceSearch() {
    this.voiceService.isListening() ? this.voiceService.stopListening() : this.voiceService.startListening();
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }
}

