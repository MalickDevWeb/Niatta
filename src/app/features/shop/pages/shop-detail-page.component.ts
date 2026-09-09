import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-shop-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 font-sans animate-fade-in">
      <!-- Header Image & Back Button -->
      <div class="relative h-64 w-full">
        <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80" alt="Supermarché" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <button (click)="goBack()" class="absolute top-10 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 hover:bg-white/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>

        <!-- Shop Title overlay -->
        <div class="absolute bottom-6 left-5 right-5 text-white">
          <div class="flex items-center gap-2 mb-1">
            <span class="bg-[#00a859] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Supermarché</span>
            <div class="flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
              <span class="text-[#fcc917] text-[12px]">⭐</span>
              <span class="text-white font-bold text-[12px] ml-1">4.3</span>
            </div>
          </div>
          <h1 class="text-[28px] font-black leading-tight drop-shadow-md">Supermarché ABC</h1>
          <p class="text-[14px] text-gray-200 font-medium flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Rue 12, HLM • À 1,2 km
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="px-5 mt-6 grid grid-cols-2 gap-3">
        <button class="bg-white border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform text-[#00a859]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
          </svg>
          <span class="font-bold text-[12px] text-gray-700">Itinéraire</span>
        </button>
        <button class="bg-white border-2 border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform text-[#00a859]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-bold text-[12px] text-gray-700">Signaler ce magasin</span>
        </button>
      </div>

      <!-- Info Card -->
      <div class="px-5 mt-6">
        <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <h3 class="font-black text-[16px] text-gray-900 mb-4">Informations</h3>
          
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-[14px] text-gray-900">Ouvert actuellement</p>
              <p class="text-[12px] text-gray-500">Ferme à 22:00</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-50 text-[#00a859] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.496-4.096-7.092-6.917l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-[14px] text-gray-900">+221 33 800 00 00</p>
              <p class="text-[12px] text-gray-500">Contact boutique</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Table -->
      <div class="px-5 mt-6 mb-8">
        <h3 class="font-black text-[18px] text-gray-900 mb-4 tracking-tight">Prix relevés dans ce magasin</h3>
        
        <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          
          <!-- Item 1 -->
          <div class="p-4 border-b border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-[50px] h-[50px] bg-gray-50 rounded-2xl flex items-center justify-center text-[28px]">
                🍚
              </div>
              <div>
                <p class="font-bold text-[15px] text-gray-900">Riz brisé (1kg)</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span class="text-[11px] font-bold text-green-600">Conforme</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-[16px] text-gray-900">600 FCFA</p>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="p-4 border-b border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-[50px] h-[50px] bg-gray-50 rounded-2xl flex items-center justify-center text-[28px]">
                🛢️
              </div>
              <div>
                <p class="font-bold text-[15px] text-gray-900">Huile végétale (1L)</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span class="text-[11px] font-bold text-red-600">Abusif (Plafond 1000)</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-[16px] text-red-600">1150 FCFA</p>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-[50px] h-[50px] bg-gray-50 rounded-2xl flex items-center justify-center text-[28px]">
                🧊
              </div>
              <div>
                <p class="font-bold text-[15px] text-gray-900">Sucre (1kg)</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span class="text-[11px] font-bold text-green-600">Conforme</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-[16px] text-gray-900">600 FCFA</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ShopDetailPageComponent {
  constructor(private location: Location) {}
  
  goBack() {
    this.location.back();
  }
}
