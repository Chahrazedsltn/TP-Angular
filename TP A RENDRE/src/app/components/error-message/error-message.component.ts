import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error">
      <p>{{ message() }}</p>
      <button (click)="retry.emit()">Réessayer</button>
    </div>
  `,
  styles: [`.error { text-align: center; padding: 2rem; color: red; }`]
})
export class ErrorMessageComponent {
  message = input<string>('Une erreur est survenue');
  retry = output<void>();
}
