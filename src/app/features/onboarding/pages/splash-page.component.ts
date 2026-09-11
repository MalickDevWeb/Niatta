import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-splash-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative min-h-screen bg-[#0b4527] overflow-hidden font-sans">
      
      <!-- Background Image Carousel -->
      <div class="absolute inset-0 z-0 flex transition-transform duration-700 ease-in-out"
           [style.transform]="'translateX(-' + currentSlide * 100 + '%)'">
        <div *ngFor="let slide of slides" class="w-screen h-screen flex-shrink-0 relative">
          <img [src]="slide.image" 
               class="w-full h-[70%] object-cover object-top opacity-90 mix-blend-overlay" />
          <div class="absolute inset-0 bg-gradient-to-b from-[#0b4527]/20 via-[#0b4527]/60 to-[#0b4527]"></div>
        </div>
      </div>

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col h-screen">
        
        <!-- Header / Logo -->
        <div class="pt-12 px-6 flex flex-col items-center relative w-full">
          <!-- Passer Button -->
          <button (click)="getStarted()" class="absolute top-12 right-6 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-[13px] font-bold transition-all shadow-md border border-white/20 z-20 active:scale-95">
            Passer
          </button>
          
          <div class="flex items-center gap-3 mt-10">
            <div class="relative w-10 h-12">
              <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-lg">
                <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
                <path d="M20 5C11.716 5 5 11.716 5 20C5 30 20 42 20 42C20 42 35 30 35 20C35 11.716 28.284 5 20 5Z" fill="#fcc917"/>
                <path d="M20 12L22.245 18.91H29.51L23.633 23.18L25.878 30.09L20 25.82L14.122 30.09L16.367 23.18L10.49 18.91H17.755L20 12Z" fill="#e31b23"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <h1 class="text-[32px] font-black text-white leading-none tracking-tight">Juste Prix</h1>
              <p class="text-[12px] tracking-[0.35em] text-white font-bold uppercase mt-1">Sénégal</p>
            </div>
          </div>
        </div>

        <div class="flex-grow"></div>

        <!-- Glassmorphism Text Card -->
        <div class="px-6 pb-12 w-full max-w-md mx-auto">
          <div class="relative h-[200px] w-full">
            <div *ngFor="let slide of slides; let i = index" 
                 class="absolute inset-0 w-full transition-all duration-500 ease-in-out"
                 [ngClass]="{
                   'opacity-100 translate-x-0 scale-100 z-10': currentSlide === i, 
                   'opacity-0 translate-x-12 scale-95 z-0': currentSlide < i, 
                   'opacity-0 -translate-x-12 scale-95 z-0': currentSlide > i
                 }">
              
              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-8 shadow-2xl h-full flex flex-col justify-center">
                <h2 class="text-[26px] font-black text-white mb-3 leading-tight text-shadow-sm">
                  {{slide.title}}
                </h2>
                <p class="text-white/90 text-[15px] leading-relaxed font-medium">
                  {{slide.description}}
                </p>
              </div>
            </div>
          </div>

          <!-- Navigation Controls -->
          <div class="flex items-center justify-between mt-8 px-2">
            <!-- Dots -->
            <div class="flex gap-2">
              <button *ngFor="let slide of slides; let i = index" 
                      (click)="setSlide(i)"
                      class="h-2 rounded-full transition-all duration-300 ease-out"
                      [ngClass]="currentSlide === i ? 'w-8 bg-[#fcc917] shadow-[0_0_10px_rgba(252,201,23,0.5)]' : 'w-2 bg-white/30 hover:bg-white/60'">
              </button>
            </div>

            <!-- Next Button -->
            <button *ngIf="currentSlide < slides.length - 1" 
                    (click)="nextSlide()"
                    class="w-14 h-14 rounded-full bg-white text-[#0b4527] flex items-center justify-center hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 ml-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            
            <!-- Start Button -->
            <button *ngIf="currentSlide === slides.length - 1" 
                    (click)="getStarted()"
                    class="bg-[#fcc917] text-[#0b4527] font-black px-8 py-4 rounded-[20px] flex items-center hover:bg-[#ffe066] hover:scale-105 active:scale-95 transition-all shadow-xl">
              Commencer
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5 ml-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SplashPageComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoSlideInterval: any;

  slides: Slide[] = [
    {
      title: "Face à la cherté de la vie au Sénégal",
      description: "Parce que chaque franc compte aujourd'hui, nous vous aidons à préserver votre pouvoir d'achat au quotidien.",
      image: "assets/images/splash-bg.jpg"
    },
    {
      title: "Trouvez le Juste Prix",
      description: "Comparez les prix des denrées de première nécessité (Riz, Huile, Sucre...) et trouvez les boutiques respectueuses.",
      image: "assets/images/products/riz.jpg" // Using the gorgeous rice image we generated
    },
    {
      title: "Une initiative citoyenne",
      description: "Signalez les prix abusifs. Ensemble, aidons la communauté à acheter au bon prix et en toute transparence !",
      image: "assets/images/products/pain.jpg" // Using the beautiful bread image
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      if (this.currentSlide < this.slides.length - 1) {
        this.currentSlide++;
      }
    }, 4500); // Auto slide every 4.5s
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.stopAutoSlide();
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  setSlide(index: number) {
    this.stopAutoSlide();
    this.currentSlide = index;
  }

  getStarted() {
    this.router.navigate(['/home']);
  }
}

