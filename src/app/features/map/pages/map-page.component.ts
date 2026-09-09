import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { useRegion } from '../../../core/hooks/use-region';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, SearchBarComponent],
  template: `
    <div class="h-screen bg-white font-sans flex flex-col relative overflow-hidden animate-fade-in">
      
      <!-- Header / Search Bar -->
      <header class="absolute top-0 left-0 right-0 z-40 px-4 pt-10 pb-2 pointer-events-none">
        <div class="pointer-events-auto flex flex-col gap-3">
          <!-- Search Input -->
          <app-search-bar placeholder="Rechercher un produit..."></app-search-bar>
          <!-- Filter Pills -->
          <div class="flex overflow-x-auto no-scrollbar gap-2 pb-1 pointer-events-auto">
            <button 
              (click)="setFilter('Tous')"
              [ngClass]="activeFilter() === 'Tous' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap shadow-sm border transition-colors">
              Tous
            </button>
            <button 
              (click)="setFilter('À proximité')"
              [ngClass]="activeFilter() === 'À proximité' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap shadow-sm border transition-colors">
              À proximité
            </button>
            <button 
              (click)="setFilter('Meilleurs prix')"
              [ngClass]="activeFilter() === 'Meilleurs prix' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap shadow-sm border transition-colors">
              Meilleurs prix
            </button>
          </div>
        </div>
      </header>

      <!-- Map Area -->
      <div class="flex-grow w-full relative z-0 bg-[#e8f2eb]">
        <!-- 
          In a real application, you would initialize Leaflet or Google Maps here.
          For the UI mockup, we'll use a map background image and absolute positioned pins.
        -->
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map" class="w-full h-full object-cover opacity-60 grayscale-[30%] sepia-[20%] hue-rotate-[-30deg]" />
        
        <!-- Pins Overlay -->
        <div class="absolute inset-0">
          
          <!-- Green Pin 1 (Top Left) -->
          <div (click)="selectShop({name: 'Boutique Chez Aliou', price: 600, distance: '500 m', rating: '4.8', address: 'Rue 10, Médina'})" class="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-full cursor-pointer z-20">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-10 drop-shadow-md hover:scale-110 transition-transform">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
              <circle cx="20" cy="20" r="7" fill="white"/>
            </svg>
          </div>
          
          <!-- Green Pin 2 (Top Right) -->
          <div (click)="selectShop({name: 'Supérette ABC', price: 650, distance: '1,2 km', rating: '4.3', address: 'Rue 12, HLM'})" class="absolute top-[25%] right-[30%] -translate-x-1/2 -translate-y-full cursor-pointer z-20">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-10 drop-shadow-md hover:scale-110 transition-transform">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
              <circle cx="20" cy="20" r="7" fill="white"/>
            </svg>
          </div>

          <!-- Green Pin 3 (Bottom Left) -->
          <div (click)="selectShop({name: 'Marché Castors', price: 550, distance: '800 m', rating: '4.5', address: 'Allées Castors'})" class="absolute bottom-[40%] left-[20%] -translate-x-1/2 -translate-y-full cursor-pointer z-20">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-10 drop-shadow-md hover:scale-110 transition-transform">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
              <circle cx="20" cy="20" r="7" fill="white"/>
            </svg>
          </div>

          <!-- Active Blue Pin (Center) -->
          <div (click)="selectShop({name: 'Supermarché Casino', price: 650, distance: '1,5 km', rating: '4.1', address: 'Plateau'})" class="absolute top-[50%] left-[55%] -translate-x-1/2 -translate-y-full z-30 cursor-pointer">
            <!-- Pulsing effect -->
            <div class="absolute inset-0 bg-[#2f80ed] rounded-full animate-ping opacity-40 h-[20px] w-[20px] top-[15px] left-[10px]"></div>
            
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-12 drop-shadow-lg relative">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#2f80ed"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
              <circle cx="20" cy="20" r="3" fill="#2f80ed"/>
            </svg>
          </div>
          
          <!-- Map Text (Dynamic Region) -->
          <div class="absolute bottom-[45%] right-[20%] text-[18px] font-black text-gray-500/80 uppercase tracking-widest drop-shadow-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {{ region.selectedRegion() }}
          </div>
        </div>
      </div>

      <!-- Floating Shop Details Card (Visible when pin is tapped) -->
      <div *ngIf="selectedShop()" class="absolute bottom-[90px] left-4 right-4 bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-40 animate-fade-in-up">
        
        <!-- Close button -->
        <button (click)="closeCard()" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1 transition-colors z-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-start gap-3">
          <!-- Shop Image -->
          <div class="w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=200&q=80" alt="Supermarché" class="w-full h-full object-cover" />
          </div>
          
          <!-- Shop Info -->
          <div class="flex-grow pr-6">
            <h3 class="font-black text-[16px] text-gray-900 leading-tight">{{ selectedShop()?.name }}</h3>
            
            <div class="flex items-center gap-1 mt-1">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-[#fcc917]">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                </svg>
                <span class="text-[12px] text-gray-900 font-bold ml-1">{{ selectedShop()?.rating }}</span>
                <span class="text-[11px] text-gray-400 font-medium ml-1">(Avis clients)</span>
              </div>
            </div>
            
            <p class="text-[12px] text-gray-500 font-medium mt-1 leading-snug">
              {{ selectedShop()?.address }}
            </p>
            
            <div class="flex items-center justify-between mt-3">
              <p class="text-[18px] font-black text-[#00b050]">{{ selectedShop()?.price }} FCFA</p>
              <div class="flex items-center text-[11px] text-gray-500 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 mr-1 text-[#2f80ed]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {{ selectedShop()?.distance }}
              </div>
            </div>
          </div>
        </div>
        
        <button (click)="showDetails()" class="w-full bg-[#007f43] hover:bg-[#006030] text-white text-[13px] font-bold py-3 rounded-[12px] mt-4 transition-colors">
          Voir les détails
        </button>
      </div>

      <!-- Shared Bottom Navigation -->
      <app-bottom-nav currentRoute="map"></app-bottom-nav>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
  `]
})
export class MapPageComponent {
  selectedShop = signal<any>(null);
  activeFilter = signal<string>('Tous');
  region = useRegion();

  constructor(private router: Router) {}

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  selectShop(shop: any) {
    this.selectedShop.set(shop);
  }

  closeCard() {
    this.selectedShop.set(null);
  }

  showDetails() {
    this.router.navigate(['/shop', '1']);
  }
}
