import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="text"
      [(ngModel)]="term"
      (ngModelChange)="search.emit($event)"
      placeholder="Rechercher..."
      class="search-input"
    />
  `,
  styles: [`.search-input { padding: 0.5rem; width: 100%; max-width: 400px; }`]
})
export class SearchBarComponent {
  term = '';
  search = output<string>();
}
