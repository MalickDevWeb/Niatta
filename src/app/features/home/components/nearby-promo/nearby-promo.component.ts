import { Component } from '@angular/core';

@Component({
  selector: 'app-nearby-promo',
  standalone: true,
  template: `
    <div class="mx-4 mt-8 mb-28 bg-[#eef7f3] rounded-[20px] p-4 flex items-center justify-between cursor-pointer border border-[#d6ebe0]">
      <div class="flex items-center gap-4">
        <div class="bg-[#007f43] w-14 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8 relative z-10">
                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            <div class="absolute bottom-[-15px] right-[-15px] w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
        </div>
        <div>
          <h3 class="font-bold text-gray-900 text-[14px] mb-1">Trouvez les points de vente proches</h3>
          <p class="text-[12px] text-gray-500 font-medium">Découvrez les commerces autour de vous.</p>
        </div>
      </div>
      <div class="text-gray-400 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>
  `
})
export class NearbyPromoComponent {}
