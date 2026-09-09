import { Injectable, signal } from '@angular/core';
import { ICameraService } from '../interfaces/camera.interface';

@Injectable({
  providedIn: 'root'
})
export class CameraService implements ICameraService {
  public capturedImage = signal<string | null>(null);

  setImage(base64: string): void {
    this.capturedImage.set(base64);
  }

  clearImage(): void {
    this.capturedImage.set(null);
  }
}
