import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [RouterLink, StatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <img [src]="character().image" [alt]="character().name" />
      <div class="card-body">
        <h3>
          <a [routerLink]="['/characters', character().id]">{{ character().name }}</a>
        </h3>
        <p>{{ character().status | status }}</p>
        <p>{{ character().species }}</p>
        <button (click)="toggleFavori.emit(character())" class="fav-btn">
          {{ isFavori() ? '⭐' : '☆' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
    .card-body { padding: 0.75rem; }
    img { width: 100%; }
    .fav-btn { cursor: pointer; background: none; border: none; font-size: 1.5rem; }
  `]
})
export class CharacterCardComponent {
  private favorisService = inject(FavorisService);
  character = input.required<Character>();
  toggleFavori = output<Character>();

  isFavori(): boolean {
    return this.favorisService.isFavori(this.character().id);
  }
}
