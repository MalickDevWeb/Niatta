import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;
  
  // Signaux pour contrôler l'affichage des popups
  public showInstallPrompt = signal<boolean>(false);
  public isIOS = signal<boolean>(false);

  constructor() {
    this.initPwaLogic();
  }

  private initPwaLogic() {
    // 1. Détection iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone === true);

    if (isIosDevice && !isStandalone) {
      this.isIOS.set(true);
      // Afficher le popup iOS si l'utilisateur n'a pas déjà refusé (on pourrait utiliser le localStorage)
      const hasDismissed = localStorage.getItem('pwa-ios-dismissed');
      if (!hasDismissed) {
        setTimeout(() => this.showInstallPrompt.set(true), 3000); // Délai avant affichage
      }
    }

    // 2. Détection Android / Chrome (beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
      // Empêcher l'affichage de l'invite par défaut
      e.preventDefault();
      // Sauvegarder l'événement pour le déclencher plus tard
      this.deferredPrompt = e;
      
      const hasDismissed = localStorage.getItem('pwa-android-dismissed');
      if (!hasDismissed) {
        this.showInstallPrompt.set(true);
      }
    });

    // Optionnel : Écouter l'installation réussie
    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt.set(false);
      this.deferredPrompt = null;
    });
  }

  public async installPwa() {
    if (this.isIOS()) {
      // Sur iOS, on ne peut pas forcer l'installation par code, l'utilisateur doit suivre les instructions visuelles
      return;
    }

    if (!this.deferredPrompt) {
      return;
    }

    // Afficher l'invite native
    this.deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log("L'utilisateur a accepté l'installation PWA");
    } else {
      console.log("L'utilisateur a refusé l'installation PWA");
    }
    
    this.deferredPrompt = null;
    this.showInstallPrompt.set(false);
  }

  public dismissPrompt() {
    this.showInstallPrompt.set(false);
    // Sauvegarder le refus pour ne pas spammer
    if (this.isIOS()) {
      localStorage.setItem('pwa-ios-dismissed', 'true');
    } else {
      localStorage.setItem('pwa-android-dismissed', 'true');
    }
  }
}
