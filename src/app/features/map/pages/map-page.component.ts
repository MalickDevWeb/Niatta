import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { PushNotificationService } from '../../../core/services/push-notification.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { useRegion } from '../../../core/hooks/use-region';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

interface GatheringPoint {
  id: string;
  label: string;
  description?: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  rating: number | null;
  imageUrl: string | null;
  observationCount: number;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, SearchBarComponent],
  providers: [PushNotificationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="h-screen bg-white font-sans flex flex-col relative overflow-hidden animate-fade-in">
      
      <!-- Header / Search Bar -->
      <header class="absolute top-0 left-0 right-0 z-40 px-4 pt-10 pb-2 pointer-events-none">
        <div class="pointer-events-auto flex flex-col gap-3">
          <app-search-bar placeholder="Rechercher un produit..."></app-search-bar>
          <div class="flex overflow-x-auto no-scrollbar gap-2 pb-1 pointer-events-auto">
            <button 
              (click)="setFilter('Tous')"
              [ngClass]="activeFilter() === 'Tous' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-5 py-2.5 rounded-full text-[15px] font-black whitespace-nowrap shadow-sm border transition-colors">
              Tous
            </button>
            <button 
              (click)="setFilter('À proximité')"
              [ngClass]="activeFilter() === 'À proximité' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-5 py-2.5 rounded-full text-[15px] font-black whitespace-nowrap shadow-sm border transition-colors">
              À proximité
            </button>
            <button 
              (click)="setFilter('Meilleurs prix')"
              [ngClass]="activeFilter() === 'Meilleurs prix' ? 'bg-[#00a859] text-white' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'"
              class="flex-shrink-0 px-5 py-2.5 rounded-full text-[15px] font-black whitespace-nowrap shadow-sm border transition-colors">
              Meilleurs prix
            </button>
          </div>
        </div>
      </header>

      <!-- Map Area -->
      <div class="flex-grow w-full relative z-0 bg-[#e8f2eb]">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
          alt="Carte" 
          class="w-full h-full object-cover opacity-60 grayscale-[30%] sepia-[20%] hue-rotate-[-30deg]" />

        <!-- Gathering Alert Button -->
        <button 
          (click)="triggerGathering()"
          [disabled]="loadingGathering()"
          class="absolute bottom-[120px] right-4 z-50 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white p-4 rounded-full shadow-lg flex items-center justify-center animate-bounce shadow-red-500/50 transition-transform active:scale-95">
          <iconify-icon icon="fluent-emoji:megaphone" class="text-[28px] mr-2"></iconify-icon>
          <span class="font-black text-[15px]">
            {{ loadingGathering() ? 'Chargement...' : 'Alerte Rassemblement' }}
          </span>
        </button>




        <!-- Stores Loading Spinner -->
        <div *ngIf="loadingStores()" class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div class="bg-white rounded-full p-3 shadow-lg">
            <svg class="animate-spin w-6 h-6 text-[#00a859]" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        <!-- Pins Overlay — Viennent de la BDD -->
        <div class="absolute inset-0">
          
          <!-- Pins dynamiques depuis l'API -->
          <div 
            *ngFor="let store of stores(); let i = index"
            (click)="selectShop(store)"
            [style.top]="getPinTop(i) + '%'"
            [style.left]="getPinLeft(i) + '%'"
            class="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-10 drop-shadow-md hover:scale-110 transition-transform">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#00a859"/>
              <circle cx="20" cy="20" r="7" fill="white"/>
            </svg>
          </div>

          <!-- Empty state si aucune boutique -->
          <div *ngIf="!loadingStores() && stores().length === 0" class="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
            <div class="bg-white/90 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-lg">
              <p class="text-gray-500 text-sm font-bold">Aucune boutique sur la carte</p>
              <p class="text-gray-400 text-xs mt-1">L'admin peut en ajouter depuis le back-office</p>
            </div>
          </div>

          <!-- Position actuelle (point bleu) -->
          <div class="absolute top-[50%] left-[55%] -translate-x-1/2 -translate-y-full z-30">
            <div class="absolute inset-0 bg-[#2f80ed] rounded-full animate-ping opacity-40 h-[20px] w-[20px] top-[15px] left-[10px]"></div>
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-12 drop-shadow-lg relative">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#2f80ed"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
              <circle cx="20" cy="20" r="3" fill="#2f80ed"/>
            </svg>
          </div>
          
          <!-- Dynamic Region Label -->
          <div class="absolute bottom-[45%] right-[20%] text-[18px] font-black text-gray-500/80 uppercase tracking-widest drop-shadow-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {{ region.selectedRegion() }}
          </div>
        </div>
      </div>

      <!-- Shop Details Card -->
      <div *ngIf="selectedShop()" class="absolute bottom-[90px] left-4 right-4 bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-40 animate-fade-in-up">
        
        <button (click)="closeCard()" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1 transition-colors z-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-start gap-3">
          <!-- Shop Image -->
          <div class="w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
            <img 
              [src]="selectedShop()?.imageUrl || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=200&q=80'" 
              alt="Boutique" 
              class="w-full h-full object-cover" />
          </div>
          
          <div class="flex-grow pr-6">
            <h3 class="font-black text-[16px] text-gray-900 leading-tight">{{ selectedShop()?.name }}</h3>
            
            <!-- Rating -->
            <div *ngIf="selectedShop()?.rating" class="flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-[#fcc917]">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
              </svg>
              <span class="text-[12px] text-gray-900 font-bold ml-1">{{ selectedShop()?.rating }}</span>
              <span class="text-[11px] text-gray-400 font-medium ml-1">(Avis clients)</span>
            </div>
            
            <p class="text-[12px] text-gray-500 font-medium mt-1 leading-snug">
              {{ selectedShop()?.address || selectedShop()?.neighborhood }}
              <span *ngIf="selectedShop()?.city">, {{ selectedShop()?.city }}</span>
            </p>
            
            <div class="flex items-center mt-2 text-[11px] text-gray-500 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 mr-1 text-[#2f80ed]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {{ selectedShop()?.observationCount }} signalement(s) de prix
            </div>
          </div>
        </div>
        
        <div class="flex gap-3 mt-4">
          <button (click)="navigateToStore()" class="flex-1 bg-[#2f80ed] hover:bg-[#2568c9] text-white text-[13px] font-bold py-3 rounded-[12px] transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Y aller
          </button>
          <button (click)="showDetails()" class="flex-1 bg-[#007f43] hover:bg-[#006030] text-white text-[13px] font-bold py-3 rounded-[12px] transition-colors">
            Voir les détails
          </button>
        </div>
      </div>

      <app-bottom-nav currentRoute="map"></app-bottom-nav>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
  `]
})
export class MapPageComponent implements OnInit {
  selectedShop = signal<Store | null>(null);
  activeFilter = signal<string>('Tous');
  region = useRegion();

  // Boutiques depuis la BDD
  stores = signal<Store[]>([]);
  loadingStores = signal<boolean>(true);

  // Point de rassemblement depuis la BDD
  gatheringPoint = signal<GatheringPoint | null>(null);
  loadingGathering = signal<boolean>(true);

  constructor(
    private router: Router,
    private http: HttpClient,
    private pushService: PushNotificationService
  ) {}

  ngOnInit() {
    this.loadStores();
    this.loadGatheringPoint();
    this.pushService.requestSubscription();
  }

  /** Charge les boutiques actives depuis l'API */
  loadStores() {
    this.loadingStores.set(true);
    this.http.get<{ success: boolean; data: Store[] }>(`${environment.apiUrl}/stores`)
      .subscribe({
        next: (res) => {
          this.stores.set(res.data || []);
          this.loadingStores.set(false);
        },
        error: () => this.loadingStores.set(false)
      });
  }

  /** Charge le point de rassemblement actif depuis l'API */
  loadGatheringPoint() {
    this.loadingGathering.set(true);
    this.http.get<{ success: boolean; data: GatheringPoint | null }>(`${environment.apiUrl}/gatherings`)
      .subscribe({
        next: (res) => {
          this.gatheringPoint.set(res.data);
          this.loadingGathering.set(false);
        },
        error: () => this.loadingGathering.set(false)
      });
  }

  /**
   * Positionne les pins sur la carte de manière distribuée
   * Dans une vraie implémentation Leaflet, on utiliserait les vraies coordonnées GPS
   */
  getPinTop(index: number): number {
    const positions = [30, 22, 45, 38, 55, 28, 60, 35];
    return positions[index % positions.length];
  }

  getPinLeft(index: number): number {
    const positions = [22, 65, 18, 75, 40, 85, 55, 30];
    return positions[index % positions.length];
  }

  triggerGathering() {
    const point = this.gatheringPoint();
    if (!point) {
      Swal.fire({
        title: 'Information',
        text: 'Aucun lieu de rassemblement défini par l\'administrateur.',
        icon: 'warning',
        confirmButtonColor: '#00a859',
        confirmButtonText: 'Compris',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl font-bold px-6 py-2.5'
        }
      });
      return;
    }
    const lat = Number(point.latitude);
    const lng = Number(point.longitude);
    this.openMapNavigation(lat, lng, point.label);
    this.pushService.requestSubscription().then(() => {
      this.pushService.triggerGatheringAlert(lat, lng).subscribe({
        next: () => console.log('Alerte de rassemblement envoyée !'),
        error: (err) => console.error(err)
      });
    });
  }

  openMapNavigation(lat: number, lng: number, label: string = 'Lieu du Rassemblement') {
    const encodedLabel = encodeURIComponent(label);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    let url: string;
    if (isIOS) {
      url = `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedLabel}&dirflg=d`;
    } else if (isAndroid) {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    }
    window.open(url, '_blank');
  }

  navigateToStore() {
    const store = this.selectedShop();
    if (!store) return;
    const lat = Number(store.latitude);
    const lng = Number(store.longitude);
    this.openMapNavigation(lat, lng, store.name);
  }

  setFilter(filter: string) { this.activeFilter.set(filter); }
  selectShop(store: Store) { this.selectedShop.set(store); }
  closeCard() { this.selectedShop.set(null); }

  showDetails() {
    const store = this.selectedShop();
    if (store) this.router.navigate(['/shop', store.id]);
  }
}
