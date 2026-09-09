import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden animate-fade-in">
      <!-- Decorative background -->
      <div class="absolute bottom-0 left-0 right-0 h-[150px] opacity-10">
        <svg viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full preserve-3d">
          <path d="M0 150H400V50C400 50 300 0 200 50C100 100 0 50 0 50V150Z" fill="#00a859"/>
        </svg>
      </div>

      <!-- Header with back button -->
      <header class="flex justify-between items-center px-4 py-4 bg-transparent relative z-10">
        <button (click)="goBack()" class="text-gray-900 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col px-6 pt-4 pb-12 relative z-10">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-10 bg-[#00a859] rounded-tl-full rounded-tr-full rounded-br-full relative flex items-center justify-center shadow-sm">
                <div class="w-3 h-3 bg-[#fcc917] rounded-full"></div>
            </div>
            <div>
              <h1 class="text-xl font-black text-[#0f3d23] leading-none tracking-tight">Juste Prix</h1>
              <p class="text-[10px] tracking-[0.2em] text-[#00a859] font-bold uppercase mt-0.5">Sénégal</p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-black text-[#0f3d23] text-center mb-2">Se connecter</h2>
        <p class="text-[13px] text-gray-500 text-center mb-8 px-4 font-medium leading-relaxed">
          Accédez à votre compte pour signaler un prix et suivre vos signalements.
        </p>

        <!-- Form -->
        <form class="space-y-4">
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
              <input type="password" placeholder="••••••••" class="w-full bg-transparent outline-none text-[14px] font-medium text-gray-900 placeholder-gray-400" />
              <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me & Forgot Password -->
          <div class="flex items-center justify-between pt-2 pb-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <div class="w-5 h-5 rounded-[6px] border-2 border-[#00a859] bg-[#00a859] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <span class="text-[12px] font-medium text-gray-700">Se souvenir de moi</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button type="button" (click)="login()" class="w-full bg-[#007f43] hover:bg-[#006030] text-white font-bold py-4 rounded-2xl transition-colors shadow-[0_4px_14px_0_rgba(0,127,67,0.39)]">
            Se connecter
          </button>
          
          <div class="text-center mt-4 mb-6">
             <a href="#" class="text-[12px] font-bold text-[#007f43] hover:underline">Mot de passe oublié ?</a>
          </div>

          <div class="flex items-center gap-4 my-6">
            <div class="flex-grow h-px bg-gray-200"></div>
            <span class="text-[12px] font-bold text-gray-400">ou</span>
            <div class="flex-grow h-px bg-gray-200"></div>
          </div>

          <!-- Create Account Button -->
          <button type="button" (click)="goToRegister()" class="w-full bg-white border-2 border-[#007f43] text-[#007f43] font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">
            Créer un compte
          </button>
        </form>
      </div>

      <!-- Bottom Flag pattern matching original -->
      <div class="h-[60px] w-full relative z-0 mt-auto">
        <svg viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover" preserveAspectRatio="none">
          <path d="M0 60H400V30C400 30 300 0 200 30C100 60 0 30 0 30V60Z" fill="#005128"/>
          <path d="M0 60H400V45C400 45 300 15 200 45C100 75 0 45 0 45V60Z" fill="#00a859"/>
        </svg>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-80 z-10">
          <div class="flex w-3.5 h-2.5 rounded-[2px] overflow-hidden">
            <div class="w-1/3 bg-[#00853f]"></div>
            <div class="w-1/3 bg-[#fdef42]"></div>
            <div class="w-1/3 bg-[#e31b23]"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  login() {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
