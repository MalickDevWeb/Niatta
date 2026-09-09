import { signal, computed } from '@angular/core';
import { Product, PriceComparison } from '../models/compare.model';

export function useCompare() {
  // Mock Products
  const mockProducts: Product[] = [
    {
      id: 'p1',
      name: 'Riz brisé',
      brand: 'Sunéor',
      weight: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1595088219463-718f26a11128?auto=format&fit=crop&w=150&q=80',
      officialPriceCap: 600
    },
    {
      id: 'p2',
      name: 'Huile végétale',
      brand: 'Lesieur',
      weight: '1L',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80',
      officialPriceCap: 1100
    },
    {
      id: 'p3',
      name: 'Sucre en poudre',
      brand: 'Cristal',
      weight: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=150&q=80',
      officialPriceCap: 650
    }
  ];

  // Mock Comparisons for selected product
  const mockComparisons: PriceComparison[] = [
    {
      id: 'c1',
      productId: 'p1',
      shop: {
        id: 's1',
        name: 'Supermarché ABC',
        location: 'Dakar',
        distanceKm: 1.2,
        rating: 4.5,
        reviewCount: 120,
        logoType: 'green'
      },
      price: 650,
      currency: 'FCFA',
      inStock: true,
      stockStatus: 'En stock'
    },
    {
      id: 'c2',
      productId: 'p1',
      shop: {
        id: 's2',
        name: 'Marché HLM',
        location: 'Dakar',
        distanceKm: 1.8,
        rating: 4.2,
        reviewCount: 86,
        logoType: 'gray'
      },
      price: 720,
      currency: 'FCFA',
      inStock: true,
      stockStatus: 'En stock'
    },
    {
      id: 'c3',
      productId: 'p1',
      shop: {
        id: 's3',
        name: 'Auchan',
        location: 'Dakar',
        distanceKm: 3.1,
        rating: 4.7,
        reviewCount: 234,
        logoType: 'gray'
      },
      price: 780,
      currency: 'FCFA',
      inStock: true,
      stockStatus: 'Stock limité'
    }
  ];

  // Signals
  const products = signal<Product[]>(mockProducts);
  const selectedProduct = signal<Product>(mockProducts[0]);
  const comparisons = signal<PriceComparison[]>(mockComparisons);
  
  // Sort state (true = ascending, false = descending)
  const isSortAscending = signal<boolean>(true);

  // Computed
  const bestPrice = computed(() => {
    const list = comparisons();
    if (!list || list.length === 0) return null;
    return list.reduce((prev, current) => (prev.price < current.price) ? prev : current);
  });

  const worstPrice = computed(() => {
    const list = comparisons();
    if (!list || list.length === 0) return null;
    return list.reduce((prev, current) => (prev.price > current.price) ? prev : current);
  });

  const sortedComparisons = computed(() => {
    const list = [...comparisons()];
    const asc = isSortAscending();
    return list.sort((a, b) => asc ? a.price - b.price : b.price - a.price);
  });

  // Actions
  const selectProduct = (product: Product) => {
    selectedProduct.set(product);
    // In a real app, this is where we would fetch the price comparisons for the new product
    // For now, we mock an update
    comparisons.set(mockComparisons.map(c => ({
      ...c, 
      price: c.price + Math.floor(Math.random() * 200 - 100) // Shuffle prices slightly
    })));
  };

  const toggleSort = () => {
    isSortAscending.update(val => !val);
  };

  return {
    products: computed(() => products()),
    selectedProduct: computed(() => selectedProduct()),
    comparisons: sortedComparisons,
    bestPrice,
    worstPrice,
    isSortAscending: computed(() => isSortAscending()),
    selectProduct,
    toggleSort
  };
}
