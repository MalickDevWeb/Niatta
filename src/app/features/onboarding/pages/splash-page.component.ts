import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen font-sans relative flex flex-col overflow-hidden" style="background-color: #0b4527;">
      <!-- Top Image (Woman at market) -->
      <div class="absolute top-0 left-0 right-0 h-[65%] z-0">
        <!-- We use an Unsplash image resembling a smiling African woman at a market -->
        <img src="assets/images/splash-bg.jpg" 
             alt="Femme souriante au marché" 
             class="w-full h-full object-cover object-top opacity-90"
             style="clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);">
        <!-- Gradient overlay to blend image into the dark green background -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b4527]/60 to-[#0b4527]"></div>
      </div>

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col h-screen">
        
        <!-- Logo Section -->
        <div class="pt-16 px-8 flex flex-col items-center">
          <div class="flex items-center gap-3">
            <!-- Logo Icon (Map Pin with flag colors) -->
            <div class="relative w-10 h-12">
              <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-md">
                <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
                <path d="M20 5C11.716 5 5 11.716 5 20C5 30 20 42 20 42C20 42 35 30 35 20C35 11.716 28.284 5 20 5Z" fill="#fcc917"/>
                <!-- Small red star in the middle -->
                <path d="M20 12L22.245 18.91H29.51L23.633 23.18L25.878 30.09L20 25.82L14.122 30.09L16.367 23.18L10.49 18.91H17.755L20 12Z" fill="#e31b23"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <h1 class="text-[32px] font-black text-white leading-none tracking-tight font-sans">Juste Prix</h1>
              <p class="text-[12px] tracking-[0.35em] text-white font-bold uppercase mt-1">Sénégal</p>
            </div>
          </div>
        </div>

        <div class="flex-grow"></div>

        <!-- Bottom Section -->
        <div class="px-6 pb-8 pt-4">
          <h2 class="text-[26px] font-black text-white leading-[1.2] mb-8 w-[95%] text-shadow-sm">
            Comparez les prix,<br>
            trouvez les meilleurs<br>
            commerces près de vous !
          </h2>

          <!-- 3 Icons Section -->
          <div class="flex items-start justify-between mb-8 px-2 relative">
            <!-- Icon 1: Comparer les prix -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <!-- Percent Badge -->
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L15 9M9 9h.01M15 15h.01M12 3c-1.324 0-2.585.34-3.691.939l-1.16-.773a1.5 1.5 0 00-2.121 2.121l.773 1.16A8.966 8.966 0 005 10.144v1.712c0 1.324.34 2.585.939 3.691l-.773 1.16a1.5 1.5 0 002.121 2.121l1.16-.773A8.966 8.966 0 0012 19.856c1.324 0 2.585-.34 3.691-.939l1.16.773a1.5 1.5 0 002.121-2.121l-.773-1.16A8.966 8.966 0 0019 13.856v-1.712c0-1.324-.34-2.585-.939-3.691l.773-1.16a1.5 1.5 0 00-2.121-2.121l-1.16.773A8.966 8.966 0 0012 3z" />
              </svg>
              <p class="text-[12px] text-white font-medium text-center leading-tight">Comparer<br>les prix</p>
            </div>
            
            <!-- Separator -->
            <div class="w-[1px] h-10 bg-white/20 mt-1"></div>
            
            <!-- Icon 2: Trouver des points de vente -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <p class="text-[12px] text-white font-medium text-center leading-tight">Trouver des<br>points de vente</p>
            </div>
            
            <!-- Separator -->
            <div class="w-[1px] h-10 bg-white/20 mt-1"></div>
            
            <!-- Icon 3: Signaler un prix -->
            <div class="flex flex-col items-center gap-3 flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.7V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <p class="text-[12px] text-white font-medium text-center leading-tight">Signaler<br>un prix</p>
            </div>
          </div>

          <!-- Get Started Button -->
          <button 
            (click)="getStarted()"
            class="w-full bg-white text-[#0b4527] font-black py-[18px] rounded-[20px] flex items-center justify-center text-[15px] hover:bg-gray-50 transition-colors shadow-xl"
          >
            Commencer
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <!-- Footer Note -->
          <div class="flex items-center justify-center gap-2 mt-6">
            <div class="flex w-[14px] h-[10px] rounded-[2px] overflow-hidden shadow-sm">
              <div class="w-1/3 bg-[#00853f]"></div>
              <div class="w-1/3 bg-[#fdef42]"></div>
              <div class="w-1/3 bg-[#e31b23]"></div>
            </div>
            <p class="text-[12px] text-white/90 font-medium">Une initiative citoyenne pour des prix plus justes.</p>
          </div>
          
          <!-- Pagination Dots -->
          <div class="flex justify-center items-center gap-2 mt-8 mb-2">
            <div class="w-2 h-2 rounded-full bg-[#fcc917]"></div>
            <div class="w-2 h-2 rounded-full bg-white/20"></div>
            <div class="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SplashPageComponent {
  constructor(private router: Router) {}

  getStarted() {
    this.router.navigate(['/home']);
  }
}
