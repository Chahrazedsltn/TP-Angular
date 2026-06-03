import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        [(ngModel)]="term"
        (ngModelChange)="search.emit($event)"
        placeholder="Rechercher..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      width: 100%;
      max-width: 400px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.65rem 1rem 0.65rem 2.5rem;
      background: rgba(10, 15, 45, 0.75);
      border: 1px solid #2d2d44;
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .search-input::placeholder { color: #94a3b8; }
    .search-input:focus {
      border-color: #00d4aa;
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
  `]
})
export class SearchBarComponent {
  term = '';
  search = output<string>();
}
