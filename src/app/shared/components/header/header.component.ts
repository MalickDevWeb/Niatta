import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-10 bg-green-600 rounded-tl-full rounded-tr-full rounded-br-full relative flex items-center justify-center shadow-sm">
            <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 leading-none">Juste Prix</h1>
          <p class="text-[10px] tracking-[0.2em] text-green-700 font-bold uppercase mt-0.5">Sénégal</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="relative text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button class="text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {}
