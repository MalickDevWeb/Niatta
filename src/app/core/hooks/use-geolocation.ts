import { signal, computed } from '@angular/core';

export function useGeolocation() {
  const latitude = signal<number | null>(null);
  const longitude = signal<number | null>(null);
  const error = signal<string | null>(null);
  const isLoading = signal<boolean>(false);

  const requestPosition = () => {
    isLoading.set(true);
    error.set(null);

    if (!navigator.geolocation) {
      error.set('La géolocalisation est indisponible sur cet appareil.');
      isLoading.set(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        latitude.set(pos.coords.latitude);
        longitude.set(pos.coords.longitude);
        isLoading.set(false);
      },
      (err) => {
        error.set(err.message);
        isLoading.set(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return { 
    latitude: computed(() => latitude()), 
    longitude: computed(() => longitude()), 
    error: computed(() => error()), 
    isLoading: computed(() => isLoading()),
    requestPosition 
  };
}
