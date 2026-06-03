import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="loader">Chargement...</div>`,
  styles: [`.loader { text-align: center; padding: 2rem; font-size: 1.2rem; }`]
})
export class LoaderComponent {}
