import { Injectable, signal, NgZone } from '@angular/core';
import { IVoiceRecognitionService } from '../interfaces/voice-recognition.interface';

// Vosk types
declare const createModel: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService implements IVoiceRecognitionService {
  public isListening = signal<boolean>(false);
  public recognizedText = signal<string>('');
  public isOfflineMode = signal<boolean>(!navigator.onLine);
  public voskReady = signal<boolean>(false);

  // Loading state: 'idle' | 'loading' | 'ready' | 'error'
  public voskLoadingState = signal<string>('idle');

  private recognition: any;
  private voskModel: any = null;
  private voskRecognizer: any = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;

  constructor(private ngZone: NgZone) {
    this.initWebSpeechAPI();
    this.setupOnlineOfflineDetection();
  }

  // ─────────────────────────────────────────────────
  // 1. Web Speech API (Online - Primary)
  // ─────────────────────────────────────────────────

  private initWebSpeechAPI() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => this.ngZone.run(() => this.isListening.set(true));
      
      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          const text = event.results[0][0].transcript;
          this.recognizedText.set(text);
        });
      };

      this.recognition.onerror = (event: any) => {
        this.ngZone.run(() => {
          console.warn('[Voice] Web Speech API error:', event.error);
          this.isListening.set(false);
          
          // Si l'erreur est "network", basculer vers Vosk
          if (event.error === 'network' || event.error === 'not-allowed') {
            console.log('[Voice] Switching to offline Vosk mode...');
            this.isOfflineMode.set(true);
            this.startVoskListening();
          }
        });
      };

      this.recognition.onend = () => this.ngZone.run(() => this.isListening.set(false));
    }
  }

  // ─────────────────────────────────────────────────
  // 2. Vosk WASM (Offline - Fallback)
  // ─────────────────────────────────────────────────

  private async initVosk(): Promise<boolean> {
    if (this.voskModel) {
      this.voskReady.set(true);
      return true;
    }

    try {
      this.voskLoadingState.set('loading');
      console.log('[Voice] Loading Vosk model (French offline)...');
      
      const { createModel } = await import('vosk-browser');
      this.voskModel = await createModel('/vosk-model/vosk-model-small-fr.tar.gz');
      
      this.voskReady.set(true);
      this.voskLoadingState.set('ready');
      console.log('[Voice] Vosk model loaded successfully ✅');
      return true;
    } catch (err) {
      console.error('[Voice] Failed to load Vosk model:', err);
      this.voskLoadingState.set('error');
      this.voskReady.set(false);
      return false;
    }
  }

  private async startVoskListening() {
    const ready = await this.initVosk();
    if (!ready) {
      this.ngZone.run(() => {
        this.isListening.set(false);
        alert('Le modèle vocal hors-ligne n\'a pas pu être chargé. Vérifiez votre connexion pour le premier téléchargement.');
      });
      return;
    }

    try {
      // Créer le recognizer
      this.voskRecognizer = new this.voskModel.KaldiRecognizer(16000);
      
      this.voskRecognizer.on('result', (message: any) => {
        this.ngZone.run(() => {
          const text = message.result?.text;
          if (text && text.trim() !== '') {
            console.log('[Voice] Vosk result:', text);
            this.recognizedText.set(text);
            this.stopVoskListening();
          }
        });
      });

      this.voskRecognizer.on('partialresult', (message: any) => {
        // Optionnel : afficher les résultats intermédiaires
        const partial = message.result?.partial;
        if (partial && partial.trim() !== '') {
          console.log('[Voice] Vosk partial:', partial);
        }
      });

      // Obtenir le microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (audioEvent) => {
        try {
          const inputData = audioEvent.inputBuffer.getChannelData(0);
          // Vosk acceptWaveformFloat prend Float32Array + sampleRate
          this.voskRecognizer.acceptWaveformFloat(inputData, 16000);
        } catch (e) {
          // Ignorer les erreurs pendant le traitement audio
        }
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.ngZone.run(() => this.isListening.set(true));
      console.log('[Voice] Vosk listening started 🎤');

      // Auto-stop après 8 secondes
      setTimeout(() => {
        if (this.isListening()) {
          this.stopVoskListening();
        }
      }, 8000);

    } catch (err) {
      console.error('[Voice] Vosk listening error:', err);
      this.ngZone.run(() => this.isListening.set(false));
    }
  }

  private stopVoskListening() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.voskRecognizer) {
      this.voskRecognizer.remove();
      this.voskRecognizer = null;
    }
    this.ngZone.run(() => this.isListening.set(false));
    console.log('[Voice] Vosk listening stopped');
  }

  // ─────────────────────────────────────────────────
  // 3. Online/Offline Detection
  // ─────────────────────────────────────────────────

  private setupOnlineOfflineDetection() {
    window.addEventListener('online', () => {
      this.ngZone.run(() => {
        this.isOfflineMode.set(false);
        console.log('[Voice] Online → Web Speech API mode');
      });
    });

    window.addEventListener('offline', () => {
      this.ngZone.run(() => {
        this.isOfflineMode.set(true);
        console.log('[Voice] Offline → Vosk mode');
      });
    });
  }

  // ─────────────────────────────────────────────────
  // 4. Public API
  // ─────────────────────────────────────────────────

  startListening(): void {
    if (this.isOfflineMode() || !this.recognition) {
      // Mode offline → Vosk
      console.log('[Voice] Using Vosk (offline mode)');
      this.startVoskListening();
    } else {
      // Mode online → Web Speech API
      console.log('[Voice] Using Web Speech API (online mode)');
      try {
        this.recognition.start();
      } catch (e) {
        // Si Web Speech API échoue, essayer Vosk
        console.warn('[Voice] Web Speech API failed, falling back to Vosk');
        this.startVoskListening();
      }
    }
  }

  stopListening(): void {
    if (this.isListening()) {
      // Arrêter les deux moteurs possibles
      if (this.recognition) {
        try { this.recognition.stop(); } catch (e) { /* ignore */ }
      }
      this.stopVoskListening();
    }
  }

  /**
   * Pré-charger le modèle Vosk en arrière-plan.
   * Utile pour l'UX : le modèle sera prêt quand l'utilisateur en aura besoin.
   */
  preloadVoskModel(): void {
    if (!this.voskReady() && this.voskLoadingState() === 'idle') {
      this.initVosk();
    }
  }
}
