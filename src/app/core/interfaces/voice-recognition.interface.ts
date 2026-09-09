import { Signal } from '@angular/core';

export interface IVoiceRecognitionService {
  isListening: Signal<boolean>;
  recognizedText: Signal<string>;
  isOfflineMode: Signal<boolean>;
  voskReady: Signal<boolean>;
  startListening(): void;
  stopListening(): void;
}
