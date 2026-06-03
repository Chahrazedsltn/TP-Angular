import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { LocationService } from '../../services/location.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <h1>🚀 Rick & Morty Explorer</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h2>Personnages</h2>
          <p class="stat-number">{{ totalCharacters() }}</p>
          <a routerLink="/characters">Voir tous →</a>
        </div>
        <div class="stat-card">
          <h2>Lieux</h2>
          <p class="stat-number">{{ totalLocations() }}</p>
          <a routerLink="/locations">Voir tous →</a>
        </div>
        <div class="stat-card">
          <h2>Épisodes</h2>
          <p class="stat-number">{{ totalEpisodes() }}</p>
          <a routerLink="/episodes">Voir tous →</a>
        </div>
        <div class="stat-card favoris-card">
          <h2>⭐ Favoris</h2>
          <p class="stat-number">{{ nombreFavoris() }}</p>
          <div class="repartition">
            <span>🟢 {{ repartition().alive }}</span>
            <span>🔴 {{ repartition().dead }}</span>
            <span>⚪ {{ repartition().unknown }}</span>
          </div>
          <a routerLink="/favoris">Voir mes favoris →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 900px; margin: 0 auto; padding: 2rem; }
    h1 { text-align: center; margin-bottom: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .stat-card { background: #1a1a2e; color: #eee; border-radius: 12px; padding: 1.5rem; text-align: center; }
    .stat-number { font-size: 2.5rem; font-weight: bold; color: #00b4d8; margin: 0.5rem 0; }
    .repartition { display: flex; justify-content: center; gap: 1rem; margin: 0.5rem 0; }
    a { color: #90e0ef; }
  `]
})
export class DashboardComponent implements OnInit {
  private characterService = inject(CharacterService);
  private locationService = inject(LocationService);
  private episodeService = inject(EpisodeService);
  private favorisService = inject(FavorisService);

  totalCharacters = signal(0);
  totalLocations = signal(0);
  totalEpisodes = signal(0);

  nombreFavoris = this.favorisService.nombre;
  repartition = this.favorisService.repartitionParStatut;

  ngOnInit(): void {
    this.characterService.getAll(1).subscribe(r => this.totalCharacters.set(r.info.count));
    this.locationService.getAll(1).subscribe(r => this.totalLocations.set(r.info.count));
    this.episodeService.getAll(1).subscribe(r => this.totalEpisodes.set(r.info.count));
  }
}
