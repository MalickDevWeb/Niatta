import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-field-agent-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden animate-fade-in">
      
      <!-- Fake Status Bar for PWA feeling (Green at top) -->
      <div class="h-[env(safe-area-inset-top,44px)] w-full bg-[#00a859] absolute top-0 left-0 right-0 z-50"></div>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col px-6 pt-[calc(env(safe-area-inset-top,44px)+60px)] pb-12 relative z-10">
        <!-- Logo -->
        <div class="flex justify-center mb-10">
          <div class="flex items-center gap-3">
            <div class="w-[38px] h-[46px] bg-[#00a859] rounded-tl-full rounded-tr-full rounded-br-full relative flex items-center justify-center shadow-sm">
                <div class="w-3.5 h-3.5 bg-[#fcc917] rounded-full mt-1"></div>
            </div>
            <div>
              <h1 class="text-[26px] font-black text-[#0f3d23] leading-none tracking-tight">Juste Prix</h1>
              <p class="text-[11px] tracking-[0.25em] text-[#00a859] font-bold uppercase mt-1">Espace Agent</p>
            </div>
          </div>
        </div>

        <h2 class="text-[28px] font-black text-[#0f3d23] text-center mb-3">Connexion Agent</h2>
        <p class="text-[15px] text-gray-500 text-center mb-10 px-2 font-medium leading-relaxed">
          Accédez à votre espace pour vérifier les signalements sur le terrain.
        </p>

        <!-- Form -->
        <form class="space-y-4" (ngSubmit)="login()">
          <!-- Phone Field -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-white border border-gray-200 px-5 focus-within:border-[#00a859] focus-within:ring-4 focus-within:ring-[#00a859]/10 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div class="w-10 h-10 flex items-center justify-center mr-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Téléphone</label>
              <input type="tel" [(ngModel)]="phone" name="phone" placeholder="770000001" 
                     class="w-full bg-transparent outline-none text-[16px] font-bold text-gray-800 placeholder-gray-300">
            </div>
          </div>

          <!-- Password Field -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-white border border-gray-200 px-5 focus-within:border-[#00a859] focus-within:ring-4 focus-within:ring-[#00a859]/10 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div class="w-10 h-10 flex items-center justify-center mr-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Mot de passe</label>
              <input type="password" #passInput [(ngModel)]="password" name="password" placeholder="••••"
                     class="w-full bg-transparent outline-none text-[16px] font-bold text-gray-800 placeholder-gray-300">
            </div>
            <button type="button" (click)="passInput.type = passInput.type === 'password' ? 'text' : 'password'" class="text-gray-400 hover:text-[#00a859] transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
          
          <div *ngIf="error" class="text-red-500 text-sm font-medium text-center mt-2">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button type="submit" [disabled]="loading" class="w-full mt-8 bg-[#009a4e] hover:bg-[#008242] active:scale-[0.98] text-white font-bold h-[56px] rounded-[16px] transition-all shadow-[0_8px_20px_rgba(0,168,89,0.25)] text-[16px] disabled:opacity-50">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>

      <!-- Bottom Flag pattern matching original -->
      <div class="h-[80px] w-full relative z-0 mt-auto">
        <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover" preserveAspectRatio="none">
          <path d="M0 80H400V30C400 30 300 0 200 30C100 60 0 30 0 30V80Z" fill="#005128"/>
          <path d="M0 80H400V50C400 50 300 15 200 50C100 85 0 50 0 50V80Z" fill="#00a859"/>
        </svg>
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-100 z-10">
          <div class="flex w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm">
            <div class="w-1/3 bg-[#00853f]"></div>
            <div class="w-1/3 bg-[#fdef42]"></div>
            <div class="w-1/3 bg-[#e31b23]"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FieldAgentLoginPageComponent {
  phone = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router) {}

  async login() {
    if (!this.phone || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    this.loading = true;
    this.error = '';

    try {
      const response = await fetch(`${environment.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: this.phone,
          password: this.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth_token', data.data.token);
        if (data.data.user.roles.some((r: any) => r.role.slug === 'homme_terrain')) {
          this.router.navigate(['/homme-terrain']);
        } else {
          this.error = "Accès refusé. Vous n'êtes pas un agent terrain.";
        }
      } else {
        this.error = data.error || 'Identifiants incorrects';
      }
    } catch (err) {
      this.error = 'Erreur de connexion. Veuillez réessayer.';
    } finally {
      this.loading = false;
    }
  }
}
