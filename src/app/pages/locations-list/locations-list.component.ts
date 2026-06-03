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
      <h1>Lieux</h1>
      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="loadLocations()" />
      } @else {
        <div class="grid">
          @for (loc of locations(); track loc.id) {
            <a [routerLink]="['/locations', loc.id]" class="loc-card">
              <h3>{{ loc.name }}</h3>
              <p>{{ loc.type }}</p>
              <p>{{ loc.dimension }}</p>
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
    .loc-card { display: block; padding: 1rem; border: 1px solid #ccc; border-radius: 8px; text-decoration: none; color: inherit; }
    .loc-card:hover { background: #f0f0f0; }
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
