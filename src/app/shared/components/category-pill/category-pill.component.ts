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
      [ngClass]="active ? 'bg-[#e6f7ed] border-[#00a859] ring-2 ring-[#00a859] ring-offset-1 text-[#00a859]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 shadow-sm'"
      class="m-1 border-2 rounded-[24px] p-3 flex flex-col items-center justify-center min-w-[90px] min-h-[90px] h-auto flex-shrink-0 cursor-pointer transition-all">
      <iconify-icon [attr.icon]="icon" class="text-[35px] leading-none mb-1 drop-shadow-sm"></iconify-icon>
      <span class="text-[13px] font-black text-center break-words max-w-full">{{ label }}</span>
    </button>
  `
})
export class CategoryPillComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}
