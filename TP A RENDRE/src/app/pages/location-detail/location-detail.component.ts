import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { CharacterService } from '../../services/character.service';
import { Location } from '../../models/location.model';
import { Character } from '../../models/character.model';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [RouterLink, LoaderComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-loader />
    } @else if (error()) {
      <app-error-message [message]="error()!" (retry)="loadLocation()" />
    } @else {
      @if (location(); as loc) {
        <div class="detail-container">
          <!-- Hero header -->
          <div class="hero-header">
            <div class="hero-icon">🌍</div>
            <div class="hero-content">
              <div class="breadcrumb">
                <a routerLink="/locations">← Tous les lieux</a>
              </div>
              <h1 class="hero-name">{{ loc.name }}</h1>
              <div class="hero-tags">
                @if (loc.type) {
                  <span class="tag">{{ loc.type }}</span>
                }
                @if (loc.dimension && loc.dimension !== 'unknown') {
                  <span class="tag dim">🌀 {{ loc.dimension }}</span>
                }
              </div>
            </div>
          </div>

          <!-- Residents -->
          <div class="residents-section">
            <h2 class="section-title">
              <span>👥 Résidents</span>
              <span class="count-badge">{{ residents().length }}</span>
            </h2>
            @if (residents().length === 0) {
              <div class="empty-state">
                <div class="empty-icon">🏜️</div>
                <p>Aucun résident connu dans ce lieu.</p>
              </div>
            } @else {
              <div class="residents-grid">
                @for (char of residents(); track char.id) {
                  <a [routerLink]="['/characters', char.id]" class="char-card">
                    <div class="char-img-wrapper">
                      <img [src]="char.image" [alt]="char.name" class="char-img" />
                      <div class="status-dot-badge" [class]="'sdot-' + char.status.toLowerCase()"></div>
                    </div>
                    <span class="char-name">{{ char.name }}</span>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .detail-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }
    .hero-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 20px;
      margin-bottom: 2.5rem;
    }
    .hero-icon {
      font-size: 4rem;
      flex-shrink: 0;
      filter: drop-shadow(0 0 12px rgba(0, 212, 170, 0.4));
    }
    .hero-content { flex: 1; }
    .breadcrumb { margin-bottom: 0.5rem; }
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
      margin-bottom: 0.75rem;
    }
    .hero-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .tag {
      padding: 0.3rem 0.85rem;
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
      border: 1px solid rgba(0, 212, 170, 0.3);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .tag.dim {
      background: rgba(124, 58, 237, 0.1);
      color: #a78bfa;
      border-color: rgba(124, 58, 237, 0.3);
    }
    .residents-section {}
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
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .residents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
    }
    .char-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 14px;
      overflow: hidden;
      transition: all 0.25s ease;
    }
    .char-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 212, 170, 0.4);
      box-shadow: 0 8px 20px rgba(0, 212, 170, 0.1);
    }
    .char-img-wrapper {
      position: relative;
      width: 100%;
    }
    .char-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    .char-card:hover .char-img { transform: scale(1.05); }
    .status-dot-badge {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid #1a1a2e;
    }
    .sdot-alive { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
    .sdot-dead { background: #ef4444; }
    .sdot-unknown { background: #94a3b8; }
    .char-name {
      padding: 0.6rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #e2e8f0;
      text-align: center;
      line-height: 1.3;
    }
  `]
})
export class LocationDetailComponent implements OnInit {
  id = input.required<string>();
  private locationService = inject(LocationService);
  private characterService = inject(CharacterService);

  location = signal<Location | null>(null);
  residents = signal<Character[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void { this.loadLocation(); }

  loadLocation(): void {
    this.loading.set(true);
    this.error.set(null);
    this.locationService.getById(Number(this.id())).pipe(
      catchError(() => { this.error.set('Lieu introuvable'); this.loading.set(false); return of(null); })
    ).subscribe(loc => {
      this.loading.set(false);
      if (loc) {
        this.location.set(loc);
        if (loc.residents.length > 0) {
          const ids = loc.residents.slice(0, 20).map(url => Number(url.split('/').pop()));
          this.characterService.getMany(ids).pipe(catchError(() => of([]))).subscribe(chars => {
            const result = Array.isArray(chars) ? chars : [chars];
            this.residents.set(result as Character[]);
          });
        }
      }
    });
  }
}
