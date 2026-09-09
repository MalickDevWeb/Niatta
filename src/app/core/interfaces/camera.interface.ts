import { Signal } from '@angular/core';

export interface ICameraService {
  capturedImage: Signal<string | null>;
  setImage(base64: string): void;
  clearImage(): void;
}
