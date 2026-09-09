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
      <div *ngIf="!authService.currentUser()" class="px-5 pt-12 flex flex-col items-center justify-center min-h-[85vh]">
        
        <h1 class="text-[36px] font-black text-gray-900 text-center leading-tight tracking-tight mb-8">
          {{ isLoginMode() ? 'Connexion' : 'Inscription' }}
        </h1>

        <div class="w-full flex flex-col gap-4">
          
          <div class="w-full h-[64px] rounded-[24px] bg-white border-[3px] border-gray-100 flex items-center px-5 focus-within:border-[#00a859] transition-colors shadow-sm">
            <input type="tel" [(ngModel)]="phone" placeholder="Numéro de téléphone" 
                   class="w-full h-full bg-transparent outline-none text-[18px] font-black text-gray-900 placeholder-gray-300">
          </div>

          <div class="w-full h-[64px] rounded-[24px] bg-white border-[3px] border-gray-100 flex items-center px-5 focus-within:border-[#00a859] transition-colors shadow-sm">
            <input type="password" [(ngModel)]="password" placeholder="Mot de passe" 
                   class="w-full h-full bg-transparent outline-none text-[18px] font-black text-gray-900 placeholder-gray-300">
          </div>
          
          <div *ngIf="!isLoginMode()" class="w-full h-[64px] rounded-[24px] bg-white border-[3px] border-gray-100 flex items-center px-5 focus-within:border-[#00a859] transition-colors shadow-sm">
            <input type="password" [(ngModel)]="confirmPassword" placeholder="Confirmer mot de passe" 
                   class="w-full h-full bg-transparent outline-none text-[18px] font-black text-gray-900 placeholder-gray-300">
          </div>

          <button (click)="submit()" [disabled]="isLoading()" 
                  class="w-full mt-2 bg-gray-900 text-white rounded-[24px] h-[64px] text-[20px] font-black shadow-lg active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-2">
            <span *ngIf="isLoading()" class="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoginMode() ? 'Valider' : 'Créer le compte' }}
          </button>
          
        </div>

        <button (click)="isLoginMode.set(!isLoginMode())" class="mt-8 text-[16px] font-black text-gray-400 active:text-gray-900 transition-colors tracking-tight">
          {{ isLoginMode() ? 'Je n\\'ai pas de compte' : 'J\\'ai déjà un compte' }}
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
