import { Signal } from '@angular/core';

export interface ICameraService {
  capturedImages: Signal<string[]>;
  addImage(base64: string): void;
  removeImage(index: number): void;
  clearImages(): void;
}
