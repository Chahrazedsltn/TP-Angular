import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';
import { Character } from '../../models/character.model';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [RouterLink, CharacterCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <h1>⭐ Mes Favoris ({{ favorisService.nombre() }})</h1>
      @if (favorisService.favoris().length === 0) {
        <p>Aucun favori pour l'instant. <a routerLink="/characters">Parcourez les personnages</a></p>
      } @else {
        <div class="grid">
          @for (character of favorisService.favoris(); track character.id) {
            <app-character-card [character]="character" (toggleFavori)="toggle($event)" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  `]
})
export class FavorisComponent {
  favorisService = inject(FavorisService);

  toggle(character: Character): void {
    this.favorisService.toggle(character);
  }
}
