import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-box">
      <div class="error-icon">⚠️</div>
      <p class="error-text">{{ message() }}</p>
      <button (click)="retry.emit()" class="retry-btn">
        🔄 Réessayer
      </button>
    </div>
  `,
  styles: [`
    .error-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem 2rem;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 16px;
      max-width: 480px;
      margin: 3rem auto;
      text-align: center;
    }
    .error-icon {
      font-size: 3rem;
      filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5));
    }
    .error-text {
      color: #fca5a5;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
    }
    .retry-btn {
      padding: 0.6rem 1.5rem;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .retry-btn:hover {
      background: rgba(239, 68, 68, 0.25);
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
    }
  `]
})
export class ErrorMessageComponent {
  message = input<string>('Une erreur est survenue');
  retry = output<void>();
}
