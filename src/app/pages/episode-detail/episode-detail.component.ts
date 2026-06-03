import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService } from '../../services/character.service';
import { Episode } from '../../models/episode.model';
import { Character } from '../../models/character.model';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-loader />
    } @else if (error()) {
      <app-error-message [message]="error()!" (retry)="loadEpisode()" />
    } @else {
      @if (episode(); as ep) {
        <div class="detail-page">
          <h1>{{ ep.episode }} — {{ ep.name }}</h1>
          <p><strong>Date de diffusion :</strong> {{ ep.air_date }}</p>
          <h2>Personnages ({{ characters().length }})</h2>
          <div class="grid">
            @for (char of characters(); track char.id) {
              <a [routerLink]="['/characters', char.id]" class="char-card">
                <img [src]="char.image" [alt]="char.name" />
                <span>{{ char.name }}</span>
              </a>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .detail-page { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .char-card { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
    .char-card img { width: 100%; }
    .char-card span { padding: 0.5rem; text-align: center; }
  `]
})
export class EpisodeDetailComponent implements OnInit {
  id = input.required<string>();
  private episodeService = inject(EpisodeService);
  private characterService = inject(CharacterService);

  episode = signal<Episode | null>(null);
  characters = signal<Character[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void { this.loadEpisode(); }

  loadEpisode(): void {
    this.loading.set(true);
    this.error.set(null);
    this.episodeService.getById(Number(this.id())).pipe(
      catchError(() => { this.error.set('Épisode introuvable'); this.loading.set(false); return of(null); })
    ).subscribe(ep => {
      this.loading.set(false);
      if (ep) {
        this.episode.set(ep);
        if (ep.characters.length > 0) {
          const ids = ep.characters.slice(0, 20).map(url => Number(url.split('/').pop()));
          this.characterService.getMany(ids).pipe(catchError(() => of([]))).subscribe(chars => {
            const result = Array.isArray(chars) ? chars : [chars];
            this.characters.set(result as Character[]);
          });
        }
      }
    });
  }
}
