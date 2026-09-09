import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-camera',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="relative w-full h-[320px] rounded-[32px] overflow-hidden bg-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] border-[4px] border-gray-900 animate-fade-in group">
      <!-- Flux vidéo -->
      <video #videoElement autoplay playsinline class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"></video>
      <canvas #canvasElement class="hidden"></canvas>
      
      <!-- Grille de visée (Design Premium) -->
      <div class="absolute inset-0 pointer-events-none border-[1px] border-white/10 flex flex-col justify-between">
        <div class="flex justify-between w-full h-full">
          <div class="border-r-[1px] border-white/10 w-1/3"></div>
          <div class="border-r-[1px] border-white/10 w-1/3"></div>
        </div>
        <div class="absolute inset-0 flex flex-col justify-between w-full h-full">
          <div class="border-b-[1px] border-white/10 h-1/3"></div>
          <div class="border-b-[1px] border-white/10 h-1/3"></div>
        </div>
        <!-- Réticule central -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-[2px] border-white/30 rounded-full flex items-center justify-center">
          <div class="w-1 h-1 bg-white/80 rounded-full"></div>
        </div>
      </div>

      <!-- Header de la caméra (Glassmorphism) -->
      <div class="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-center px-4">
        <div class="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-white text-[11px] font-bold tracking-wider uppercase">Direct</span>
        </div>
      </div>
      
      <!-- Footer de la caméra avec Bouton de capture -->
      <div class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
        <button 
          (click)="capture()"
          class="relative w-[72px] h-[72px] bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center active:scale-90 transition-all duration-300 border-[3px] border-white/40 hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div class="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center shadow-inner group-active:scale-95 transition-transform">
            <div class="w-[48px] h-[48px] border-[2px] border-gray-200 rounded-full"></div>
          </div>
        </button>
      </div>

      <!-- Message d'erreur -->
      <div *ngIf="error" class="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm text-white p-6 text-center">
        <div class="flex flex-col items-center gap-3">
          <iconify-icon icon="fluent-emoji-flat:warning" class="text-[40px]"></iconify-icon>
          <span class="text-[14px] font-bold">{{ error }}</span>
        </div>
      </div>
    </div>
  `
})
export class LiveCameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  
  @Output() imageCaptured = new EventEmitter<string>();
  
  error: string | null = null;
  private stream: MediaStream | null = null;

  async ngOnInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (err) {
      this.error = "Impossible d'accéder à la caméra.";
    }
  }

  capture() {
    if (!this.stream) return;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      this.imageCaptured.emit(base64Image);
    }
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
