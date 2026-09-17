import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { PushNotificationService } from '../../../core/services/push-notification.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
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
          <label class="flex min-w-0 items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 shrink-0 text-[#00a859]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h18M6.75 9h10.5M10.5 13.5h3M12 13.5v6" />
            </svg>
            <span class="shrink-0 text-xs font-black text-gray-500">Quartier</span>
            <select
              [value]="selectedNeighborhood()"
              (change)="setNeighborhood($any($event.target).value)"
              class="min-w-0 flex-1 truncate bg-transparent text-sm font-black text-gray-800 outline-none">
              <option value="Tous">Tous les quartiers</option>
              <option *ngFor="let neighborhood of neighborhoods()" [value]="neighborhood">{{ neighborhood }}</option>
            </select>
          </label>
        </div>
      </header>

      <!-- Real GPS map -->
      <div class="flex-grow w-full relative z-0 bg-[#e8f2eb]">
        <div #mapElement class="absolute inset-0 z-0" aria-label="Carte GPS des boutiques"></div>

        <div *ngIf="locationStatus() === 'error'" class="absolute top-36 left-4 right-4 z-30 rounded-2xl bg-white/95 px-4 py-3 text-center shadow-lg">
          <p class="text-sm font-bold text-gray-700">Position GPS indisponible</p>
          <button (click)="requestLocation()" class="mt-1 text-xs font-black text-[#00a859]">Réessayer</button>
        </div>

        <button
          (click)="requestLocation()"
          [disabled]="locationStatus() === 'loading'"
          class="absolute bottom-[180px] left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2f80ed] shadow-lg disabled:opacity-60"
          aria-label="Recentrer sur ma position">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l6 6m-6-6V9m0 6h6M9 9l-6-6m6 6V3m0 6H3m6 6-6 6m6-6v6m0-6h6" />
          </svg>
        </button>

        <div class="absolute bottom-[180px] right-4 z-30 rounded-xl bg-white/95 px-3 py-2 text-[11px] font-bold text-gray-700 shadow-lg">
          <div class="mb-1 flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-[#00a859]"></span>
            <span>Boutique</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-[#f97316]"></span>
            <span>+5 signalements</span>
          </div>
        </div>

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
            <span *ngIf="(selectedShop()?.observationCount || 0) > 5" class="mt-2 inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-black text-orange-600">
              Boutique très signalée
            </span>
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
export class MapPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  selectedShop = signal<Store | null>(null);
  activeFilter = signal<string>('Tous');
  selectedNeighborhood = signal<string>('Tous');
  locationStatus = signal<'loading' | 'success' | 'error'>('loading');
  currentLocation = signal<{ latitude: number; longitude: number; accuracy: number } | null>(null);

  // Boutiques depuis la BDD
  stores = signal<Store[]>([]);
  neighborhoods = computed(() => Array.from(new Set(
    this.stores()
      .map((store) => store.neighborhood?.trim())
      .filter((neighborhood): neighborhood is string => Boolean(neighborhood))
  )).sort((first, second) => first.localeCompare(second, 'fr')));
  filteredStores = computed(() => {
    const neighborhood = this.selectedNeighborhood();
    return neighborhood === 'Tous'
      ? this.stores()
      : this.stores().filter((store) => store.neighborhood?.trim() === neighborhood);
  });
  loadingStores = signal<boolean>(true);

  // Point de rassemblement depuis la BDD
  gatheringPoint = signal<GatheringPoint | null>(null);
  loadingGathering = signal<boolean>(true);
  private map!: L.Map;
  private locationMarker?: L.Marker;
  private locationAccuracyCircle?: L.Circle;
  private storeMarkers = new Map<string, L.CircleMarker>();
  private gatheringMarker?: L.CircleMarker;
  private locationWatchId: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private pushService: PushNotificationService
  ) {}

  ngOnInit() {
    this.loadStores();
    this.loadGatheringPoint();
  }

  ngAfterViewInit() {
    this.map = L.map(this.mapElement.nativeElement, { zoomControl: false }).setView([14.7167, -17.4677], 12);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
    this.renderStoreMarkers();
    this.renderGatheringMarker();
    this.requestLocation();
  }

  ngOnDestroy() {
    if (this.locationWatchId !== null) navigator.geolocation.clearWatch(this.locationWatchId);
    this.map?.remove();
  }

  /** Charge les boutiques actives depuis l'API */
  loadStores() {
    this.loadingStores.set(true);
    this.http.get<{ success: boolean; data: Store[] }>(`${environment.apiUrl}/stores`)
      .subscribe({
        next: (res) => {
          this.stores.set(res.data || []);
          this.loadingStores.set(false);
          this.renderStoreMarkers();
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
          this.renderGatheringMarker();
        },
        error: () => this.loadingGathering.set(false)
      });
  }

  private renderStoreMarkers() {
    if (!this.map) return;
    this.storeMarkers.forEach((marker) => marker.remove());
    this.storeMarkers.clear();
    for (const store of this.filteredStores()) {
      if (!Number.isFinite(Number(store.latitude)) || !Number.isFinite(Number(store.longitude))) continue;
      const hasManyReports = store.observationCount > 5;
      const marker = L.circleMarker([Number(store.latitude), Number(store.longitude)], {
        radius: hasManyReports ? 13 : 9,
        color: '#ffffff',
        weight: 3,
        fillColor: hasManyReports ? '#f97316' : '#00a859',
        fillOpacity: 1,
      }).addTo(this.map);
      marker.bindTooltip(`${store.name} - ${store.observationCount} signalement(s)`, { direction: 'top', offset: [0, -8] });
      marker.on('click', () => this.selectShop(store));
      this.storeMarkers.set(store.id, marker);
    }
  }

  private renderGatheringMarker() {
    if (!this.map || !this.gatheringPoint()) return;
    this.gatheringMarker?.remove();
    const point = this.gatheringPoint()!;
    this.gatheringMarker = L.circleMarker([Number(point.latitude), Number(point.longitude)], {
      radius: 10,
      color: '#ffffff',
      weight: 3,
      fillColor: '#ef4444',
      fillOpacity: 1,
    }).addTo(this.map);
    this.gatheringMarker.bindTooltip(point.label, { direction: 'top', offset: [0, -8] });
  }

  requestLocation() {
    if (!navigator.geolocation) {
      this.locationStatus.set('error');
      return;
    }
    this.locationStatus.set('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => this.updateCurrentLocation(position),
      () => this.locationStatus.set('error'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    if (this.locationWatchId === null) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => this.updateCurrentLocation(position),
        () => undefined,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }
  }

  private updateCurrentLocation(position: GeolocationPosition) {
    const current = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
    this.currentLocation.set(current);
    this.locationStatus.set('success');
    if (!this.map) return;
    this.locationMarker?.remove();
    this.locationAccuracyCircle?.remove();
    this.locationAccuracyCircle = L.circle([current.latitude, current.longitude], {
      radius: current.accuracy,
      color: '#2f80ed',
      weight: 1,
      fillColor: '#2f80ed',
      fillOpacity: 0.12,
    }).addTo(this.map);
    this.locationMarker = L.marker([current.latitude, current.longitude], {
      icon: L.divIcon({
        className: 'current-person-marker',
        html: `
          <div style="width:42px;height:50px;filter:drop-shadow(0 3px 3px rgba(0,0,0,.3));">
            <svg viewBox="0 0 42 50" width="42" height="50" xmlns="http://www.w3.org/2000/svg" aria-label="Ma position">
              <path d="M21 1C10 1 2 9 2 20c0 13 19 28 19 28s19-15 19-28C40 9 32 1 21 1Z" fill="#2f80ed" stroke="#fff" stroke-width="3"/>
              <circle cx="21" cy="17" r="6" fill="#fff"/>
              <path d="M11 34c1-7 5-10 10-10s9 3 10 10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </div>
        `,
        iconSize: [42, 50],
        iconAnchor: [21, 50],
      }),
      zIndexOffset: 1000,
    }).addTo(this.map);
    this.locationMarker.bindTooltip(`Ma position (${Math.round(current.accuracy)} m)`, { direction: 'top', offset: [0, -8] });
    this.map.setView([current.latitude, current.longitude], Math.max(this.map.getZoom(), 14));
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
    const origin = this.currentLocation();
    const originParam = origin ? `&origin=${origin.latitude},${origin.longitude}` : '';
    const url = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${lat},${lng}&destination_place_id=&travelmode=walking&query=${encodedLabel}`;
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
  setNeighborhood(neighborhood: string) {
    this.selectedNeighborhood.set(neighborhood);
    this.renderStoreMarkers();
    this.selectedShop.set(null);
  }
  selectShop(store: Store) { this.selectedShop.set(store); }
  closeCard() { this.selectedShop.set(null); }

  showDetails() {
    const store = this.selectedShop();
    if (store) this.router.navigate(['/shop', store.id]);
  }
}
