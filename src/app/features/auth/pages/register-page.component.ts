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
      <header class="flex items-center px-4 pt-12 pb-6 bg-white relative z-10">
        <button (click)="goBack()" class="text-gray-900 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 class="text-2xl font-black text-[#0f3d23]">Créer un compte</h2>
      </header>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col px-6 pb-12 pt-2 relative z-10 overflow-y-auto">
        <p class="text-[14px] text-gray-500 mb-8 font-medium leading-relaxed pr-4">
          Inscrivez-vous pour contribuer à une meilleure transparence des prix.
        </p>

        <!-- Form -->
        <form class="space-y-4">
          <!-- Name Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Nom complet</label>
              <input type="text" placeholder="Votre nom" class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300" />
            </div>
          </div>

          <!-- Phone Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Téléphone</label>
              <input type="tel" placeholder="77 000 00 00" class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300" />
            </div>
          </div>

          <!-- Password Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Mot de passe</label>
              <input type="password" #passInput placeholder="4 chiffres" maxlength="4" inputmode="numeric" pattern="[0-9]*" class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300" />
            </div>
            <button type="button" (click)="passInput.type = passInput.type === 'password' ? 'text' : 'password'" class="text-gray-400 hover:text-[#00a859] transition-colors ml-2 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3 pt-4 pb-4">
            <div class="mt-0.5">
              <div class="w-5 h-5 rounded-[6px] border-2 border-[#00a859] bg-[#00a859] flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <p class="text-[13px] font-medium text-gray-600 leading-relaxed">
              J'accepte les <a href="#" class="text-[#007f43] font-bold hover:underline">conditions d'utilisation</a> et la <a href="#" class="text-[#007f43] font-bold hover:underline">politique de confidentialité</a>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="button" (click)="register()" class="w-full bg-[#007f43] hover:bg-[#006030] text-white font-bold py-4 rounded-[14px] transition-colors shadow-sm text-[15px]">
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
