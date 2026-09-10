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
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, LiveCameraComponent, SearchBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    @keyframes smoothAppear {
      from { opacity: 0; transform: translateY(-10px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-smooth-appear {
      animation: smoothAppear 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
      transform-origin: top;
    }
    @keyframes bounce-success {
      0% { transform: scale(0.95); opacity: 0; }
      50% { transform: scale(1.03); opacity: 1; }
      70% { transform: scale(0.98); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-success {
      animation: bounce-success 500ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
    }
  `],
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
            
            <ng-container *ngIf="!isPreselected()">
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
            </ng-container>

            <!-- Selected product badge -->
            <div *ngIf="selectedProductName()" class="mt-2 flex items-center gap-2 bg-[#e6f7ed] rounded-full px-4 py-2 border border-[#cbebd6]">
              <iconify-icon icon="fluent-emoji-flat:check-mark-button" class="text-[16px]"></iconify-icon>
              <span class="text-[13px] font-black text-[#00a859]">{{ selectedProductName() }}</span>
              <button *ngIf="!isPreselected()" (click)="clearProduct()" class="ml-auto w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
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
              <input class="w-full outline-none text-[22px] text-gray-900 font-black bg-transparent placeholder-gray-300" type="number" min="0" placeholder="0" (input)="onPriceChange($event)" (keydown)="preventNegative($event)" />
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
            <div *ngIf="isCameraActive()" class="mt-2 animate-smooth-appear relative z-20">
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
            <div class="h-[56px] rounded-[20px] flex items-center px-4 border shadow-sm cursor-pointer transition-all active:scale-95"
                 [ngClass]="{
                   'bg-[#e6f7ed] border-[#cbebd6]': locationStatus() === 'success',
                   'bg-[#f8fafc] border-gray-200': locationStatus() === 'pending' || locationStatus() === 'loading',
                   'bg-[#fff0f0] border-red-200': locationStatus() === 'error'
                 }"
                 (click)="locationStatus() !== 'loading' ? requestLocation() : null">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <iconify-icon icon="lucide:map-pin" class="text-[20px]" 
                  [ngClass]="{
                    'text-[#ff0055]': locationStatus() === 'success',
                    'text-gray-400': locationStatus() === 'pending' || locationStatus() === 'loading',
                    'text-red-500': locationStatus() === 'error'
                  }"></iconify-icon>
              </div>
              <div class="flex flex-col ml-3 flex-1">
                <span class="text-[15px] font-black text-[#0f172a] leading-tight">
                  <ng-container *ngIf="locationStatus() === 'pending'">Activer la localisation</ng-container>
                  <ng-container *ngIf="locationStatus() === 'loading'">Recherche GPS...</ng-container>
                  <ng-container *ngIf="locationStatus() === 'success'">Localisation validée</ng-container>
                  <ng-container *ngIf="locationStatus() === 'error'">Localisation échouée</ng-container>
                </span>
                <span class="text-[12px] font-bold leading-tight mt-0.5"
                  [ngClass]="{
                    'text-[#00a859]': locationStatus() === 'success',
                    'text-gray-400': locationStatus() === 'pending' || locationStatus() === 'loading',
                    'text-red-500': locationStatus() === 'error'
                  }">
                  <ng-container *ngIf="locationStatus() === 'pending'">Cliquez pour autoriser</ng-container>
                  <ng-container *ngIf="locationStatus() === 'loading'">Veuillez patienter</ng-container>
                  <ng-container *ngIf="locationStatus() === 'success'">Précision GPS forte</ng-container>
                  <ng-container *ngIf="locationStatus() === 'error'">Cliquez pour réessayer</ng-container>
                </span>
              </div>
              <div *ngIf="locationStatus() === 'success'" class="w-8 h-8 rounded-full bg-[#00a859] flex items-center justify-center shadow-sm">
                <iconify-icon icon="lucide:check" class="text-white text-[16px] font-bold"></iconify-icon>
              </div>
              <div *ngIf="locationStatus() === 'loading'" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm animate-spin">
                <iconify-icon icon="lucide:loader" class="text-gray-500 text-[16px] font-bold"></iconify-icon>
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

      <!-- DISAMBIGUATION MODAL -->
      <div *ngIf="isDisambiguationVisible()" class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white w-full rounded-t-[32px] p-6 pb-10 shadow-2xl animate-smooth-appear max-h-[85vh] overflow-y-auto">
          <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <h2 class="text-[22px] font-black text-gray-900 mb-2">S'agit-il de cette boutique ?</h2>
          <p class="text-[14px] text-gray-500 font-medium mb-6">Nous avons détecté des boutiques à proximité de votre position. Sélectionnez-en une si c'est la bonne.</p>
          
          <div class="flex flex-col gap-3 mb-6">
            <div *ngFor="let store of nearbyStores()" (click)="selectExistingStore(store.id)" class="border-2 border-gray-100 rounded-[20px] p-3 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform hover:border-[#00a859]">
              <div class="w-16 h-16 rounded-[14px] bg-gray-100 flex-shrink-0 overflow-hidden relative">
                <img *ngIf="store.imageUrl" [src]="store.imageUrl" class="w-full h-full object-cover">
                <iconify-icon *ngIf="!store.imageUrl" icon="lucide:store" class="text-[24px] text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></iconify-icon>
              </div>
              <div class="flex flex-col">
                <span class="text-[16px] font-black text-gray-800">{{ store.name }}</span>
                <span class="text-[13px] font-medium text-gray-400 mt-0.5">À environ {{ store.distance_meters | number:'1.0-0' }} mètres</span>
              </div>
              <div class="ml-auto w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <iconify-icon icon="lucide:chevron-right" class="text-gray-400 text-[18px]"></iconify-icon>
              </div>
            </div>
          </div>

          <button (click)="createNewStore()" class="w-full h-[56px] rounded-[20px] bg-gray-100 text-gray-700 font-black text-[16px] flex items-center justify-center active:scale-95 transition-transform">
            Non, c'est une autre boutique
          </button>
        </div>
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

  isPreselected = signal<boolean>(false);
  selectedFormatId = signal<string | null>(null);

  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  locationStatus = signal<'pending' | 'loading' | 'success' | 'error'>('pending');
  
  nearbyStores = signal<any[]>([]);
  isDisambiguationVisible = signal<boolean>(false);
  selectedStoreId = signal<string | null>(null);
  hasDisambiguated = signal<boolean>(false);

  selectExistingStore(storeId: string) {
    this.selectedStoreId.set(storeId);
    this.hasDisambiguated.set(true);
    this.isDisambiguationVisible.set(false);
    this.submitObservation();
  }

  createNewStore() {
    this.selectedStoreId.set(null);
    this.hasDisambiguated.set(true);
    this.isDisambiguationVisible.set(false);
    
    if (!this.cameraService.capturedImage()) {
      import('sweetalert2').then(m => m.default).then(Swal => {
        Swal.fire({
          title: 'Photo requise',
          text: 'Pour signaler une nouvelle boutique, vous devez prendre une photo de sa devanture.',
          icon: 'warning',
          confirmButtonText: 'D\'accord',
          customClass: {
            popup: 'rounded-[32px] shadow-2xl p-6 border-none',
            title: 'text-[20px] font-black text-gray-800 mt-2',
            htmlContainer: 'text-[15px] text-gray-500 font-medium',
            actions: 'w-full mt-6 px-2',
            confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
          },
          buttonsStyling: false
        });
      });
    }
  }

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
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    effect(() => {
      const text = this.voiceService.recognizedText();
      if (text) {
        this.searchQuery.set(text);
        this.selectedProduct.set('');
        this.selectedProductName.set('');
        this.selectedFormatId.set(null);
      }
    });

    const pId = this.route.snapshot.queryParamMap.get('productId');
    const pName = this.route.snapshot.queryParamMap.get('productName');
    const fId = this.route.snapshot.queryParamMap.get('formatId');
    const fName = this.route.snapshot.queryParamMap.get('formatName');
    
    if (pId && pName) {
      this.selectedProduct.set(pId);
      this.selectedProductName.set(fName ? `${pName} (${fName})` : pName);
      if (fId) this.selectedFormatId.set(fId);
      this.isPreselected.set(true);
    }
  }

  ngOnInit() {
    this.requestLocation();
  }

  requestLocation() {
    if (!navigator.geolocation) {
      this.locationStatus.set('error');
      return;
    }
    
    this.locationStatus.set('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.accuracy > 30) {
          // Utiliser Swal pour bloquer en cas de précision insuffisante
          import('sweetalert2').then(m => m.default).then(Swal => {
            Swal.fire({
              title: 'Précision insuffisante',
              text: `Activez votre localisation haute précision pour continuer (Précision actuelle : ${Math.round(position.coords.accuracy)} mètres, requis: < 30m).`,
              icon: 'error',
              confirmButtonText: 'Réessayer',
              customClass: {
                popup: 'rounded-[32px] shadow-2xl p-6 border-none',
                title: 'text-[20px] font-black text-gray-800 mt-2',
                htmlContainer: 'text-[15px] text-gray-500 font-medium',
                actions: 'w-full mt-6 px-2',
                confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
              },
              buttonsStyling: false
            });
          });
          this.locationStatus.set('error');
          return;
        }

        this.latitude.set(position.coords.latitude);
        this.longitude.set(position.coords.longitude);
        this.locationStatus.set('success');
        this.fetchNearbyStores(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location', error);
        this.locationStatus.set('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  fetchNearbyStores(lat: number, lng: number) {
    this.apiService.get(`/stores/nearby?lat=${lat}&lng=${lng}&radius=10`).subscribe({
      next: (res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          this.nearbyStores.set(res.data);
        }
      },
      error: (err) => console.error('Error fetching nearby stores', err)
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
    let val = parseFloat(event.target.value);
    if (val < 0) {
      val = Math.abs(val);
      event.target.value = val;
    }
    this.price.set(val);
  }

  preventNegative(event: KeyboardEvent) {
    if (['-', '+', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
    }
  }

  submitObservation() {
    if (!this.selectedProduct()) {
      Swal.fire({
        title: 'Produit manquant',
        text: 'Veuillez sélectionner un produit avant d\'envoyer l\'alerte.',
        icon: 'warning',
        confirmButtonText: 'D\'accord',
        customClass: {
          popup: 'rounded-[32px] shadow-2xl p-6 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-6 px-2',
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
          popup: 'rounded-[32px] shadow-2xl p-6 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-6 px-2',
          confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(255,0,51,0.5)] active:scale-95 transition-transform'
        },
        buttonsStyling: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
      return;
    }

    if (this.locationStatus() !== 'success') {
      Swal.fire({
        title: 'Localisation requise',
        text: 'Veuillez autoriser et activer l\'accès à votre position GPS pour signaler un prix.',
        icon: 'warning',
        confirmButtonText: 'D\'accord',
        customClass: {
          popup: 'rounded-[32px] shadow-2xl p-6 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-6 px-2',
          confirmButton: 'w-full bg-gray-900 text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
        },
        buttonsStyling: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
      return;
    }
    
    if (this.nearbyStores().length > 0 && !this.hasDisambiguated()) {
      this.isDisambiguationVisible.set(true);
      return;
    }

    if (!this.selectedStoreId() && !this.cameraService.capturedImage()) {
      Swal.fire({
        title: 'Photo requise',
        text: 'Pour signaler une nouvelle boutique, vous devez prendre une photo de sa devanture.',
        icon: 'warning',
        confirmButtonText: 'D\'accord',
        customClass: {
          popup: 'rounded-[32px] shadow-2xl p-6 border-none',
          title: 'text-[20px] font-black text-gray-800 mt-2',
          htmlContainer: 'text-[15px] text-gray-500 font-medium',
          actions: 'w-full mt-6 px-2',
          confirmButton: 'w-full bg-[#ff0033] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-lg active:scale-95 transition-transform'
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
        <p class="text-[14px] text-gray-500 font-medium mb-6">Créez un compte rapide pour valider votre alerte.</p>
        <div class="flex flex-col gap-4 px-1 text-left">
          
          <!-- Name Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300" style="margin:0; box-sizing:border-box;">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider block">Votre nom</label>
              <input type="text" id="swal-name" placeholder="Nom complet" 
                     class="w-full bg-transparent border-none outline-none text-[17px] font-black text-gray-800 placeholder-gray-300 p-0 focus:ring-0">
            </div>
          </div>

          <!-- Phone Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300" style="margin:0; box-sizing:border-box;">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider block">Téléphone</label>
              <input type="tel" id="swal-phone" placeholder="77 000 00 00" 
                     class="w-full bg-transparent border-none outline-none text-[17px] font-black text-gray-800 placeholder-gray-300 p-0 focus:ring-0">
            </div>
          </div>

          <!-- Password Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300" style="margin:0; box-sizing:border-box;">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider block">Mot de passe</label>
              <input type="password" id="swal-password" placeholder="••••" maxlength="4" inputmode="numeric" pattern="[0-9]*"
                     class="w-full bg-transparent border-none outline-none text-[17px] font-black text-gray-800 placeholder-gray-300 p-0 focus:ring-0">
            </div>
            <button type="button" onclick="const p = document.getElementById('swal-password'); p.type = p.type === 'password' ? 'text' : 'password';" class="text-gray-400 hover:text-[#00a859] transition-colors ml-2 p-2 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>

          <!-- Confirm Password Field Premium -->
          <div class="relative flex items-center w-full h-[76px] rounded-[24px] bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] px-5 focus-within:bg-white focus-within:border-[#00a859] focus-within:shadow-[0_8px_30px_rgba(0,168,89,0.12)] transition-all duration-300" style="margin:0; box-sizing:border-box;">
            <div class="w-11 h-11 rounded-[14px] bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div class="flex flex-col justify-center w-full mt-0.5">
              <label class="text-[11px] font-extrabold text-gray-400 mb-0.5 uppercase tracking-wider block">Confirmer mot de passe</label>
              <input type="password" id="swal-confirm-password" placeholder="••••" maxlength="4" inputmode="numeric" pattern="[0-9]*"
                     class="w-full bg-transparent border-none outline-none text-[17px] font-black text-gray-800 placeholder-gray-300 p-0 focus:ring-0">
            </div>
            <button type="button" onclick="const p = document.getElementById('swal-confirm-password'); p.type = p.type === 'password' ? 'text' : 'password';" class="text-gray-400 hover:text-[#00a859] transition-colors ml-2 p-2 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>
      `,
      confirmButtonText: 'Créer et envoyer',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      backdrop: 'rgba(0,0,0,0.6)',
      customClass: {
        popup: 'rounded-[32px] shadow-2xl p-6 border-none',
        title: 'text-[22px] font-black text-gray-900 mt-2',
        actions: 'w-full mt-6 px-2 flex-col gap-2',
        confirmButton: 'w-full m-0 bg-[#00a859] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-transform',
        cancelButton: 'w-full m-0 bg-gray-100 text-gray-700 rounded-[20px] min-h-[56px] flex items-center justify-center font-bold text-[16px] mt-2 active:scale-95 transition-transform'
      },
      buttonsStyling: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;
        const password = (document.getElementById('swal-password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('swal-confirm-password') as HTMLInputElement).value;
        
        if (!name || !phone || !password || !confirmPassword) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
          return false;
        }
        
        if (password !== confirmPassword) {
          Swal.showValidationMessage('Les mots de passe ne correspondent pas');
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
    
    const payload = {
      productId: this.selectedProduct(),
      formatId: this.selectedFormatId(),
      storeId: this.selectedStoreId(),
      price: currentPrice,
      city: 'Dakar',
      neighborhood: 'Plateau',
      storeName: 'Boutique (Signalement Mobile)',
      latitude: this.latitude(),
      longitude: this.longitude(),
      photoUrl: this.cameraService.capturedImage()
    };

    this.apiService.post('/observations', payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        Swal.fire({
          title: 'Merci !',
          text: 'Votre signalement a bien été envoyé et sera vérifié.',
          icon: 'success',
          confirmButtonText: 'Génial !',
          customClass: {
            popup: 'rounded-[32px] shadow-2xl p-4 border-none animate-bounce-success',
            title: 'text-[20px] font-black text-gray-800 mt-2',
            htmlContainer: 'text-[15px] text-gray-500 font-medium',
            actions: 'w-full mt-4 px-2',
            confirmButton: 'w-full bg-[#00a859] text-white rounded-[20px] min-h-[56px] flex items-center justify-center font-black text-[16px] shadow-[0_8px_20px_-6px_rgba(0,168,89,0.5)] active:scale-95 transition-transform'
          },
          buttonsStyling: false,
          backdrop: 'rgba(0,0,0,0.5) blur(4px)'
        }).then(() => {
          this.router.navigate(['/home']);
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
