import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FieldAgentService, FieldTask } from '../../core/services/field-agent.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f8f9fa] pb-24 font-sans" *ngIf="task()">
      <!-- Premium Header -->
      <header class="bg-gradient-to-br from-[#3ddc84] to-[#00a859] text-white pt-14 pb-8 px-6 rounded-b-[32px] shadow-[0_8px_30px_rgba(0,168,89,0.2)] relative overflow-hidden z-10">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-8 translate-y-8"></div>
        
        <div class="flex items-center relative z-10 mb-6">
          <button (click)="goBack()" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mr-4 active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 class="text-[20px] font-black tracking-tight">Détails de la mission</h1>
        </div>
      </header>

      <div class="px-5 -mt-6 relative z-20 space-y-5">
        <!-- Info Card -->
        <div class="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white">
          <!-- Photo de la boutique ou image par défaut -->
          <div class="h-40 bg-gray-200 relative w-full overflow-hidden">
            <img *ngIf="task()?.storeImageUrl" [src]="task()?.storeImageUrl" class="w-full h-full object-cover" alt="Photo de la boutique">
            <div *ngIf="!task()?.storeImageUrl" class="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 mb-2 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
              <span class="text-sm font-semibold">Aucune photo dispo</span>
            </div>
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <!-- Store Name on image -->
            <div class="absolute bottom-4 left-4 right-4">
              <p class="text-white font-black text-xl leading-tight">{{ task()?.shopName || 'Boutique inconnue' }}</p>
              <p class="text-white/80 font-medium text-sm flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                  <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.97 5.97 0 00.149-.066l.044-.022a13.344 13.344 0 001.218-.68 11.192 11.192 0 001.91-1.464 12.56 12.56 0 002.594-3.414A11.05 11.05 0 0017 8.5C17 4.358 13.866 1 10 1S3 4.358 3 8.5c0 1.536.43 3.012 1.25 4.316a12.56 12.56 0 002.593 3.414 11.192 11.192 0 001.91 1.464c.48.33.91.606 1.218.68l.044.022.15.066.018.008.006.003zM10 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd" />
                </svg>
                {{ task()?.address || 'Adresse introuvable' }}
              </p>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-5">
              <p class="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Produit signalé</p>
              <p class="text-[20px] font-black text-[#0f3d23] leading-tight flex items-center justify-between">
                {{ task()?.productName }}
              </p>
            </div>
            
            <div class="mb-5 flex gap-4">
              <div class="flex-1">
                <p class="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Prix signalé</p>
                <div class="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
                  <span class="text-[22px] font-black">{{ task()?.price }}</span>
                  <span class="text-[14px] font-bold ml-1 mt-1">FCFA</span>
                </div>
              </div>
              <div class="flex-1" *ngIf="task()?.observationPhotoUrl">
                <p class="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Photo ticket/étiquette</p>
                <img [src]="task()?.observationPhotoUrl" class="w-full h-[52px] object-cover rounded-xl border border-gray-200" alt="Preuve" (click)="viewImage = task()?.observationPhotoUrl">
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Button -->
        <button (click)="openGPS()" class="w-full bg-[#1A1A1A] text-white rounded-[20px] h-[64px] flex items-center justify-center gap-3 font-black text-[17px] active:scale-[0.98] transition-transform shadow-[0_8px_20px_rgba(26,26,26,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Naviguer au point exact (GPS)
        </button>

        <!-- Notes field -->
        <div class="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <label class="block text-[13px] font-extrabold text-gray-800 mb-3">Notes de l'agent (Optionnel)</label>
          <textarea 
            [(ngModel)]="notes" 
            rows="3" 
            class="w-full px-5 py-4 bg-[#f8fafc] border-[1.5px] border-[#e2e8f0] rounded-[16px] text-[15px] font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#00a859] focus:shadow-[0_8px_30px_rgba(0,168,89,0.1)] transition-all outline-none resize-none"
            placeholder="Observations sur le terrain..."></textarea>
        </div>
      </div>

      <!-- Action Buttons Bottom Bar -->
      <div class="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-gray-100 flex gap-3 z-50">
        <button 
          (click)="submit('REJECTED')" 
          [disabled]="loading()"
          class="flex-[1] bg-red-50 text-red-600 border border-red-100 rounded-[20px] h-[60px] font-black text-[16px] active:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center">
          Rejeter
        </button>
        <button 
          (click)="submit('CONFIRMED')" 
          [disabled]="loading()"
          class="flex-[1.5] bg-[#00a859] text-white rounded-[20px] h-[60px] font-black text-[16px] shadow-[0_8px_20px_rgba(0,168,89,0.3)] active:bg-[#008f4c] transition-colors disabled:opacity-50 flex items-center justify-center">
          Confirmer
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!task() && !error()" class="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div class="w-16 h-16 relative">
        <div class="absolute inset-0 border-4 border-[#00a859]/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#00a859] rounded-full border-t-transparent animate-spin"></div>
      </div>
    <!-- Full Screen Image Modal -->
    <div *ngIf="viewImage" class="fixed inset-0 z-[100] bg-black/90 flex flex-col" (click)="viewImage = undefined">
      <div class="flex justify-end p-5">
        <button class="bg-white/20 p-2 rounded-full text-white backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center p-5">
        <img [src]="viewImage" class="max-w-full max-h-full object-contain rounded-xl" alt="Image en grand" (click)="$event.stopPropagation()">
      </div>
    </div>
  `
})
export class TaskDetailComponent implements OnInit {
  private agentService = inject(FieldAgentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public task = signal<FieldTask | null>(null);
  public loading = signal(false);
  public error = signal(false);
  public notes = '';
  public viewImage: string | undefined = undefined;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Pour l'instant, on recharge toutes les tâches et on filtre.
      // Idéalement, il y aurait un endpoint GET /field-agent/tasks/:id
      this.agentService.getTasks().subscribe({
        next: (res) => {
          if (res.success) {
            const found = res.data.find(t => t.id === id);
            if (found) {
              this.task.set(found);
            } else {
              this.error.set(true);
            }
          }
        },
        error: () => this.error.set(true)
      });
    }
  }

  openGPS() {
    const t = this.task();
    if (!t) return;
    
    // Essayer geo: URL d'abord (fonctionne bien sur Android)
    // Fallback vers Google Maps si besoin (standard cross-platform)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.location.href = `maps://?q=${t.latitude},${t.longitude}`;
    } else {
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${t.latitude},${t.longitude}`;
    }
  }

  submit(status: 'CONFIRMED' | 'REJECTED') {
    const t = this.task();
    if (!t) return;
    
    this.loading.set(true);
    this.agentService.submitVerification(t.id, status, this.notes).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/homme-terrain']);
        }
      },
      error: () => {
        this.loading.set(false);
        alert("Une erreur est survenue lors de l'enregistrement.");
      }
    });
  }

  goBack() {
    this.router.navigate(['/homme-terrain']);
  }
}
