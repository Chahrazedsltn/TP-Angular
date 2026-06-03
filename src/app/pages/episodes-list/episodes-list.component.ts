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
      <h1>Épisodes</h1>
      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadEpisodes()" />
      } @else {
        <div class="grid">
          @for (ep of episodes(); track ep.id) {
            <a [routerLink]="['/episodes', ep.id]" class="ep-card">
              <strong>{{ ep.episode }}</strong>
              <h3>{{ ep.name }}</h3>
              <p>{{ ep.air_date }}</p>
            </a>
          }
        </div>
        <app-paginator [currentPage]="page()" [totalPages]="totalPages()" (prev)="prevPage()" (next)="nextPage()" />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
    .ep-card { display: block; padding: 1rem; border: 1px solid #ccc; border-radius: 8px; text-decoration: none; color: inherit; }
    .ep-card:hover { background: #f0f0f0; }
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

  prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.loadEpisodes(); } }
  nextPage(): void { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.loadEpisodes(); } }
}
