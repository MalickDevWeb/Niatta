import { Component, inject, signal, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FieldAgentService, FieldTask } from '../../core/services/field-agent.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#f8f9fa] pb-20 font-sans relative flex flex-col">
      <!-- Premium Header -->
      <header class="bg-gradient-to-br from-[#3ddc84] to-[#00a859] text-white pt-14 pb-6 px-6 rounded-b-[32px] shadow-[0_8px_30px_rgba(0,168,89,0.2)] relative overflow-hidden z-20 shrink-0">
        <!-- Decorative subtle circles -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-8 translate-y-8"></div>
        
        <div class="flex justify-between items-center relative z-10 mb-1">
          <button class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <button class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
        </div>
        <h1 class="text-[28px] font-black tracking-tight mt-4 relative z-10">Missions Terrain</h1>
        <p class="text-[15px] font-medium opacity-90 relative z-10 mt-1">{{ pendingTasks().length }} signalement(s) en attente</p>
      </header>

      <!-- Apple-style Segmented Control -->
      <div class="px-6 -mt-5 relative z-30 shrink-0">
        <div class="bg-white/90 backdrop-blur-md rounded-full p-1.5 flex shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/40">
          <button 
            (click)="setMode('list')"
            class="flex-1 py-2.5 text-[14px] font-bold rounded-full transition-all duration-300"
            [ngClass]="viewMode() === 'list' ? 'bg-white text-[#0f3d23] shadow-sm' : 'text-gray-500 hover:text-gray-700'">
            Liste
          </button>
          <button 
            (click)="setMode('map')"
            class="flex-1 py-2.5 text-[14px] font-bold rounded-full transition-all duration-300"
            [ngClass]="viewMode() === 'map' ? 'bg-white text-[#0f3d23] shadow-sm' : 'text-gray-500 hover:text-gray-700'">
            Carte
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="pt-8 flex-grow relative overflow-hidden">
        
        <!-- List View -->
        <div [class.hidden]="viewMode() === 'map'" class="px-5 space-y-4 h-full overflow-y-auto pb-8">
          <!-- Task Card -->
          <div *ngFor="let task of pendingTasks()" 
               (click)="goToDetail(task.id)"
               class="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 active:scale-[0.97] transition-transform cursor-pointer">
            <div class="flex justify-between items-start mb-3">
              <div class="pr-3">
                <h3 class="font-black text-gray-900 text-lg leading-tight mb-1">{{ task.productName }}</h3>
                <p class="text-[14px] font-semibold text-gray-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                  {{ task.shopName || 'Boutique Inconnue' }}
                </p>
              </div>
              <div class="bg-red-50 text-red-600 text-[13px] font-black px-3 py-1.5 rounded-xl whitespace-nowrap">
                {{ task.price }} FCFA
              </div>
            </div>
            
            <div class="h-[1px] w-full bg-gray-50 my-3"></div>

            <div class="flex items-center justify-between text-[13px] font-bold text-gray-400">
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-[#00a859]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#00a859]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                À 1.2 km (approx.)
              </div>
              <span class="text-[#00a859] flex items-center gap-1">
                Vérifier
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Empty State Premium -->
          <div *ngIf="pendingTasks().length === 0" class="flex flex-col items-center justify-center pt-16 px-6 text-center animate-fade-in">
            <div class="relative mb-8">
              <div class="absolute inset-0 bg-green-200 blur-2xl opacity-50 rounded-full scale-150"></div>
              <div class="w-32 h-32 bg-gradient-to-tr from-green-50 to-white rounded-full shadow-[0_10px_40px_rgba(0,168,89,0.15)] flex items-center justify-center relative z-10 border border-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-[#00a859]" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 class="text-[22px] font-black text-gray-900 mb-2 tracking-tight">Aucune mission en attente</h2>
            <p class="text-[15px] text-gray-500 font-medium max-w-[260px] mx-auto leading-relaxed">
              De nouvelles missions seront bientôt disponibles pour vous.
            </p>
          </div>
        </div>

        <!-- Real Map View -->
        <div [class.hidden]="viewMode() === 'list'" class="absolute inset-0 z-10 -top-[160px] pointer-events-auto">
           <div #mapContainer class="w-full h-[150%]"></div>
           
           <!-- Bottom Floating Action -->
           <div class="absolute bottom-24 left-0 right-0 px-6 z-[1000] pointer-events-none" *ngIf="viewMode() === 'map'">
             <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 flex items-center justify-between border border-gray-100 pointer-events-auto">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                 </div>
                 <div>
                   <p class="text-sm font-black text-gray-900">À proximité</p>
                   <p class="text-xs font-bold text-gray-400">Position actuelle</p>
                 </div>
               </div>
               <button (click)="centerMap()" class="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center active:scale-95 shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class TasksListComponent implements OnInit, AfterViewInit, OnDestroy {
  private agentService = inject(FieldAgentService);
  private router = inject(Router);

  public tasks = signal<FieldTask[]>([]);
  public viewMode = signal<'list' | 'map'>('list');

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private dakarLatLng: L.LatLngTuple = [14.7167, -17.4677];
  private userMarker: L.Marker | null = null;
  private watchId: number | null = null;
  public userLocation = signal<L.LatLng | null>(null);

  ngOnInit() {
    this.agentService.getTasks().subscribe({
      next: (res) => {
        if (res.success) {
          this.tasks.set(res.data);
          this.updateMapMarkers();
        }
      },
      error: (err) => {
        console.error('Erreur de chargement des tâches:', err);
      }
    });

    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.set(latLng);
          this.updateUserMarker(latLng);
        },
        (error) => console.error('Erreur géolocalisation:', error),
        { enableHighAccuracy: true }
      );
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.watchId !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private updateUserMarker(latLng: L.LatLng) {
    if (!this.map) return;
    
    if (!this.userMarker) {
      const userIconHtml = `
        <div class="relative w-8 h-8">
          <div class="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <div class="absolute inset-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-white"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userIconHtml,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      this.userMarker = L.marker(latLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(this.map);
    } else {
      this.userMarker.setLatLng(latLng);
    }
  }

  setMode(mode: 'list' | 'map') {
    this.viewMode.set(mode);
    if (mode === 'map' && this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  }

  private initMap() {
    if (!this.mapContainer) return;
    
    // Create map with offset for the header
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    }).setView(this.dakarLatLng, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.updateMapMarkers();
  }

  private updateMapMarkers() {
    if (!this.map) return;
    this.markersLayer.clearLayers();

    const pending = this.pendingTasks();
    if (pending.length === 0) return;

    let bounds = L.latLngBounds([]);

    pending.forEach(task => {
      // Si la tâche n'a pas de coords, on ajoute une variation légère autour de Dakar pour le prototype
      const lat = task.latitude || (this.dakarLatLng[0] + (Math.random() - 0.5) * 0.02);
      const lng = task.longitude || (this.dakarLatLng[1] + (Math.random() - 0.5) * 0.02);
      
      bounds.extend([lat, lng]);

      const priceStr = task.price >= 1000 ? (task.price / 1000).toFixed(1) + 'k' : task.price;

      // Custom HTML Marker using the exact mockup style!
      const iconHtml = `
        <div class="relative group cursor-pointer" onclick="document.dispatchEvent(new CustomEvent('task-click', {detail: '${task.id}'}))">
          <div class="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10 transform scale-110 border-2 border-[#00a859]">
            <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
              ${priceStr}
            </div>
          </div>
          <!-- Pin triangle -->
          <div class="w-4 h-4 bg-white absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-[#00a859]"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker', // Reset default leaflet icon styles
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(this.markersLayer);
    });

    if (pending.length > 0) {
      // Fit bounds but add padding on top for the big header
      this.map.fitBounds(bounds, { paddingTopLeft: [0, 200], paddingBottomRight: [0, 100] });
    }

    // Listen for custom event triggered by raw HTML string above
    document.addEventListener('task-click', ((e: CustomEvent) => {
      this.goToDetail(e.detail);
    }) as EventListener);
  }

  centerMap() {
    if (this.map) {
      if (this.userLocation()) {
        this.map.setView(this.userLocation()!, 16);
      } else {
        const pending = this.pendingTasks();
        if (pending.length > 0) {
          let bounds = L.latLngBounds([]);
          pending.forEach(task => {
            const lat = task.latitude || this.dakarLatLng[0];
            const lng = task.longitude || this.dakarLatLng[1];
            bounds.extend([lat, lng]);
          });
          this.map.fitBounds(bounds, { paddingTopLeft: [0, 200], paddingBottomRight: [0, 100] });
        } else {
          this.map.setView(this.dakarLatLng, 13);
        }
      }
    }
  }

  pendingTasks() {
    return this.tasks().filter(t => t.status === 'PENDING');
  }

  goToDetail(id: string) {
    this.router.navigate(['/homme-terrain', id]);
  }
}
