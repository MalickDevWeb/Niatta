import { signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Product } from '../models/compare.model';

export interface Category {
  id: string;
  name: string;
  svgIcon: SafeHtml;
  textColorClass: string;
}

export function useHome() {
  const sanitizer = inject(DomSanitizer);

  // Mock Categories with raw SVG strings
  const mockCategories: Category[] = [
    {
      id: 'cat1',
      name: 'Alimentation',
      textColorClass: 'text-[#00a859]',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />')
    },
    {
      id: 'cat2',
      name: 'Boissons',
      textColorClass: 'text-[#2563eb]',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />')
    },
    {
      id: 'cat3',
      name: 'Hygiène',
      textColorClass: 'text-[#9333ea]',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 8.25m0 0H17.25l-2.659 2.849m-2.048 2.194L9.75 21.75 12 15.75m0 0h5.25l-2.659 2.849" />')
    },
    {
      id: 'cat4',
      name: 'Électronique',
      textColorClass: 'text-[#eab308]',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />')
    },
    {
      id: 'cat5',
      name: 'Maison',
      textColorClass: 'text-[#f97316]',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />')
    },
    {
      id: 'cat6',
      name: 'Autres',
      textColorClass: 'text-gray-500',
      svgIcon: sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />')
    }
  ];

  // We add an extra property to Product specifically for Home display (like basePrice and totalShops)
  // Or we just extend Product dynamically in the component or here.
  const mockPopularProducts = [
    {
      id: 'p1',
      name: 'Riz brisé',
      emoji: '🍚',
      brand: 'Sunéor',
      weight: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1595088219463-718f26a11128?auto=format&fit=crop&w=150&q=80',
      price: 650,
      currency: 'FCFA',
      shopCount: 12,
      officialPriceCap: 600
    },
    {
      id: 'p2',
      name: 'Huile végétale',
      emoji: '🛢️',
      brand: 'Lesieur',
      weight: '1L',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80',
      price: 1200,
      currency: 'FCFA',
      shopCount: 8,
      officialPriceCap: 1100
    }
  ];

  const categories = signal<Category[]>(mockCategories);
  const popularProducts = signal(mockPopularProducts);

  return {
    categories: computed(() => categories()),
    popularProducts: computed(() => popularProducts())
  };
}
