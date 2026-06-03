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
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent, StatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-loader />
    } @else if (error()) {
      <app-error-message [message]="error()!" (retry)="loadCharacter()" />
    } @else {
      @if (character(); as c) {
        <div class="detail-page">
          <img [src]="c.image" [alt]="c.name" class="character-img" />
          <div class="info">
            <h1>{{ c.name }}</h1>
            <p><strong>Statut :</strong> {{ c.status | status }}</p>
            <p><strong>Espèce :</strong> {{ c.species }}</p>
            <p><strong>Genre :</strong> {{ c.gender }}</p>
            @if (c.type) {
              <p><strong>Type :</strong> {{ c.type }}</p>
            }
            <p><strong>Origine :</strong>
              @if (originId()) {
                <a [routerLink]="['/locations', originId()]">{{ c.origin.name }}</a>
              } @else {
                {{ c.origin.name }}
              }
            </p>
            <p><strong>Lieu actuel :</strong>
              @if (locationId()) {
                <a [routerLink]="['/locations', locationId()]">{{ c.location.name }}</a>
              } @else {
                {{ c.location.name }}
              }
            </p>
            <div class="fav-section">
              <button (click)="toggleFavori(c)" class="fav-btn">
                {{ isFavori() ? '⭐ Retirer des favoris' : '☆ Ajouter aux favoris' }}
              </button>
            </div>
          </div>
        </div>
        <div class="episodes-section">
          <h2>Épisodes ({{ episodes().length }})</h2>
          <div class="episodes-grid">
            @for (ep of episodes(); track ep.id) {
              <a [routerLink]="['/episodes', ep.id]" class="ep-card">
                <strong>{{ ep.episode }}</strong>
                <span>{{ ep.name }}</span>
              </a>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .detail-page { display: flex; gap: 2rem; max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    .character-img { width: 300px; border-radius: 12px; }
    .info { flex: 1; }
    .fav-btn { padding: 0.5rem 1rem; cursor: pointer; margin-top: 1rem; }
    .episodes-section { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
    .ep-card { display: flex; flex-direction: column; padding: 0.75rem; border: 1px solid #ccc; border-radius: 8px; text-decoration: none; color: inherit; }
    .ep-card:hover { background: #f0f0f0; }
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
