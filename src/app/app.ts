import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaInstallPromptComponent } from './shared/components/pwa-install-prompt/pwa-install-prompt.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PwaInstallPromptComponent],
  template: `
    <router-outlet></router-outlet>
    <app-pwa-install-prompt></app-pwa-install-prompt>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-angular');
}
