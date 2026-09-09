import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-[24px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] p-3 w-[160px] flex-shrink-0 flex flex-col">
      <div class="relative w-full h-[130px] bg-[#f8f9fb] rounded-[16px] mb-3 flex items-center justify-center p-2">
        <img [src]="imageUrl" [alt]="name" class="max-h-full max-w-full object-contain mix-blend-multiply" />
        <span *ngIf="discount" class="absolute top-2 right-2 bg-[#00b050] text-white text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
          {{ discount }}
        </span>
      </div>
      
      <h3 class="font-bold text-[14px] text-[#1a1a1a] leading-tight">{{ name }}</h3>
      <p class="text-[12px] text-[#808080] mt-0.5 font-medium">{{ weight }} &bull; {{ brand }}</p>
      
      <div class="mt-2 text-[#00b050] font-black text-[16px] leading-none">
        {{ price }} FCFA
      </div>
      
      <div class="mt-3 flex flex-col gap-1.5">
        <div class="flex items-center text-[#808080] text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1.5 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75Z" />
          </svg>
          <span class="truncate">{{ storeName }}</span>
        </div>
        <div class="flex items-center text-[#808080] text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1.5 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span class="truncate">{{ location }}</span>
        </div>
      </div>
      
      <div class="mt-3 bg-[#e6f7ed] text-[#00b050] text-[12px] font-bold px-2 py-1.5 rounded-[10px] flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
        À {{ distance }}
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() name!: string;
  @Input() weight!: string;
  @Input() brand!: string;
  @Input() price!: string;
  @Input() storeName!: string;
  @Input() location!: string;
  @Input() distance!: string;
  @Input() imageUrl!: string;
  @Input() discount?: string;
}
