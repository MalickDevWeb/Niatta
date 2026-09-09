import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaInstallService } from '../../../core/services/pwa-install.service';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="pwaService.showInstallPrompt()" class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center px-4 pb-6 pt-4 pointer-events-none">
      
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto transition-opacity animate-fade-in" (click)="pwaService.dismissPrompt()"></div>
      
      <!-- Modal / Bottom Sheet -->
      <div class="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl pointer-events-auto transform transition-all animate-slide-up border-[4px] border-white ring-1 ring-gray-100">
        
        <!-- Close button -->
        <button (click)="pwaService.dismissPrompt()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>

        <!-- Icon -->
        <div class="w-16 h-16 bg-gradient-to-br from-[#00a859] to-[#008f4c] rounded-[20px] flex items-center justify-center shadow-lg mb-5 p-[2px]">
          <div class="w-full h-full bg-white rounded-[18px] flex items-center justify-center text-[30px]">
            📱
          </div>
        </div>

        <h2 class="text-[24px] font-black text-gray-900 leading-tight tracking-tight mb-2">Installez l'App !</h2>
        <p class="text-[15px] font-medium text-gray-500 mb-6 leading-relaxed">
          Ajoutez Niatta à votre écran d'accueil pour signaler les prix plus rapidement et sans connexion internet.
        </p>

        <!-- iOS Instructions -->
        <div *ngIf="pwaService.isIOS()" class="bg-gray-50 rounded-[20px] p-4 border border-gray-100 mb-2">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500 font-bold">1</div>
            <span class="text-[14px] font-bold text-gray-700">Appuyez sur <span class="text-blue-500 inline-flex align-middle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" /></svg></span> (Partager)</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500 font-bold">2</div>
            <span class="text-[14px] font-bold text-gray-700">Choisissez <span class="bg-gray-200 px-2 py-0.5 rounded-md text-gray-900">Sur l'écran d'accueil</span></span>
          </div>
        </div>

        <!-- Android / Standard Button -->
        <button *ngIf="!pwaService.isIOS()" (click)="pwaService.installPwa()" class="w-full bg-[#00a859] text-white rounded-[24px] h-[60px] text-[18px] font-black shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Installer l'application
        </button>

      </div>
    </div>
    <style>
      @keyframes slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-up {
        animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    </style>
  `
})
export class PwaInstallPromptComponent {
  public pwaService = inject(PwaInstallService);
}
