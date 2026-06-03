import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="paginator">
      <button (click)="prev.emit()" [disabled]="currentPage() <= 1" class="pag-btn">
        <span>&#8592;</span> Précédent
      </button>
      <div class="page-info">
        <span class="current-page">{{ currentPage() }}</span>
        <span class="separator">/</span>
        <span class="total-pages">{{ totalPages() }}</span>
      </div>
      <button (click)="next.emit()" [disabled]="currentPage() >= totalPages()" class="pag-btn">
        Suivant <span>&#8594;</span>
      </button>
    </div>
  `,
  styles: [`
    .paginator {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .pag-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.25rem;
      background: #1a1a2e;
      color: #e2e8f0;
      border: 1px solid #2d2d44;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .pag-btn:hover:not(:disabled) {
      background: #16213e;
      border-color: #00d4aa;
      color: #00d4aa;
      box-shadow: 0 0 12px rgba(0, 212, 170, 0.2);
    }
    .pag-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .page-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1.25rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 10px;
      font-weight: 700;
    }
    .current-page {
      color: #00d4aa;
      font-size: 1.05rem;
    }
    .separator {
      color: #2d2d44;
    }
    .total-pages {
      color: #94a3b8;
    }
  `]
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  prev = output<void>();
  next = output<void>();
}
