import { Component, Input, Output, EventEmitter, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormat } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-format-selector',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
      [class.opacity-0]="!visible"
      [class.pointer-events-none]="!visible"
      (click)="close.emit()">
    </div>

    <!-- Bottom Sheet -->
    <div 
      class="fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-[32px] shadow-2xl transition-transform duration-300 ease-out"
      [class.translate-y-full]="!visible">
      
      <!-- Handle bar -->
      <div class="flex justify-center pt-4 pb-2">
        <div class="w-12 h-1.5 bg-gray-200 rounded-full"></div>
      </div>

      <!-- Header -->
      <div class="px-6 pt-2 pb-4 flex items-center gap-4">
        <!-- Icon or Image -->
        <ng-container *ngIf="isImage; else iconify">
          <img [src]="productIcon" [alt]="productName" class="w-12 h-12 object-contain" />
        </ng-container>
        <ng-template #iconify>
          <iconify-icon [attr.icon]="productIcon" class="text-[48px]"></iconify-icon>
        </ng-template>

        <div>
          <h3 class="text-[20px] font-black text-gray-900">{{ productName }}</h3>
          <p class="text-[13px] text-gray-400 font-medium">Choisir un format</p>
        </div>
      </div>

      <!-- Formats list -->
      <div class="px-4 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
        <button
          *ngFor="let format of formats"
          (click)="selectFormat(format)"
          class="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 active:scale-98"
          [class.border-[#00a859]]="selectedFormatId === format.id"
          [class.bg-[#f2fbf5]]="selectedFormatId === format.id"
          [class.border-gray-100]="selectedFormatId !== format.id"
          [class.bg-gray-50]="selectedFormatId !== format.id">
          
          <div class="flex items-center gap-3">
            <!-- Indicateur de sélection -->
            <div 
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
              [class.border-[#00a859]]="selectedFormatId === format.id"
              [class.border-gray-300]="selectedFormatId !== format.id">
              <div 
                *ngIf="selectedFormatId === format.id"
                class="w-2.5 h-2.5 rounded-full bg-[#00a859]">
              </div>
            </div>

            <!-- Image/Icône de taille visuelle -->
            <div class="flex items-center justify-center w-12 h-12 flex-shrink-0">
              <ng-container *ngIf="format.imageUrl || isImage; else iconifyFormat">
                <img [src]="format.imageUrl || productIcon" [alt]="format.label" class="object-contain transition-all duration-300" [ngClass]="getFormatIconClass(format)" />
              </ng-container>
              <ng-template #iconifyFormat>
                <iconify-icon [attr.icon]="productIcon" class="transition-all duration-300 text-[#00a859]" [ngClass]="getFormatIconClass(format)"></iconify-icon>
              </ng-template>
            </div>

            <div class="text-left">
              <div class="font-bold text-[16px] text-gray-900 leading-tight">{{ format.label }}</div>
              <div *ngIf="format.officialPriceCap" class="text-[11px] text-gray-500 mt-0.5">
                Plafond : {{ format.officialPriceCap | number:'1.0-0' }} FCFA
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-black text-[18px]" [class.text-[#00a859]]="selectedFormatId === format.id" [class.text-gray-700]="selectedFormatId !== format.id">
              {{ format.price | number:'1.0-0' }} FCFA
            </div>
            <div class="text-[11px] text-gray-400">
              {{ format.shopCount }} obs.
            </div>
          </div>
        </button>
      </div>
      
      <!-- Report Button -->
      <div class="px-4 pb-10 pt-2 border-t border-gray-100">
        <button 
          (click)="onReport()"
          class="w-full bg-[#00a859] hover:bg-[#009650] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg shadow-green-500/30">
          <iconify-icon icon="heroicons:megaphone-solid" class="text-[20px]"></iconify-icon>
          Signaler un prix
        </button>
      </div>
    </div>
  `
})
export class FormatSelectorComponent {
  @Input() visible = false;
  @Input() productName = '';
  @Input() productIcon = '';
  @Input() formats: ProductFormat[] = [];
  @Input() selectedFormatId = '';

  @Output() close = new EventEmitter<void>();
  @Output() formatSelected = new EventEmitter<ProductFormat>();
  @Output() reportClick = new EventEmitter<string>();

  get isImage(): boolean {
    return this.productIcon ? (this.productIcon.startsWith('http') || this.productIcon.startsWith('/')) : false;
  }

  getFormatIconClass(format: ProductFormat): string {
    return 'w-12 h-12 text-[48px]'; // Taille identique (grande) pour toutes les images
  }

  selectFormat(format: ProductFormat) {
    this.formatSelected.emit(format);
    // On ne ferme plus automatiquement pour permettre à l'utilisateur de cliquer sur "Signaler un prix"
  }

  onReport() {
    this.reportClick.emit(this.selectedFormatId);
    this.close.emit();
  }
}
