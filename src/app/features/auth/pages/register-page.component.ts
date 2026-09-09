import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden animate-fade-in">
      
      <!-- Header with back button -->
      <header class="flex justify-between items-center px-4 py-4 bg-transparent relative z-10">
        <button (click)="goBack()" class="text-gray-900 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col px-6 pb-12 pt-2 relative z-10 overflow-y-auto">
        <h2 class="text-2xl font-black text-[#0f3d23] mb-2">Créer un compte</h2>
        <p class="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed pr-4">
          Inscrivez-vous pour contribuer à une meilleure transparence des prix.
        </p>

        <!-- Form -->
        <form class="space-y-4">
          <!-- Name Field -->
          <div class="space-y-1.5">
            <label class="text-[12px] font-bold text-gray-700 ml-1">Nom complet</label>
            <div class="relative flex items-center w-full h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 px-4 focus-within:border-[#00a859] focus-within:bg-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-400 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <input type="text" placeholder="Votre nom" class="w-full bg-transparent outline-none text-[14px] font-medium text-gray-900 placeholder-gray-400" />
            </div>
          </div>

          <!-- Phone Field -->
          <div class="space-y-1.5">
            <label class="text-[12px] font-bold text-gray-700 ml-1">Téléphone</label>
            <div class="relative flex items-center w-full h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 px-4 focus-within:border-[#00a859] focus-within:bg-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-400 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <input type="tel" placeholder="+221 77 123 45 67" class="w-full bg-transparent outline-none text-[14px] font-medium text-gray-900 placeholder-gray-400" />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <label class="text-[12px] font-bold text-gray-700 ml-1">Mot de passe</label>
            <div class="relative flex items-center w-full h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 px-4 focus-within:border-[#00a859] focus-within:bg-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-400 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <input type="password" placeholder="Minimum 6 caractères" class="w-full bg-transparent outline-none text-[14px] font-medium text-gray-900 placeholder-gray-400" />
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3 pt-4 pb-6">
            <div class="mt-0.5">
              <div class="w-5 h-5 rounded-[6px] border-2 border-[#00a859] bg-[#00a859] flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <p class="text-[12px] font-medium text-gray-600 leading-relaxed">
              J'accepte les <a href="#" class="text-[#007f43] font-bold hover:underline">conditions d'utilisation</a> et la <a href="#" class="text-[#007f43] font-bold hover:underline">politique de confidentialité</a>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="button" (click)="register()" class="w-full bg-[#007f43] hover:bg-[#006030] text-white font-bold py-4 rounded-2xl transition-colors shadow-[0_4px_14px_0_rgba(0,127,67,0.39)]">
            S'inscrire
          </button>
          
          <div class="text-center mt-6">
             <span class="text-[13px] text-gray-500 font-medium">Déjà un compte ? </span>
             <a href="#" (click)="$event.preventDefault(); goToLogin()" class="text-[13px] font-bold text-[#007f43] hover:underline">Se connecter</a>
          </div>
        </form>
      </div>

    </div>
  `
})
export class RegisterPageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/auth/login']);
  }

  register() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
