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
      <!-- Hero -->
      <div class="hero">
        <div class="hero-content">
          <div class="hero-badge">🛸 Bienvenue dans l'univers</div>
          <h1 class="hero-title">Rick <span class="accent">&</span> Morty<br>Explorer</h1>
          <p class="hero-subtitle">Explorez les personnages, lieux et épisodes de la dimension C-137 et au-delà.</p>
          <div class="hero-actions">
            <a routerLink="/characters" class="btn-primary">Découvrir les personnages</a>
            <a routerLink="/episodes" class="btn-secondary">Voir les épisodes</a>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="portal-ring portal-ring-1"></div>
          <div class="portal-ring portal-ring-2"></div>
          <div class="portal-ring portal-ring-3"></div>
          <span class="portal-emoji">🌀</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <h2 class="section-title">Statistiques de l'univers</h2>
        <div class="stats-grid">
          <a routerLink="/characters" class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-content">
              <p class="stat-number">{{ totalCharacters() }}</p>
              <p class="stat-label">Personnages</p>
            </div>
            <span class="stat-arrow">→</span>
          </a>
          <a routerLink="/locations" class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-content">
              <p class="stat-number">{{ totalLocations() }}</p>
              <p class="stat-label">Lieux</p>
            </div>
            <span class="stat-arrow">→</span>
          </a>
          <a routerLink="/episodes" class="stat-card">
            <div class="stat-icon">📺</div>
            <div class="stat-content">
              <p class="stat-number">{{ totalEpisodes() }}</p>
              <p class="stat-label">Épisodes</p>
            </div>
            <span class="stat-arrow">→</span>
          </a>
          <a routerLink="/favoris" class="stat-card favoris-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <p class="stat-number">{{ nombreFavoris() }}</p>
              <p class="stat-label">Favoris</p>
              <div class="repartition">
                <span class="rep-alive">● {{ repartition().alive }} vivants</span>
                <span class="rep-dead">● {{ repartition().dead }} morts</span>
                <span class="rep-unknown">● {{ repartition().unknown }} inconnus</span>
              </div>
            </div>
            <span class="stat-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Hero */
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 24px;
      border: 1px solid #2d2d44;
      margin-bottom: 3rem;
      overflow: hidden;
      position: relative;
      gap: 2rem;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(0, 212, 170, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content {
      flex: 1;
      z-index: 1;
    }
    .hero-badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
      border: 1px solid rgba(0, 212, 170, 0.3);
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 1.2rem;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      color: #e2e8f0;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    .accent { color: #00d4aa; }
    .hero-subtitle {
      color: #94a3b8;
      font-size: 1rem;
      line-height: 1.6;
      max-width: 480px;
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn-primary {
      padding: 0.7rem 1.5rem;
      background: #00d4aa;
      color: #0f0f1a;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid #00d4aa;
    }
    .btn-primary:hover {
      background: #00f0c3;
      box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
      transform: translateY(-1px);
    }
    .btn-secondary {
      padding: 0.7rem 1.5rem;
      background: transparent;
      color: #e2e8f0;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      border: 1px solid #2d2d44;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      border-color: #00d4aa;
      color: #00d4aa;
    }

    /* Portal decoration */
    .hero-decoration {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .portal-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid rgba(0, 212, 170, 0.25);
      animation: rotate 8s linear infinite;
    }
    .portal-ring-1 { width: 160px; height: 160px; }
    .portal-ring-2 { width: 120px; height: 120px; border-color: rgba(124, 58, 237, 0.3); animation-duration: 6s; animation-direction: reverse; }
    .portal-ring-3 { width: 80px; height: 80px; border-color: rgba(0, 212, 170, 0.4); animation-duration: 4s; }
    .portal-emoji {
      font-size: 3rem;
      filter: drop-shadow(0 0 16px #00d4aa);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes rotate { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

    /* Stats */
    .stats-section {}
    .section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #e2e8f0;
      margin-bottom: 1.5rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 16px;
      text-decoration: none;
      color: #e2e8f0;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.04), transparent);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 170, 0.4);
      box-shadow: 0 12px 30px rgba(0, 212, 170, 0.1);
    }
    .stat-card:hover::before { opacity: 1; }
    .favoris-card:hover {
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 12px 30px rgba(245, 158, 11, 0.1);
    }
    .stat-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 6px rgba(0, 212, 170, 0.4));
    }
    .stat-content {
      flex: 1;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: 900;
      color: #00d4aa;
      line-height: 1;
      margin-bottom: 0.2rem;
    }
    .stat-label {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-arrow {
      color: #2d2d44;
      font-size: 1.2rem;
      transition: all 0.2s;
    }
    .stat-card:hover .stat-arrow {
      color: #00d4aa;
      transform: translateX(4px);
    }
    .repartition {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-top: 0.5rem;
    }
    .rep-alive { color: #22c55e; font-size: 0.75rem; font-weight: 700; }
    .rep-dead { color: #ef4444; font-size: 0.75rem; font-weight: 700; }
    .rep-unknown { color: #94a3b8; font-size: 0.75rem; font-weight: 700; }
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
