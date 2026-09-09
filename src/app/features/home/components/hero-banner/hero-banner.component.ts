import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  template: `
    <div class="mx-4 mt-2 mb-6 rounded-2xl overflow-hidden relative bg-[#e6f2eb]">
      <div class="absolute right-[-15%] top-0 h-full w-[70%] bg-cover bg-center z-0 opacity-100" style="background-image: url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'); mask-image: linear-gradient(to right, transparent, black 40%); -webkit-mask-image: linear-gradient(to right, transparent, black 40%); mix-blend-mode: multiply;"></div>
      
      <div class="relative z-10 p-5 w-[75%]">
        <div class="inline-flex items-center bg-[#cce6d6] text-[#1c6c3f] text-[10px] font-black px-2.5 py-1 rounded-full mb-3 tracking-wide">
          <span class="mr-1.5 text-xs">🇸🇳</span> Des prix justes pour tous !
        </div>
        
        <h2 class="text-2xl font-black text-[#0f3d23] leading-[1.15] mb-2.5">
          Trouvez, comparez<br/>et faites le bon choix !
        </h2>
        
        <p class="text-[12px] text-[#295c42] font-medium leading-relaxed max-w-[210px]">
          Découvrez les prix des produits près de chez vous et dans tout le Sénégal.
        </p>
      </div>
    </div>
  `
})
export class HeroBannerComponent {}
