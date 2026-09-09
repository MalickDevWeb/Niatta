import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 font-sans animate-fade-in">
      
      <!-- NOT LOGGED IN STATE -->
      <div *ngIf="!authService.currentUser()" class="px-6 pt-16 pb-12 flex flex-col justify-center min-h-[85vh] bg-white rounded-b-[40px] shadow-sm mb-6">
        
        <!-- Logo -->
        <div class="flex justify-center mb-10">
          <div class="flex items-center gap-3">
            <div class="w-8 h-10 bg-[#00a859] rounded-tl-full rounded-tr-full rounded-br-full relative flex items-center justify-center shadow-sm">
                <div class="w-3 h-3 bg-[#fcc917] rounded-full"></div>
            </div>
            <div>
              <h1 class="text-2xl font-black text-[#0f3d23] leading-none tracking-tight">Juste Prix</h1>
              <p class="text-[10px] tracking-[0.25em] text-[#00a859] font-bold uppercase mt-1">Sénégal</p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-black text-[#0f3d23] text-center mb-8">
          {{ isLoginMode() ? 'Se connecter' : 'Créer un compte' }}
        </h2>

        <div class="w-full flex flex-col gap-5">
          
          <!-- Phone Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Téléphone</label>
              <input type="tel" [(ngModel)]="phone" placeholder="77 000 00 00" 
                     class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300">
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
              <input type="password" #passInput [(ngModel)]="password" placeholder="••••" maxlength="4" inputmode="numeric" pattern="[0-9]*" 
                     class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300">
            </div>
            <button type="button" (click)="passInput.type = passInput.type === 'password' ? 'text' : 'password'" class="text-gray-400 hover:text-[#00a859] transition-colors ml-2 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
          
          <!-- Confirm Password Field Premium -->
          <div *ngIf="!isLoginMode()" class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider">Confirmer mot de passe</label>
              <input type="password" #confirmInput [(ngModel)]="confirmPassword" placeholder="••••" maxlength="4" inputmode="numeric" pattern="[0-9]*" 
                     class="w-full bg-transparent outline-none text-[17px] font-black text-gray-800 placeholder-gray-300">
            </div>
            <button type="button" (click)="confirmInput.type = confirmInput.type === 'password' ? 'text' : 'password'" class="text-gray-400 hover:text-[#00a859] transition-colors ml-2 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>

          <button (click)="submit()" [disabled]="isLoading()" 
                  class="w-full mt-4 bg-[#007f43] hover:bg-[#006030] text-white rounded-[20px] h-[64px] text-[17px] font-black shadow-[0_8px_20px_rgba(0,127,67,0.25)] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
            <span *ngIf="isLoading()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoginMode() ? 'Valider' : 'S\\'inscrire' }}
          </button>
          
        </div>

        <div class="flex items-center gap-4 my-6">
          <div class="flex-grow h-[1px] bg-gray-200"></div>
          <span class="text-[12px] font-bold text-gray-400">ou</span>
          <div class="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <button (click)="isLoginMode.set(!isLoginMode())" class="w-full bg-white border border-[#007f43] text-[#007f43] font-bold py-4 rounded-[14px] hover:bg-gray-50 transition-colors text-[15px]">
          {{ isLoginMode() ? 'Créer un compte' : 'J\\'ai déjà un compte' }}
        </button>
      </div>

      <!-- LOGGED IN STATE -->
      <div *ngIf="authService.currentUser() as user">
        <!-- Header / Profil Infos -->
        <div class="bg-white rounded-b-[40px] shadow-sm px-6 pt-12 pb-8 mb-6 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-[#00a859] opacity-10 rounded-full blur-2xl"></div>
          <div class="absolute top-10 -left-10 w-24 h-24 bg-[#00a859] opacity-10 rounded-full blur-xl"></div>

          <div class="flex items-center gap-5 relative z-10">
            <div class="w-[80px] h-[80px] bg-gradient-to-br from-[#00a859] to-[#008f4c] rounded-full p-[3px] shadow-md">
              <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-[35px]">
                🧑🏾‍🦱
              </div>
            </div>
            <div>
              <h1 class="text-[24px] font-black text-gray-900 leading-tight">{{ user.name }}</h1>
              <p class="text-[14px] font-bold text-gray-500 mt-1">{{ user.phone }}</p>
              <div class="inline-flex items-center gap-1.5 mt-2 bg-yellow-100 text-yellow-700 font-bold text-[12px] px-3 py-1 rounded-full">
                <span class="text-[14px]">⭐</span> Super Veilleur
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="px-5 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <span class="text-[32px] mb-1">📢</span>
              <span class="text-[22px] font-black text-gray-900">{{ user.observationsCount || 0 }}</span>
              <span class="text-[12px] font-bold text-gray-500">Signalements</span>
            </div>
            <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <span class="text-[32px] mb-1">🏆</span>
              <span class="text-[22px] font-black text-gray-900">{{ (user.observationsCount || 0) * 10 }}</span>
              <span class="text-[12px] font-bold text-gray-500">Points gagnés</span>
            </div>
          </div>
        </div>

        <!-- Menu Options -->
        <div class="px-5 flex flex-col gap-3">
          <!-- Section 3 -->
          <div class="bg-white rounded-[28px] p-2 shadow-sm border border-gray-100">
            <button (click)="logout()" class="w-full flex items-center justify-between p-4 active:bg-gray-50 rounded-[20px] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[20px] text-red-500">
                  🚪
                </div>
                <span class="text-[16px] font-bold text-red-500">Se déconnecter</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <app-bottom-nav currentRoute="profile"></app-bottom-nav>
    </div>
  `
})
export class ProfilePageComponent {
  authService = inject(AuthService);
  
  isLoginMode = signal(true);
  isLoading = signal(false);

  phone = '';
  password = '';
  confirmPassword = '';

  submit() {
    if (!this.phone || !this.password || (!this.isLoginMode() && !this.confirmPassword)) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }

    if (!this.isLoginMode() && this.password !== this.confirmPassword) {
      this.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);

    if (this.isLoginMode()) {
      this.authService.login(this.phone, this.password).subscribe({
        next: () => this.isLoading.set(false),
        error: (err) => {
          this.isLoading.set(false);
          this.showError(err.error?.error || 'Erreur de connexion');
        }
      });
    } else {
      this.authService.register('Utilisateur', this.phone, this.password).subscribe({
        next: () => this.isLoading.set(false),
        error: (err) => {
          this.isLoading.set(false);
          this.showError(err.error?.error || "Erreur d'inscription");
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  private showError(msg: string) {
    Swal.fire({
      title: 'Erreur',
      text: msg,
      icon: 'error',
      confirmButtonText: "D'accord",
      customClass: {
        popup: 'rounded-[32px] shadow-2xl p-4 border-none',
        title: 'text-[20px] font-black text-gray-800 mt-2',
        htmlContainer: 'text-[15px] text-gray-500 font-medium',
        actions: 'w-full mt-4 px-2',
        confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.6)'
    });
  }
}
