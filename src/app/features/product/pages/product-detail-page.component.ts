import { Component, inject, computed, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FormatSelectorComponent } from '../../../shared/components/format-selector/format-selector.component';
import { ProductFormat } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, FormatSelectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="min-h-screen bg-gray-50 pb-8 font-sans animate-fade-in" *ngIf="product()">
      <!-- Header -->
      <header class="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-40 shadow-sm">
        <button (click)="goBack()" class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-[17px] font-black text-gray-900 leading-none">Détails du Produit</h1>
        <button class="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#00a859]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </button>
      </header>

      <!-- Product Emoji Section -->
      <div class="bg-gradient-to-b from-gray-50 to-white px-4 pt-12 pb-10 flex flex-col justify-center items-center rounded-b-[40px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-8 relative border-b border-gray-100">
        <div class="text-[110px] leading-none mb-4 drop-shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <ng-container *ngIf="isImage(); else iconify">
            <img [src]="product()?.icon" [alt]="product()?.name" class="w-32 h-32 object-contain" />
          </ng-container>
          <ng-template #iconify>
            <iconify-icon [icon]="product()?.icon || 'twemoji:package'"></iconify-icon>
          </ng-template>
        </div>
        <!-- Status Badge -->
        <div class="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 w-max">
          @if ((product()?.price || 0) > (product()?.officialPriceCap || 0)) {
            <div class="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-full text-[13px] font-black shadow-md flex items-center gap-2">
              <span class="flex w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
              Prix abusif détecté
            </div>
          } @else {
            <div class="bg-green-50 text-green-700 border border-green-200 px-5 py-2 rounded-full text-[13px] font-black shadow-md flex items-center gap-2">
              <span class="flex w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Prix conforme
            </div>
          }
        </div>
      </div>

      <!-- Details Section -->
      <div class="px-5 mt-10">
        <div class="mb-6 text-center">
          <h2 class="text-[28px] font-black text-gray-900 leading-tight tracking-tight">{{ product()?.name }}</h2>
          <div class="mt-4 flex flex-wrap gap-2 justify-center">
            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">{{ product()?.category }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <!-- Prix moyen constaté -->
          <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <p class="text-[12px] text-gray-500 font-black uppercase mb-1.5 text-center tracking-wide">Prix constaté</p>
            <p class="text-[22px] font-black" [class.text-red-600]="(product()?.price || 0) > (product()?.officialPriceCap || 0)" [class.text-gray-900]="(product()?.price || 0) <= (product()?.officialPriceCap || 0)">
              {{ product()?.price }} FCFA
            </p>
          </div>
          <!-- Plafond Légal -->
          <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[24px] p-5 shadow-sm border border-blue-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 opacity-[0.07] pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-24 h-24 text-blue-900">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6v6.25a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h3.75V6a.75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <p class="text-[12px] text-blue-800 font-black uppercase mb-1.5 text-center tracking-wide relative z-10">Plafond Légal</p>
            <p class="text-[22px] font-black text-blue-950 relative z-10">{{ product()?.officialPriceCap }} FCFA</p>
          </div>
        </div>

        <!-- Information additionnelle -->
        <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
          <h3 class="text-[17px] font-black text-gray-900 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 text-[#00a859]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            À propos de ce produit
          </h3>
          <p class="text-[14px] text-gray-600 leading-relaxed font-medium">
            Le prix de ce produit est réglementé par l'État du Sénégal. Le prix plafond légal est fixé à <strong class="text-gray-900 font-black">{{ product()?.officialPriceCap }} FCFA</strong>. Si vous constatez un prix supérieur dans un commerce, vous pouvez le signaler.
          </p>
          
          <div class="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
             <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
               </svg>
             </div>
             <div>
               <p class="text-[12px] text-gray-500 font-medium">Points de vente vérifiés</p>
               <p class="text-[14px] font-black text-gray-900">{{ product()?.shopCount }} boutiques</p>
             </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pb-4">
           <button (click)="openFormatSelector()" class="flex-1 bg-red-50 text-red-600 border border-red-200 font-black text-[16px] py-4 rounded-[20px] transition-colors shadow-sm flex items-center justify-center gap-2 hover:bg-red-100 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Signaler
           </button>
           <button (click)="goToMap()" class="flex-1 bg-[#00a859] text-white font-black text-[16px] py-4 rounded-[20px] transition-colors shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] hover:bg-[#00904c] active:scale-95 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              Points de vente
           </button>
        </div>
      </div>
      
      <!-- Selecteur de format (Bottom Sheet) -->
      <app-format-selector
        [visible]="isFormatSelectorVisible()"
        [productName]="product()?.name || ''"
        [productIcon]="product()?.icon || 'twemoji:package'"
        [formats]="product()?.formats || []"
        [selectedFormatId]="selectedFormatId()"
        (close)="isFormatSelectorVisible.set(false)"
        (formatSelected)="onFormatSelected($event)"
        (reportClick)="onReportFormat($event)">
      </app-format-selector>
    </div>

    <!-- Error State -->
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6" *ngIf="!product()">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <h2 class="text-[18px] font-black text-gray-900 mb-2">Produit introuvable</h2>
      <p class="text-[13px] text-gray-500 text-center mb-6">Le produit que vous cherchez n'existe pas ou a été retiré.</p>
      <button (click)="goBack()" class="bg-[#00a859] text-white font-bold text-[14px] px-6 py-3 rounded-xl shadow-md">
        Retour à l'accueil
      </button>
    </div>
  `
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private productService = inject(ProductService);

  isFormatSelectorVisible = signal(false);
  selectedFormatId = signal<string>('');

  product = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.productService.getAllProducts().find(p => p.id === id);
  });

  isImage(): boolean {
    const icon = this.product()?.icon;
    return icon ? (icon.startsWith('http') || icon.startsWith('/')) : false;
  }

  goBack() {
    this.location.back();
  }

  openFormatSelector() {
    const p = this.product();
    if (p && p.formats && p.formats.length > 0) {
      if (!this.selectedFormatId()) {
        this.selectedFormatId.set(p.formats[0].id);
      }
      this.isFormatSelectorVisible.set(true);
    } else {
      this.goToReports();
    }
  }

  onFormatSelected(format: ProductFormat) {
    this.selectedFormatId.set(format.id);
  }

  onReportFormat(formatId: string) {
    const p = this.product();
    const format = p?.formats?.find(f => f.id === formatId);
    this.router.navigate(['/reports'], { 
      queryParams: { 
        productId: p?.id,
        productName: p?.name,
        formatId: formatId,
        formatName: format?.label
      }
    });
  }

  goToReports() {
    this.router.navigate(['/reports'], { 
      queryParams: { 
        productId: this.product()?.id,
        productName: this.product()?.name
      }
    });
  }

  goToMap() {
    this.router.navigate(['/map']);
  }
}
