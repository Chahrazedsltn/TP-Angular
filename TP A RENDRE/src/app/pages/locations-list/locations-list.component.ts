import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [RouterLink, PaginatorComponent, LoaderComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">🌍 Lieux</h1>
        <p class="page-subtitle">Explorez toutes les dimensions et planètes de l'univers</p>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadLocations()" />
      } @else {
        <div class="grid">
          @for (loc of locations(); track loc.id) {
            <a [routerLink]="['/locations', loc.id]" class="loc-card">
              <div class="loc-icon">🌐</div>
              <div class="loc-content">
                <h3 class="loc-name">{{ loc.name }}</h3>
                <div class="loc-meta">
                  @if (loc.type) {
                    <span class="meta-tag">{{ loc.type }}</span>
                  }
                  @if (loc.dimension && loc.dimension !== 'unknown') {
                    <span class="meta-tag dim">{{ loc.dimension }}</span>
                  }
                </div>
              </div>
              <span class="loc-arrow">→</span>
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .loc-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(10, 15, 45, 0.75);
      border: 1px solid #2d2d44;
      border-radius: 16px;
      text-decoration: none;
      color: #e2e8f0;
      transition: all 0.25s ease;
    }
    .loc-card:hover {
      transform: translateY(-3px);
      border-color: rgba(0, 212, 170, 0.4);
      box-shadow: 0 8px 24px rgba(0, 212, 170, 0.1);
      background: rgba(15, 25, 60, 0.85);
    }
    .loc-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
      filter: drop-shadow(0 0 6px rgba(0, 212, 170, 0.3));
    }
    .loc-content {
      flex: 1;
      min-width: 0;
    }
    .loc-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 0.4rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .loc-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .meta-tag {
      padding: 0.15rem 0.6rem;
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
      border: 1px solid rgba(0, 212, 170, 0.2);
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .meta-tag.dim {
      background: rgba(124, 58, 237, 0.1);
      color: #a78bfa;
      border-color: rgba(124, 58, 237, 0.2);
    }
    .loc-arrow {
      color: #2d2d44;
      font-size: 1rem;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .loc-card:hover .loc-arrow {
      color: #00d4aa;
      transform: translateX(4px);
    }
  `]
})
export class LocationsListComponent implements OnInit {
  private locationService = inject(LocationService);
  locations = signal<Location[]>([]);
  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void { this.loadLocations(); }

  loadLocations(): void {
    this.loading.set(true);
    this.error.set(null);
    this.locationService.getAll(this.page()).pipe(
      catchError(() => { this.error.set('Erreur de chargement'); this.loading.set(false); return of(null); })
    ).subscribe(res => {
      this.loading.set(false);
      if (res) { this.locations.set(res.results); this.totalPages.set(res.info.pages); }
    });
  }

  prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.loadLocations(); } }
  nextPage(): void { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.loadLocations(); } }
}
