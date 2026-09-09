import { Component, Input, Output, EventEmitter, signal, effect, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      <div class="relative w-full h-[60px] rounded-[24px] bg-white border-[3px] flex items-center px-2 shadow-[0_8px_20px_-6px_rgba(0,168,89,0.25)]"
           [ngClass]="isOfflineMode ? 'border-orange-400' : 'border-[#00a859]'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" 
             class="w-6 h-6 ml-2 flex-shrink-0"
             [ngClass]="isOfflineMode ? 'text-orange-400' : 'text-[#00a859]'">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input 
          class="w-full h-full bg-transparent outline-none text-[16px] font-black text-gray-900 placeholder-gray-400 px-3" 
          type="text" 
          [placeholder]="isOfflineMode ? 'Recherche hors-ligne...' : placeholder"
          [(ngModel)]="inputValue"
          (ngModelChange)="onInputChange($event)"
        />
        <!-- Voice Button -->
        <button 
          (click)="onVoiceClick()" 
          [disabled]="voskLoading"
          [ngClass]="{
            'bg-red-500 ring-4 ring-red-200': isListening,
            'bg-orange-400 active:scale-95': !isListening && isOfflineMode && !voskLoading,
            'bg-[#00a859] active:scale-95': !isListening && !isOfflineMode && !voskLoading,
            'bg-gray-300 cursor-wait': voskLoading
          }"
          class="w-[44px] h-[44px] rounded-full text-white flex items-center justify-center flex-shrink-0 shadow-md transition-all">
          
          <!-- Loading Spinner (Vosk model loading) -->
          <div *ngIf="voskLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

          <!-- Microphone Icon -->
          <svg *ngIf="!isListening && !voskLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>

          <!-- Sound Wave Animation -->
          <div *ngIf="isListening && !voskLoading" class="flex items-center justify-center gap-[2px] h-[20px]">
            <div class="w-[3px] bg-white rounded-[4px] animate-wave" style="animation-delay: 0.0s"></div>
            <div class="w-[3px] bg-white rounded-[4px] animate-wave" style="animation-delay: 0.2s"></div>
            <div class="w-[3px] bg-white rounded-[4px] animate-wave" style="animation-delay: 0.4s"></div>
            <div class="w-[3px] bg-white rounded-[4px] animate-wave" style="animation-delay: 0.1s"></div>
          </div>

        </button>
      </div>

      <!-- Offline Mode Badge -->
      <div *ngIf="isOfflineMode" class="flex items-center justify-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
        <span class="text-[11px] font-bold text-orange-500">Mode hors-ligne • Voix locale activée</span>
      </div>
    </div>
    <style>
      @keyframes sound-wave {
        0%, 100% { height: 6px; }
        50% { height: 18px; }
      }
      .animate-wave {
        animation: sound-wave 0.6s ease-in-out infinite;
      }
    </style>
  `
})
export class SearchBarComponent implements OnChanges {
  @Input() placeholder: string = 'Chercher...';
  @Input() value: string = '';
  @Input() isListening: boolean = false;
  @Input() isOfflineMode: boolean = false;
  @Input() voskLoading: boolean = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() voiceSearch = new EventEmitter<void>();

  inputValue: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.inputValue = changes['value'].currentValue;
    }
  }

  onInputChange(val: string) {
    this.valueChange.emit(val);
  }

  onVoiceClick() {
    this.voiceSearch.emit();
  }
}
