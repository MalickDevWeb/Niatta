import { signal, computed } from '@angular/core';

export const REGIONS = [
  'Dakar',
  'Thiès',
  'Diourbel',
  'Saint-Louis',
  'Ziguinchor',
  'Kaolack',
  'Louga',
  'Fatick',
  'Kolda',
  'Matam',
  'Kaffrine',
  'Kédougou',
  'Sédhiou'
];

// We use a global signal instance here so the state is shared across all components
const selectedRegion = signal<string>('Dakar');

export function useRegion() {
  const selectRegion = (region: string) => {
    selectedRegion.set(region);
  };

  return {
    regions: REGIONS,
    selectedRegion: computed(() => selectedRegion()),
    selectRegion
  };
}
