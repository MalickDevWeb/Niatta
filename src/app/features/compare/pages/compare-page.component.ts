import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { useCompare } from '../../../core/hooks/use-compare';
import { useRegion } from '../../../core/hooks/use-region';

@Component({
  selector: 'app-compare-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-white pb-24 font-sans animate-fade-in">
      <!-- Header with Back Button -->
      <header class="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <button class="text-[#0f3d23]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div class="w-8 h-10 bg-[#00a859] rounded-tl-full rounded-tr-full rounded-br-full relative flex items-center justify-center shadow-sm">
              <div class="w-3 h-3 bg-[#fcc917] rounded-full"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 leading-none tracking-tight">Juste Prix</h1>
            <div class="flex items-center mt-0.5">
              <select 
                [ngModel]="region.selectedRegion()" 
                (ngModelChange)="region.selectRegion($event)"
                class="text-[10px] tracking-[0.1em] text-[#00a859] font-bold uppercase bg-transparent outline-none cursor-pointer appearance-none pr-3"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=%22%2300a859%22 height=%2214%22 viewBox=%220 0 24 24%22 width=%2214%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/></svg>'); background-repeat: no-repeat; background-position-x: 100%; background-position-y: 1px;"
              >
                @for (r of region.regions; track r) {
                  <option [value]="r">{{ r }}</option>
                }
              </select>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button class="relative text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button class="text-[#0f3d23]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Search Bar -->
      <div class="px-4 mt-2 mb-4">
        <div class="relative flex items-center w-full h-12 rounded-[16px] bg-white border-2 border-gray-100 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-[#00a859] mr-2 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input 
            class="peer h-full w-full outline-none text-[13px] text-gray-800 placeholder-gray-400 font-medium bg-transparent" 
            type="text" 
            placeholder="Rechercher un produit (ex : riz, huile, lait...)" 
          />
          <button class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Compare Banner -->
      <div class="mx-4 mb-8 rounded-[16px] overflow-hidden relative bg-[#e6f6ed] flex items-center p-4 shadow-sm border border-[#d6ebe0]">
        <div class="w-14 h-14 rounded-full bg-[#007f43] flex items-center justify-center flex-shrink-0 z-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
          </svg>
        </div>
        <div class="ml-4 z-10">
          <h2 class="text-[17px] font-black text-[#0f3d23] leading-tight">Comparer les prix</h2>
          <p class="text-[12px] text-[#295c42] font-medium leading-snug mt-0.5">Trouvez le meilleur prix parmi<br>les différents points de vente.</p>
        </div>
        <div class="absolute right-[-10px] top-[-5px] w-[140px] opacity-90 z-0">
          <img src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=300&q=80" class="mix-blend-multiply" alt="Panier de courses" style="clip-path: circle(45% at 50% 50%);">
        </div>
      </div>

      <!-- Produits comparés -->
      <div class="px-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="bg-[#007f43] p-1.5 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
              </svg>
            </div>
            <div>
              <h2 class="text-[17px] font-black text-gray-900 leading-tight">Produits comparés</h2>
              <p class="text-[11px] text-gray-500 font-medium">Voici les prix actuels pour ce produit dans différents points de vente.</p>
            </div>
          </div>
          <button class="bg-[#e6f7ed] text-[#00b050] text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center hover:bg-[#d6ebe0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Modifier
          </button>
        </div>

        <!-- Horizontal scroll of items using @for -->
        <div class="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-4 px-4">
          @for (product of compare.products(); track product.id) {
            <div 
              (click)="compare.selectProduct(product)"
              [class]="product.id === compare.selectedProduct().id ? 
                'bg-white rounded-[16px] border-2 border-[#00b050] p-3 w-[150px] flex-shrink-0 flex flex-col relative shadow-[0_4px_15px_-3px_rgba(0,176,80,0.15)] cursor-pointer' : 
                'bg-white rounded-[16px] border border-gray-100 p-3 w-[150px] flex-shrink-0 flex flex-col relative shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] cursor-pointer'"
            >
              @if (product.id === compare.selectedProduct().id) {
                <div class="absolute top-2 right-2 bg-[#00b050] rounded-full w-5 h-5 flex items-center justify-center z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              } @else {
                <div class="absolute top-2 right-2 border-2 border-gray-300 rounded-full w-5 h-5 z-10"></div>
              }
              
              <div class="w-full h-[90px] flex items-center justify-center mb-3">
                <img [src]="product.imageUrl" [alt]="product.name" class="max-h-full object-contain" />
              </div>
              <h3 class="font-bold text-[13px] text-gray-900 leading-snug">{{ product.name }}</h3>
              <p class="text-[11px] text-gray-500 mt-0.5 font-medium mb-3">{{ product.weight }} • {{ product.brand }}</p>
              
              @if (product.id === compare.selectedProduct().id) {
                <button class="w-full bg-[#00b050] text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Produit sélectionné
                </button>
              } @else {
                <button class="w-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Sélectionner
                </button>
              }
            </div>
          }
        </div>
      </div>

      <!-- Comparaison des prix Table using @for -->
      <div class="px-4 mt-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="bg-[#0f3d23] p-1.5 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h2 class="text-[17px] font-black text-gray-900 leading-tight">Comparaison des prix</h2>
          </div>
          <button (click)="compare.toggleSort()" class="bg-[#e6f7ed] text-[#00b050] text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-1" [class.rotate-180]="!compare.isSortAscending()">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            Trier par prix
          </button>
        </div>

        <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#f8f9fb] border-b border-gray-100">
                <th class="py-2.5 px-3 text-[11px] font-semibold text-gray-500 w-[35%]">Point de vente</th>
                <th class="py-2.5 px-2 text-[11px] font-semibold text-gray-500 w-[20%]">Prix</th>
                <th class="py-2.5 px-2 text-[11px] font-semibold text-gray-500 w-[15%] hidden sm:table-cell">Distance</th>
                <th class="py-2.5 px-2 text-[11px] font-semibold text-gray-500 w-[15%]">Disponibilité</th>
                <th class="py-2.5 px-3 text-[11px] font-semibold text-gray-500 text-center w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (comp of compare.comparisons(); track comp.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-3">
                    <div class="flex items-start gap-2">
                      <div [class]="comp.shop.logoType === 'green' ? 
                        'w-7 h-7 rounded-full bg-[#e6f7ed] flex items-center justify-center flex-shrink-0 text-[#00b050]' : 
                        'w-7 h-7 rounded-full bg-[#f8f9fb] flex items-center justify-center flex-shrink-0 text-gray-500 border border-gray-200'">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-[12px] font-bold text-[#2d3748] leading-tight">{{ comp.shop.name }}</p>
                        <p class="text-[10px] text-gray-500">{{ comp.shop.location }}</p>
                        <div class="flex items-center mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-[#fcc917]">
                            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-[10px] text-gray-500 font-medium ml-1">{{ comp.shop.rating }} ({{ comp.shop.reviewCount }} avis)</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-2">
                    <p class="text-[13px] font-black leading-none" 
                      [class.text-[#00b050]]="comp.id === compare.bestPrice()?.id && comp.price <= compare.selectedProduct().officialPriceCap!" 
                      [class.text-red-600]="comp.price > compare.selectedProduct().officialPriceCap!"
                      [class.text-gray-900]="comp.price <= compare.selectedProduct().officialPriceCap! && comp.id !== compare.bestPrice()?.id">
                      {{ comp.price }} {{ comp.currency }}
                    </p>
                    <p class="text-[10px] text-gray-500 mt-1">/ {{ compare.selectedProduct().weight }}</p>
                  </td>
                  <td class="py-3 px-2 hidden sm:table-cell">
                    <div class="flex items-center text-[11px] text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {{ comp.shop.distanceKm }} km
                    </div>
                  </td>
                  <td class="py-3 px-2">
                    @if (comp.stockStatus === 'En stock') {
                      <div class="inline-flex items-center border border-[#00b050]/30 bg-[#e6f7ed] text-[#00b050] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 mr-0.5">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                        En stock
                      </div>
                    } @else if (comp.stockStatus === 'Stock limité') {
                      <div class="inline-flex items-center border border-yellow-300 bg-yellow-50 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 mr-0.5">
                          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                        </svg>
                        Stock limité
                      </div>
                    } @else {
                      <div class="inline-flex items-center border border-red-300 bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Rupture
                      </div>
                    }
                  </td>
                  <td class="py-3 px-3 text-right">
                    <div class="flex flex-col gap-1 items-end">
                      @if (comp.price > compare.selectedProduct().officialPriceCap!) {
                        <button (click)="openReportModal(comp.shop.id)" class="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 mr-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Signaler
                        </button>
                      } @else {
                        <button [class]="comp.id === compare.bestPrice()?.id ? 
                          'bg-[#00b050] hover:bg-[#009040] text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center transition-colors shadow-sm' : 
                          'bg-white border border-gray-200 hover:bg-gray-50 text-[#00b050] text-[11px] font-bold px-3 py-1.5 rounded-full inline-flex items-center transition-colors'">
                          Voir
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Best Price Sticky Banner using @if -->
      @if (compare.bestPrice(); as best) {
        <div class="mx-4 mt-6 bg-[#e6f7ed] rounded-xl p-3 flex items-center justify-between border border-[#cbebd6] shadow-sm cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#007f43] text-white flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.829 1.58-1.995 1.53-.277 2.67-1.597 2.67-3.187 0-1.782-1.445-3.25-3.225-3.25-1.815 0-3.3 1.488-3.3 3.3v.092" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-bold text-[#0f3d23] leading-tight">Le meilleur prix pour ce produit est à {{ best.price }} {{ best.currency }} chez {{ best.shop.name }}</p>
              
              @if (compare.worstPrice(); as worst) {
                @if (worst.price > best.price) {
                  <p class="text-[10px] text-[#295c42] mt-0.5">Économisez {{ worst.price - best.price }} {{ best.currency }} par rapport au prix le plus élevé !</p>
                }
              }
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-[#007f43] flex-shrink-0 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      }
      
      <!-- Report Modal -->
      @if (reportingShopId()) {
        <div class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div class="bg-red-500 px-4 py-3 flex justify-between items-center">
              <h3 class="text-white font-bold text-[15px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Signaler une infraction
              </h3>
              <button (click)="closeReportModal()" class="text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="p-4">
              <p class="text-[12px] text-gray-600 mb-4">Vous vous apprêtez à signaler ce point de vente pour non-respect du prix plafond légal ({{ compare.selectedProduct().officialPriceCap }} FCFA). Merci de nous aider à protéger les consommateurs.</p>
              
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Preuve photo (Optionnel mais recommandé)</label>
              <div class="border-2 border-dashed border-gray-200 rounded-xl h-20 mb-4 flex flex-col items-center justify-center bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-[#00a859] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <span class="text-[10px] font-medium">Ajouter une photo du prix</span>
              </div>
              
              <button (click)="submitReport()" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] py-2.5 rounded-xl transition-colors">
                Envoyer le signalement
              </button>
            </div>
          </div>
        </div>
      }

      <app-bottom-nav currentRoute="search"></app-bottom-nav>
    </div>
  `
})
export class ComparePageComponent {
  compare = useCompare();
  region = useRegion();
  
  reportingShopId = signal<string | null>(null);

  openReportModal(shopId: string) {
    this.reportingShopId.set(shopId);
  }

  closeReportModal() {
    this.reportingShopId.set(null);
  }

  submitReport() {
    // Call an API here in the future
    alert('Signalement envoyé avec succès aux autorités ! Merci.');
    this.closeReportModal();
  }
}
