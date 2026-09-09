import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-2.5 cursor-pointer group flex-shrink-0 w-[72px]">
      <div [class]="'w-[60px] h-[60px] rounded-3xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ' + bgColor">
        <ng-content></ng-content>
      </div>
      <span class="text-[11px] font-bold text-gray-800 text-center leading-tight">{{ label }}</span>
    </div>
  `
})
export class CategoryItemComponent {
  @Input() label: string = '';
  @Input() bgColor: string = 'bg-green-100';
}
