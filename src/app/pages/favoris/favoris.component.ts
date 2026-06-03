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
      <div class="page-header">
        <h1 class="page-title">⭐ Mes Favoris</h1>
        <p class="page-subtitle">
          {{ favorisService.nombre() }} personnage{{ favorisService.nombre() !== 1 ? 's' : '' }} sauvegardé{{ favorisService.nombre() !== 1 ? 's' : '' }}
        </p>
      </div>

      @if (favorisService.favoris().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🌌</div>
          <h2 class="empty-title">Aucun favori pour l'instant</h2>
          <p class="empty-text">Explorez l'univers et ajoutez vos personnages préférés ici.</p>
          <a routerLink="/characters" class="cta-btn">🛸 Parcourir les personnages</a>
        </div>
      } @else {
        <div class="stats-bar">
          <span class="stat alive">🟢 {{ favorisService.repartitionParStatut().alive }} vivants</span>
          <span class="stat dead">🔴 {{ favorisService.repartitionParStatut().dead }} morts</span>
          <span class="stat unknown">⚪ {{ favorisService.repartitionParStatut().unknown }} inconnus</span>
        </div>
        <div class="grid">
          @for (character of favorisService.favoris(); track character.id) {
            <app-character-card [character]="character" (toggleFavori)="toggle($event)" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2rem;
      font-weight: 900;
      color: #e2e8f0;
    }
    .page-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .stats-bar {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
      flex-wrap: wrap;
    }
    .stat {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.35rem 0.9rem;
      border-radius: 10px;
    }
    .stat.alive { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
    .stat.dead { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
    .stat.unknown { background: rgba(148, 163, 184, 0.1); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 5rem 2rem;
      text-align: center;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 24px;
    }
    .empty-icon {
      font-size: 5rem;
      filter: drop-shadow(0 0 16px rgba(0, 212, 170, 0.3));
    }
    .empty-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #e2e8f0;
    }
    .empty-text {
      color: #94a3b8;
      font-size: 0.95rem;
      max-width: 380px;
    }
    .cta-btn {
      margin-top: 0.5rem;
      padding: 0.7rem 1.75rem;
      background: #00d4aa;
      color: #0f0f1a;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .cta-btn:hover {
      background: #00f0c3;
      box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
      transform: translateY(-1px);
    }
  `]
})
export class FavorisComponent {
  favorisService = inject(FavorisService);

  toggle(character: Character): void {
    this.favorisService.toggle(character);
  }
}
