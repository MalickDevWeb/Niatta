import { Injectable, signal } from '@angular/core';
import { ICameraService } from '../interfaces/camera.interface';

@Injectable({
  providedIn: 'root'
})
export class CameraService implements ICameraService {
  public capturedImages = signal<string[]>([]);

  addImage(base64: string): void {
    if (this.capturedImages().length < 3) {
      this.capturedImages.update(images => [...images, base64]);
    }
  }

  removeImage(index: number): void {
    this.capturedImages.update(images => images.filter((_, i) => i !== index));
  }

  clearImages(): void {
    this.capturedImages.set([]);
  }
}
