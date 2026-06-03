import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class.is-favori]="isFavori()">
      <div class="card-img-wrapper">
        <img [src]="character().image" [alt]="character().name" class="card-img" />
        <div class="status-badge" [class]="'status-' + character().status.toLowerCase()">
          <span class="status-dot"></span>
          {{ character().status }}
        </div>
        <button (click)="toggleFavori.emit(character())" class="fav-btn" [title]="isFavori() ? 'Retirer des favoris' : 'Ajouter aux favoris'">
          {{ isFavori() ? '⭐' : '☆' }}
        </button>
      </div>
      <div class="card-body">
        <h3 class="card-name">
          <a [routerLink]="['/characters', character().id]">{{ character().name }}</a>
        </h3>
        <p class="card-species">{{ character().species }}</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: rgba(10, 15, 45, 0.75);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #2d2d44;
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      cursor: pointer;
      position: relative;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0, 212, 170, 0.15);
      border-color: rgba(0, 212, 170, 0.4);
    }
    .card.is-favori {
      border-color: rgba(245, 158, 11, 0.4);
    }
    .card.is-favori:hover {
      box-shadow: 0 16px 40px rgba(245, 158, 11, 0.15);
    }
    .card-img-wrapper {
      position: relative;
      overflow: hidden;
    }
    .card-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease;
    }
    .card:hover .card-img {
      transform: scale(1.05);
    }
    .status-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      backdrop-filter: blur(8px);
      text-transform: uppercase;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-alive {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.4);
    }
    .status-alive .status-dot { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
    .status-dead {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.4);
    }
    .status-dead .status-dot { background: #ef4444; }
    .status-unknown {
      background: rgba(148, 163, 184, 0.2);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.3);
    }
    .status-unknown .status-dot { background: #94a3b8; }
    .fav-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(15, 15, 26, 0.7);
      border: 1px solid #2d2d44;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
    }
    .fav-btn:hover {
      background: rgba(245, 158, 11, 0.2);
      border-color: rgba(245, 158, 11, 0.5);
      transform: scale(1.1);
    }
    .card-body {
      padding: 0.85rem 1rem;
    }
    .card-name {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-name a {
      color: #e2e8f0;
      text-decoration: none;
      transition: color 0.2s;
    }
    .card-name a:hover {
      color: #00d4aa;
    }
    .card-species {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
    }
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
