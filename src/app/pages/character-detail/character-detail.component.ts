import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-loader />
    } @else if (error()) {
      <app-error-message [message]="error()!" (retry)="loadCharacter()" />
    } @else {
      @if (character(); as c) {
        <div class="detail-container">
          <!-- Hero -->
          <div class="hero">
            <div class="hero-img-wrapper">
              <img [src]="c.image" [alt]="c.name" class="hero-img" />
              <div class="status-badge" [class]="'status-' + c.status.toLowerCase()">
                <span class="status-dot"></span>{{ c.status }}
              </div>
            </div>
            <div class="hero-info">
              <div class="breadcrumb">
                <a routerLink="/characters">← Tous les personnages</a>
              </div>
              <h1 class="hero-name">{{ c.name }}</h1>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Espèce</span>
                  <span class="info-value">{{ c.species }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Genre</span>
                  <span class="info-value">{{ c.gender }}</span>
                </div>
                @if (c.type) {
                  <div class="info-item">
                    <span class="info-label">Type</span>
                    <span class="info-value">{{ c.type }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="info-label">Origine</span>
                  <span class="info-value">
                    @if (originId()) {
                      <a [routerLink]="['/locations', originId()]" class="loc-link">🌍 {{ c.origin.name }}</a>
                    } @else {
                      {{ c.origin.name }}
                    }
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Lieu actuel</span>
                  <span class="info-value">
                    @if (locationId()) {
                      <a [routerLink]="['/locations', locationId()]" class="loc-link">📍 {{ c.location.name }}</a>
                    } @else {
                      {{ c.location.name }}
                    }
                  </span>
                </div>
              </div>
              <button (click)="toggleFavori(c)" class="fav-btn" [class.is-fav]="isFavori()">
                {{ isFavori() ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris' }}
              </button>
            </div>
          </div>

          <!-- Episodes -->
          <div class="episodes-section">
            <h2 class="section-title">
              <span>📺 Épisodes</span>
              <span class="count-badge">{{ episodes().length }}</span>
            </h2>
            <div class="episodes-grid">
              @for (ep of episodes(); track ep.id) {
                <a [routerLink]="['/episodes', ep.id]" class="ep-chip">
                  <span class="ep-code">{{ ep.episode }}</span>
                  <span class="ep-name">{{ ep.name }}</span>
                </a>
              }
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    .hero {
      display: flex;
      gap: 2.5rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 2.5rem;
    }
    .hero-img-wrapper {
      position: relative;
      flex-shrink: 0;
    }
    .hero-img {
      width: 280px;
      height: 280px;
      object-fit: cover;
      display: block;
    }
    .status-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      backdrop-filter: blur(8px);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    .status-alive { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.4); }
    .status-alive .status-dot { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
    .status-dead { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
    .status-dead .status-dot { background: #ef4444; }
    .status-unknown { background: rgba(148, 163, 184, 0.2); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }
    .status-unknown .status-dot { background: #94a3b8; }
    .hero-info {
      flex: 1;
      padding: 2rem 2rem 2rem 0;
      display: flex;
      flex-direction: column;
    }
    .breadcrumb {
      margin-bottom: 0.75rem;
    }
    .breadcrumb a {
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb a:hover { color: #00d4aa; }
    .hero-name {
      font-size: 2rem;
      font-weight: 900;
      color: #e2e8f0;
      margin-bottom: 1.5rem;
    }
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .info-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    .info-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      min-width: 90px;
      padding-top: 0.1rem;
    }
    .info-value {
      color: #e2e8f0;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .loc-link {
      color: #00d4aa;
      text-decoration: none;
      transition: color 0.2s;
    }
    .loc-link:hover { color: #fff; }
    .fav-btn {
      padding: 0.7rem 1.5rem;
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      align-self: flex-start;
      margin-top: auto;
    }
    .fav-btn:hover {
      background: rgba(245, 158, 11, 0.2);
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
    }
    .fav-btn.is-fav {
      background: rgba(245, 158, 11, 0.2);
      border-color: rgba(245, 158, 11, 0.5);
    }

    /* Episodes */
    .episodes-section {}
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.3rem;
      font-weight: 800;
      color: #e2e8f0;
      margin-bottom: 1.25rem;
    }
    .count-badge {
      padding: 0.2rem 0.7rem;
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
      border: 1px solid rgba(0, 212, 170, 0.3);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .episodes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .ep-chip {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.85rem 1rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .ep-chip:hover {
      border-color: #00d4aa;
      background: #16213e;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 212, 170, 0.1);
    }
    .ep-code {
      font-size: 0.75rem;
      font-weight: 800;
      color: #00d4aa;
      letter-spacing: 0.05em;
    }
    .ep-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0;
      line-height: 1.3;
    }
  `]
})
export class CharacterDetailComponent implements OnInit {
  id = input.required<string>();

  private characterService = inject(CharacterService);
  private episodeService = inject(EpisodeService);
  private favorisService = inject(FavorisService);

  character = signal<Character | null>(null);
  episodes = signal<Episode[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  originId = signal<string | null>(null);
  locationId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCharacter();
  }

  loadCharacter(): void {
    this.loading.set(true);
    this.error.set(null);
    this.characterService.getById(Number(this.id())).pipe(
      catchError(() => { this.error.set('Personnage introuvable'); this.loading.set(false); return of(null); })
    ).subscribe(c => {
      this.loading.set(false);
      if (c) {
        this.character.set(c);
        const originUrl = c.origin.url;
        const locationUrl = c.location.url;
        this.originId.set(originUrl ? originUrl.split('/').pop() ?? null : null);
        this.locationId.set(locationUrl ? locationUrl.split('/').pop() ?? null : null);
        if (c.episode.length > 0) {
          const ids = c.episode.map(url => Number(url.split('/').pop()));
          const limited = ids.slice(0, 20);
          this.episodeService.getMany(limited).pipe(
            catchError(() => of([]))
          ).subscribe(eps => {
            const result = Array.isArray(eps) ? eps : [eps];
            this.episodes.set(result as Episode[]);
          });
        }
      }
    });
  }

  isFavori(): boolean {
    const c = this.character();
    return c ? this.favorisService.isFavori(c.id) : false;
  }

  toggleFavori(c: Character): void {
    this.favorisService.toggle(c);
  }
}
