import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="paginator">
      <button (click)="prev.emit()" [disabled]="currentPage() <= 1">← Précédent</button>
      <span>Page {{ currentPage() }} / {{ totalPages() }}</span>
      <button (click)="next.emit()" [disabled]="currentPage() >= totalPages()">Suivant →</button>
    </div>
  `,
  styles: [`.paginator { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 1rem; }`]
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  prev = output<void>();
  next = output<void>();
}
