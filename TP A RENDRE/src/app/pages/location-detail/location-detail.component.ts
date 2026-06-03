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
        <div class="detail-page">
          <h1>{{ loc.name }}</h1>
          <p><strong>Type :</strong> {{ loc.type }}</p>
          <p><strong>Dimension :</strong> {{ loc.dimension }}</p>
          <h2>Résidents ({{ residents().length }})</h2>
          <div class="grid">
            @for (char of residents(); track char.id) {
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
