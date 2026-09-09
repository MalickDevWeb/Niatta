import { Component, signal, computed, effect, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CameraService } from '../../../core/services/camera.service';
import { AuthService } from '../../../core/services/auth.service';
import { VoiceRecognitionService } from '../../../core/services/voice-recognition.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

import { LiveCameraComponent } from '../../../shared/components/live-camera/live-camera.component';
import { ProductService } from '../../../core/services/product.service';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, LiveCameraComponent, SearchBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="min-h-screen bg-white pb-36 font-sans animate-fade-in relative overflow-x-hidden">
      <!-- Decorative Header Background -->
      <div class="absolute top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-[#e6f9f0] to-white z-0 rounded-b-[40px]"></div>
      
      <div class="relative z-10 px-5 pt-3">
        <form class="flex flex-col gap-4">
          
          <!-- Section 1: Qu'avez-vous acheté ? -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-7 h-7 rounded-full bg-[#00a859] text-white flex items-center justify-center font-black text-[14px] shadow-sm">1</div>
              <h2 class="text-[17px] font-black text-[#0f172a]">Qu'avez-vous acheté ?</h2>
            </div>
            
            <!-- Search Bar with voice -->
            <app-search-bar
              placeholder="Autre produit (texte ou vocal)"
              [value]="searchQuery()"
              [isListening]="voiceService.isListening()"
              [isOfflineMode]="voiceService.isOfflineMode()"
              [voskLoading]="voiceService.voskLoadingState() === 'loading'"
              (valueChange)="setSearchQuery($event)"
              (voiceSearch)="handleVoiceSearch()">
            </app-search-bar>

            <!-- Product Selector - Filtered list -->
            <div *ngIf="searchQuery().length > 0" class="flex flex-col gap-2 mt-3 animate-fade-in">
              <!-- No results -->
              <div *ngIf="filteredProducts().length === 0" class="flex flex-col items-center py-6 text-center">
                <iconify-icon icon="fluent-emoji-flat:magnifying-glass-tilted-left" class="text-[40px] mb-2"></iconify-icon>
                <span class="text-[14px] font-bold text-gray-400">Aucun produit trouvé pour "{{ searchQuery() }}"</span>
              </div>
              <!-- Filtered results as vertical list -->
              <div *ngFor="let p of filteredProducts()" (click)="selectProduct(p.id, p.name)" 
                   [class]="selectedProduct() === p.id 
                      ? 'bg-[#e6f7ed] border-[#00a859] ring-2 ring-[#00a859] ring-offset-1' 
                      : 'bg-white border-gray-100 shadow-sm'"
                   class="border-[2px] rounded-[20px] px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200 active:scale-[0.98]">
                <iconify-icon [icon]="p.icon" class="text-[32px] flex-shrink-0 drop-shadow-sm"></iconify-icon>
                <div class="flex flex-col flex-1">
                  <span [class]="selectedProduct() === p.id ? 'text-[#00a859]' : 'text-gray-800'" class="text-[15px] font-black leading-tight">{{ p.name }}</span>
                  <span class="text-[12px] font-medium text-gray-400 mt-0.5">{{ p.unit }}</span>
                </div>
                <div *ngIf="selectedProduct() === p.id" class="w-6 h-6 rounded-full bg-[#00a859] flex items-center justify-center">
                  <iconify-icon icon="lucide:check" class="text-white text-[14px]"></iconify-icon>
                </div>
              </div>
            </div>

            <!-- Product Selector - Horizontal scroll (when no search) -->
            <div *ngIf="searchQuery().length === 0" class="flex overflow-x-auto gap-3 py-3 pr-4 hide-scrollbar -mx-5 px-5 items-center">
              <div *ngFor="let p of productService.getAllProducts()" (click)="selectProduct(p.id, p.name)" 
                   [class]="selectedProduct() === p.id 
                      ? 'bg-white border-[#00a859] ring-2 ring-[#00a859] ring-offset-2' 
                      : 'bg-white border-gray-100 shadow-sm opacity-90'"
                   class="border-[2px] rounded-[24px] px-3 py-3 w-[90px] h-[100px] flex flex-col items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200">
                <iconify-icon [icon]="p.icon" class="text-[40px] leading-none mb-1 drop-shadow-sm"></iconify-icon>
                <span [class]="selectedProduct() === p.id ? 'text-[#00a859]' : 'text-gray-500'" class="text-[13px] font-black tracking-tight text-center leading-tight">{{p.name}}</span>
              </div>
            </div>

            <!-- Selected product badge -->
            <div *ngIf="selectedProductName()" class="mt-2 flex items-center gap-2 bg-[#e6f7ed] rounded-full px-4 py-2 border border-[#cbebd6]">
              <iconify-icon icon="fluent-emoji-flat:check-mark-button" class="text-[16px]"></iconify-icon>
              <span class="text-[13px] font-black text-[#00a859]">{{ selectedProductName() }}</span>
              <button (click)="clearProduct()" class="ml-auto w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                <iconify-icon icon="lucide:x" class="text-gray-400 text-[12px]"></iconify-icon>
              </button>
            </div>
          </div>

          <!-- Section 2: Combien avez-vous payé ? -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-7 h-7 rounded-full bg-[#00a859] text-white flex items-center justify-center font-black text-[14px] shadow-sm">2</div>
              <h2 class="text-[17px] font-black text-[#0f172a]">Combien avez-vous payé ?</h2>
            </div>
            <div class="w-full h-16 rounded-[20px] bg-white flex items-center px-4 border-2 border-gray-100 shadow-sm focus-within:border-[#00a859] transition-colors">
              <div class="flex items-center justify-center mr-3 shrink-0">
                <iconify-icon icon="fluent-emoji:money-bag" class="text-[32px] drop-shadow-sm"></iconify-icon>
              </div>
              <input class="w-full outline-none text-[22px] text-gray-900 font-black bg-transparent placeholder-gray-300" type="number" placeholder="0" (input)="onPriceChange($event)" />
              <div class="bg-gray-100 px-4 py-2 rounded-xl">
                <span class="text-[14px] font-black text-gray-500">FCFA</span>
              </div>
            </div>
          </div>

          <!-- Section 3: Le problème ? -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-7 h-7 rounded-full bg-[#00a859] text-white flex items-center justify-center font-black text-[14px] shadow-sm">3</div>
              <h2 class="text-[17px] font-black text-[#0f172a]">Le problème ?</h2>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <!-- Option 1 -->
              <div (click)="selectedProblem.set('prix')" 
                   [class]="selectedProblem() === 'prix' ? 'bg-[#fff0f0] border-red-500' : 'bg-white border-gray-100'" 
                   class="relative border-2 rounded-[20px] p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all">
                
                <!-- Checkmark Rouge -->
                <div *ngIf="selectedProblem() === 'prix'" class="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <iconify-icon icon="lucide:check" class="text-white text-[12px] font-bold"></iconify-icon>
                </div>
                
                <iconify-icon icon="fluent-emoji-flat:chart-increasing" class="text-[36px] mb-2 drop-shadow-sm"></iconify-icon>
                <span [class]="selectedProblem() === 'prix' ? 'text-red-600' : 'text-[#475569]'" class="text-[14px] font-black text-center leading-tight">Prix trop cher</span>
              </div>
              
              <!-- Option 2 -->
              <div (click)="selectedProblem.set('cache')" 
                   [class]="selectedProblem() === 'cache' ? 'bg-[#fff7f0] border-orange-500' : 'bg-white border-gray-100'" 
                   class="relative border-2 rounded-[20px] p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all">
                
                <div *ngIf="selectedProblem() === 'cache'" class="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <iconify-icon icon="lucide:check" class="text-white text-[12px] font-bold"></iconify-icon>
                </div>

                <iconify-icon icon="fluent-emoji-flat:see-no-evil-monkey" class="text-[36px] mb-2 drop-shadow-sm"></iconify-icon>
                <span [class]="selectedProblem() === 'cache' ? 'text-orange-600' : 'text-[#475569]'" class="text-[14px] font-black text-center leading-tight">Refus de vendre</span>
              </div>
            </div>
          </div>

          <!-- Section 4: Photo de la boutique -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-7 h-7 rounded-full bg-[#00a859] text-white flex items-center justify-center font-black text-[14px] shadow-sm">4</div>
              <h2 class="text-[17px] font-black text-[#0f172a]">Photo de la boutique (Si possible)</h2>
            </div>
            
            <ng-container *ngIf="!isCameraActive() && !cameraService.capturedImage()">
              <button type="button" (click)="isCameraActive.set(true)" class="relative w-full bg-[#00a859] rounded-[24px] p-3 flex items-center shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-all overflow-hidden group border-2 border-[#00a859]">
                <!-- Decorative Icon Background -->
                <iconify-icon icon="lucide:camera" class="absolute -right-4 -bottom-6 text-[120px] text-[#008f4c] opacity-20"></iconify-icon>
                
                <div class="w-[60px] h-[60px] flex items-center justify-center z-10 shrink-0">
                  <iconify-icon icon="fluent-emoji-flat:camera-with-flash" class="text-[52px] drop-shadow-sm"></iconify-icon>
                </div>
                <div class="flex flex-col ml-4 z-10 text-left flex-1">
                  <span class="text-[18px] font-black text-white leading-tight">Prendre une photo</span>
                  <span class="text-[13px] font-medium text-[#cbebd6] mt-0.5">Authenticité garantie</span>
                </div>
                <div class="w-9 h-9 rounded-full bg-[#008f4c] flex items-center justify-center z-10 shrink-0">
                  <iconify-icon icon="lucide:chevron-right" class="text-white text-[20px]"></iconify-icon>
                </div>
              </button>
            </ng-container>

            <!-- Camera Component -->
            <div *ngIf="isCameraActive()" class="mt-2 animate-fade-in relative z-20">
              <div class="flex justify-between items-center mb-2 px-1">
                <span class="text-[13px] font-black text-[#00a859] bg-[#e6f7ed] px-3 py-1 rounded-full"><span class="animate-pulse mr-1">🔴</span>Enregistrement...</span>
                <button (click)="isCameraActive.set(false)" class="text-[13px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200">Annuler</button>
              </div>
              <app-live-camera (imageCaptured)="onImageCaptured($event)"></app-live-camera>
            </div>

            <!-- Image preview -->
            <div *ngIf="cameraService.capturedImage()" class="mt-2 relative w-full h-[180px] rounded-[24px] border-[3px] border-[#00a859] overflow-hidden shadow-md">
              <img [src]="cameraService.capturedImage()" class="w-full h-full object-cover">
              <button (click)="clearImage()" class="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-red-500 active:scale-90 transition-transform border-[2px] border-red-100">
                <iconify-icon icon="lucide:trash-2" class="text-[20px]"></iconify-icon>
              </button>
              <div class="absolute bottom-3 left-3 bg-[#00a859] text-white text-[11px] font-black px-3 py-1.5 rounded-full flex items-center shadow-md">
                <iconify-icon icon="fluent-emoji-flat:check-mark-button" class="mr-1"></iconify-icon> Capturée
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex flex-col gap-2 mt-1">
            <!-- Location Badge -->
            <div class="h-[56px] bg-[#e6f7ed] rounded-[20px] flex items-center px-4 border border-[#cbebd6] shadow-sm">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <iconify-icon icon="lucide:map-pin" class="text-[20px] text-[#ff0055]"></iconify-icon>
              </div>
              <div class="flex flex-col ml-3 flex-1">
                <span class="text-[15px] font-black text-[#0f172a] leading-tight">Localisation validée</span>
                <span class="text-[12px] font-bold text-[#00a859] leading-tight mt-0.5">Précision GPS forte</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-[#00a859] flex items-center justify-center shadow-sm">
                <iconify-icon icon="lucide:check" class="text-white text-[16px] font-bold"></iconify-icon>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="button" (click)="submitObservation()" [disabled]="isSubmitting()" class="h-[56px] w-full bg-[#ff0033] rounded-[20px] flex items-center px-5 shadow-[0_8px_20px_-6px_rgba(255,0,51,0.5)] active:scale-95 transition-transform group disabled:opacity-50">
              <iconify-icon icon="lucide:siren" class="text-[24px] text-white"></iconify-icon>
              <span class="flex-1 text-center text-[19px] font-black text-white">
                <ng-container *ngIf="isSubmitting()">Envoi...</ng-container>
                <ng-container *ngIf="!isSubmitting()">Envoyer l'alerte</ng-container>
              </span>
              <div class="w-8 h-8 rounded-full bg-[#cc0029] flex items-center justify-center shadow-inner group-active:translate-x-1 transition-transform">
                <iconify-icon icon="lucide:chevron-right" class="text-white text-[18px]"></iconify-icon>
              </div>
            </button>
          </div>

        </form>
      </div>
      <app-bottom-nav currentRoute="reports"></app-bottom-nav>
    </div>
    <style>
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  `
})
export class ReportsPageComponent {
  selectedProduct = signal<string>('');
  selectedProductName = signal<string>('');
  selectedProblem = signal<string>('prix');
  isCameraActive = signal<boolean>(false);
  searchQuery = signal<string>('');
  price = signal<number | null>(null);
  
  isSubmitting = signal<boolean>(false);

  filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (q === '') return [];
    return this.productService.getAllProducts().filter(p => 
      p.name.toLowerCase().includes(q)
    );
  });

  constructor(
    public cameraService: CameraService,
    public voiceService: VoiceRecognitionService,
    public productService: ProductService,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    effect(() => {
      const text = this.voiceService.recognizedText();
      if (text) {
        this.searchQuery.set(text);
        this.selectedProduct.set('');
        this.selectedProductName.set('');
      }
    });
  }

  selectProduct(id: string, name: string) {
    this.selectedProduct.set(id);
    this.selectedProductName.set(name);
  }

  clearProduct() {
    this.selectedProduct.set('');
    this.selectedProductName.set('');
    this.searchQuery.set('');
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
    if (query !== '') {
      this.selectedProduct.set('');
      this.selectedProductName.set('');
    }
  }

  handleVoiceSearch() {
    this.voiceService.isListening() ? this.voiceService.stopListening() : this.voiceService.startListening();
  }

  onImageCaptured(base64: string) {
    this.cameraService.setImage(base64);
    this.isCameraActive.set(false);
  }

  clearImage() {
    this.cameraService.clearImage();
    this.isCameraActive.set(false);
  }
  
  onPriceChange(event: any) {
    this.price.set(event.target.value);
  }

  submitObservation() {
    if (!this.selectedProduct()) {
      Swal.fire({
        title: 'Produit manquant',
        text: 'Veuillez sélectionner un produit avant d\'envoyer l\'alerte.',
        icon: 'warning',
        confirmButtonText: 'D\'accord',
        customClass: {
          popup: 'rounded-[32px] shadow-2xl p-4 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-4 px-2',
          confirmButton: 'w-full bg-gray-900 text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
        },
        buttonsStyling: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
      return;
    }
    
    const currentPrice = this.price();
    if (currentPrice === null || isNaN(currentPrice) || currentPrice <= 0) {
      Swal.fire({
        title: 'Prix invalide',
        text: 'Veuillez indiquer un prix supérieur à 0 FCFA.',
        icon: 'error',
        confirmButtonText: 'Corriger',
        customClass: {
          popup: 'rounded-[32px] shadow-2xl p-4 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-4 px-2',
          confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(255,0,51,0.5)] active:scale-95 transition-transform'
        },
        buttonsStyling: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
      return;
    }
    
    // Check if user is logged in
    if (!this.authService.currentUser()) {
      this.promptForAuth(currentPrice);
      return;
    }

    this.sendToApi(currentPrice);
  }

  private promptForAuth(currentPrice: number) {
    Swal.fire({
      title: 'Qui êtes-vous ?',
      html: `
        <p class="text-[14px] text-gray-500 font-medium mb-5">Créez un compte rapide pour valider votre alerte.</p>
        <div class="flex flex-col gap-4 px-1">
          <input type="text" id="swal-name" placeholder="Votre nom complet" class="w-full bg-gray-50 border-none rounded-[20px] px-5 py-4 text-[16px] font-medium text-gray-900 focus:ring-2 focus:ring-[#00a859] outline-none transition-all" style="margin: 0; box-sizing: border-box;">
          <input type="tel" id="swal-phone" placeholder="Numéro de téléphone" class="w-full bg-gray-50 border-none rounded-[20px] px-5 py-4 text-[16px] font-medium text-gray-900 focus:ring-2 focus:ring-[#00a859] outline-none transition-all" style="margin: 0; box-sizing: border-box;">
          <input type="password" id="swal-password" placeholder="Mot de passe" class="w-full bg-gray-50 border-none rounded-[20px] px-5 py-4 text-[16px] font-medium text-gray-900 focus:ring-2 focus:ring-[#00a859] outline-none transition-all" style="margin: 0; box-sizing: border-box;">
        </div>
      `,
      confirmButtonText: 'Créer et envoyer',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'rounded-[32px] shadow-2xl p-4 border-none',
        title: 'text-[22px] font-black text-gray-900 mt-2',
        actions: 'w-full mt-4 px-2 flex-col gap-2',
        confirmButton: 'w-full m-0 bg-[#00a859] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-transform',
        cancelButton: 'w-full m-0 bg-gray-100 text-gray-700 rounded-[20px] min-h-[56px] flex items-center justify-center font-bold text-[16px] mt-2 active:scale-95 transition-transform'
      },
      buttonsStyling: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;
        const password = (document.getElementById('swal-password') as HTMLInputElement).value;
        
        if (!name || !phone || !password) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
          return false;
        }
        return { name, phone, password };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.isSubmitting.set(true);
        this.authService.register(result.value.name, result.value.phone, result.value.password).subscribe({
          next: () => {
            // Logged in successfully, now send observation
            this.sendToApi(currentPrice);
          },
          error: (err: any) => {
            this.isSubmitting.set(false);
            // Try to login if already registered
            if (err.status === 409) {
              this.authService.login(result.value.phone, result.value.password).subscribe({
                next: () => this.sendToApi(currentPrice),
                error: () => {
                  Swal.fire('Erreur', 'Mot de passe incorrect pour ce numéro.', 'error');
                }
              });
            } else {
              Swal.fire('Erreur', err.error?.error || 'Erreur lors de la création du compte', 'error');
            }
          }
        });
      }
    });
  }

  private sendToApi(currentPrice: number) {
    this.isSubmitting.set(true);
    
    this.apiService.post('/observations', {
      productId: this.selectedProduct(),
      price: currentPrice,
      storeName: 'Boutique (Signalement PWA)',
      city: 'Dakar',
      neighborhood: 'Plateau'
    }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        Swal.fire({
          title: 'Merci !',
          text: 'Votre signalement a bien été envoyé et sera vérifié.',
          icon: 'success',
          confirmButtonText: 'Génial !',
          customClass: {
            popup: 'rounded-[32px] shadow-2xl p-4 border-none',
            title: 'text-[20px] font-black text-gray-800 mt-2',
            htmlContainer: 'text-[15px] text-gray-500 font-medium',
            actions: 'w-full mt-4 px-2',
            confirmButton: 'w-full bg-[#00a859] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-transform'
          },
          buttonsStyling: false,
          backdrop: 'rgba(0,0,0,0.5) blur(4px)'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error(err);
        Swal.fire({
          title: 'Erreur',
          text: err.error?.error || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'Fermer',
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
    });
  }
}
