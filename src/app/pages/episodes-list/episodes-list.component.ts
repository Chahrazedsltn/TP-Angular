import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../models/episode.model';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">📺 Épisodes</h1>
        <p class="page-subtitle">Toutes les aventures inter-dimensionnelles</p>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadEpisodes()" />
      } @else {
        <div class="grid">
          @for (ep of episodes(); track ep.id) {
            <a [routerLink]="['/episodes', ep.id]" class="ep-card">
              <div class="ep-header">
                <span class="season-badge">{{ getSeasonLabel(ep.episode) }}</span>
                <span class="ep-number">{{ ep.episode }}</span>
              </div>
              <h3 class="ep-name">{{ ep.name }}</h3>
              <p class="ep-date">📅 {{ ep.air_date }}</p>
              <span class="ep-arrow">→</span>
            </a>
          }
        </div>
        <app-paginator [currentPage]="page()" [totalPages]="totalPages()" (prev)="prevPage()" (next)="nextPage()" />
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
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.1rem;
    }
    .ep-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 16px;
      text-decoration: none;
      color: #e2e8f0;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .ep-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00d4aa, #7c3aed);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .ep-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 170, 0.35);
      box-shadow: 0 10px 28px rgba(0, 212, 170, 0.1);
      background: #16213e;
    }
    .ep-card:hover::before { opacity: 1; }
    .ep-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .season-badge {
      padding: 0.2rem 0.7rem;
      background: rgba(124, 58, 237, 0.15);
      color: #a78bfa;
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .ep-number {
      font-size: 0.75rem;
      font-weight: 700;
      color: #00d4aa;
      letter-spacing: 0.05em;
    }
    .ep-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #e2e8f0;
      line-height: 1.3;
      flex: 1;
    }
    .ep-date {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .ep-arrow {
      font-size: 0.85rem;
      color: #2d2d44;
      transition: all 0.2s;
      align-self: flex-end;
    }
    .ep-card:hover .ep-arrow {
      color: #00d4aa;
      transform: translateX(4px);
    }
  `]
})
export class EpisodesListComponent implements OnInit {
  private episodeService = inject(EpisodeService);
  episodes = signal<Episode[]>([]);
  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void { this.loadEpisodes(); }

  loadEpisodes(): void {
    this.loading.set(true);
    this.error.set(null);
    this.episodeService.getAll(this.page()).pipe(
      catchError(() => { this.error.set('Erreur de chargement'); this.loading.set(false); return of(null); })
    ).subscribe(res => {
      this.loading.set(false);
      if (res) { this.episodes.set(res.results); this.totalPages.set(res.info.pages); }
    });
  }

  getSeasonLabel(episode: string): string {
    const match = episode.match(/S(\d+)/i);
    return match ? `Saison ${parseInt(match[1], 10)}` : episode;
  }

  prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.loadEpisodes(); } }
  nextPage(): void { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.loadEpisodes(); } }
}
