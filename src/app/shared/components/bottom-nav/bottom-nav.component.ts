import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t-[3px] border-gray-100 px-3 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] rounded-t-[32px]">
      
      <!-- Accueil -->
      <a routerLink="/home" [class]="currentRoute === 'home' ? 'bg-[#00a859] text-white shadow-md' : 'text-gray-400 bg-transparent hover:bg-gray-50'" class="flex flex-col items-center justify-center w-[23%] h-[64px] rounded-[22px] transition-all cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" [attr.fill]="currentRoute === 'home' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 mb-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span class="text-[12px] font-black tracking-tight" [class.hidden]="currentRoute !== 'home'">Accueil</span>
      </a>
      
      <!-- Carte -->
      <a routerLink="/map" [class]="currentRoute === 'map' ? 'bg-[#00a859] text-white shadow-md' : 'text-gray-400 bg-transparent hover:bg-gray-50'" class="flex flex-col items-center justify-center w-[23%] h-[64px] rounded-[22px] transition-all cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" [attr.fill]="currentRoute === 'map' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 mb-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
        <span class="text-[12px] font-black tracking-tight" [class.hidden]="currentRoute !== 'map'">Carte</span>
      </a>

      <!-- Signalements -->
      <a routerLink="/reports" [class]="currentRoute === 'reports' ? 'bg-[#ff0033] text-white shadow-md' : 'text-[#ff0033] bg-transparent hover:bg-red-50'" class="flex flex-col items-center justify-center w-[23%] h-[64px] rounded-[22px] transition-all cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" [attr.fill]="currentRoute === 'reports' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 mb-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text-[12px] font-black tracking-tight" [class.hidden]="currentRoute !== 'reports'">Alerter</span>
      </a>

      <!-- Profil -->
      <a routerLink="/profile" [class]="currentRoute === 'profile' ? 'bg-[#00a859] text-white shadow-md' : 'text-gray-400 bg-transparent hover:bg-gray-50'" class="flex flex-col items-center justify-center w-[23%] h-[64px] rounded-[22px] transition-all cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" [attr.fill]="currentRoute === 'profile' ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 mb-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <span class="text-[12px] font-black tracking-tight" [class.hidden]="currentRoute !== 'profile'">Profil</span>
      </a>
    </nav>
    <style>
      .pb-safe { padding-bottom: calc(1.5rem + env(safe-area-inset-bottom)); }
    </style>
  `
})
export class BottomNavComponent {
  @Input() currentRoute: 'home' | 'map' | 'search' | 'reports' | 'profile' = 'home';
}
