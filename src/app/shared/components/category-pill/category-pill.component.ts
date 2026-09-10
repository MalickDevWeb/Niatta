import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-pill',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <button 
      (click)="onClick.emit()"
      [ngClass]="active ? 'ring-4 ring-[#00a859] ring-offset-2' : 'ring-1 ring-gray-200 shadow-sm hover:shadow-md'"
      class="relative m-1 rounded-[24px] overflow-hidden flex flex-col justify-end w-[110px] h-[110px] flex-shrink-0 cursor-pointer transition-all transform hover:scale-105">
      
      <!-- Image (fills the background) -->
      <ng-container *ngIf="isImage; else iconify">
        <img [src]="icon" alt="Category icon" class="absolute inset-0 w-full h-full object-cover" />
      </ng-container>
      
      <ng-template #iconify>
        <!-- Fallback icon centered -->
        <div class="absolute inset-0 flex items-center justify-center bg-gray-50">
          <iconify-icon [attr.icon]="icon" class="text-[50px] text-gray-400"></iconify-icon>
        </div>
      </ng-template>

      <!-- Gradient overlay to make text readable -->
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

      <!-- Label at the bottom -->
      <span class="relative z-10 w-full text-center text-white font-black text-[15px] pb-3 drop-shadow-md tracking-wide">{{ label | uppercase }}</span>
    </button>
  `
})
export class CategoryPillComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  get isImage(): boolean {
    return this.icon ? (this.icon.startsWith('http') || this.icon.startsWith('/')) : false;
  }
}
