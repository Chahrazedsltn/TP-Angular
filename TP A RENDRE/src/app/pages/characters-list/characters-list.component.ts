import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { FavorisService } from '../../services/favoris.service';
import { Character } from '../../models/character.model';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CharacterCardComponent, SearchBarComponent, PaginatorComponent, LoaderComponent, ErrorMessageComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">👤 Personnages</h1>
        <p class="page-subtitle">{{ totalCharacters() }} personnages dans l'univers Rick & Morty</p>
      </div>

      <div class="filters-bar">
        <app-search-bar (search)="onSearch($event)" />
        <select [(ngModel)]="status" (ngModelChange)="onStatusChange($event)" class="status-select">
          <option value="">Tous les statuts</option>
          <option value="alive">🟢 Vivant</option>
          <option value="dead">🔴 Mort</option>
          <option value="unknown">⚪ Inconnu</option>
        </select>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="reload()" />
      } @else {
        <div class="grid">
          @for (character of characters(); track character.id) {
            <app-character-card [character]="character" (toggleFavori)="onToggleFavori($event)" />
          }
        </div>
        @if (characters().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🔭</div>
            <p>Aucun personnage trouvé pour cette recherche.</p>
          </div>
        }
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
    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .status-select {
      padding: 0.65rem 1rem;
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 0.9rem;
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;
    }
    .status-select:focus {
      border-color: #00d4aa;
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    .status-select option { background: #1a1a2e; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  `]
})
export class CharactersListComponent implements OnInit {
  private characterService = inject(CharacterService);
  private favorisService = inject(FavorisService);

  private search$ = new Subject<string>();
  private searchTerm = '';
  status = '';

  characters = signal<Character[]>([]);
  page = signal(1);
  totalPages = signal(1);
  totalCharacters = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.searchTerm = term;
        this.page.set(1);
        this.loading.set(true);
        this.error.set(null);
        return this.characterService.getAll(1, term, this.status).pipe(
          catchError(() => { this.error.set('Erreur de chargement'); return of(null); })
        );
      }),
      takeUntilDestroyed()
    ).subscribe(res => {
      this.loading.set(false);
      if (res) {
        this.characters.set(res.results);
        this.totalPages.set(res.info.pages);
        this.totalCharacters.set(res.info.count);
      }
    });
  }

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading.set(true);
    this.error.set(null);
    this.characterService.getAll(this.page(), this.searchTerm, this.status).pipe(
      catchError(() => { this.error.set('Erreur de chargement'); this.loading.set(false); return of(null); })
    ).subscribe(res => {
      this.loading.set(false);
      if (res) {
        this.characters.set(res.results);
        this.totalPages.set(res.info.pages);
        this.totalCharacters.set(res.info.count);
      }
    });
  }

  onSearch(term: string): void {
    this.search$.next(term);
  }

  onStatusChange(status: string): void {
    this.status = status;
    this.page.set(1);
    this.loadCharacters();
  }

  reload(): void {
    this.loadCharacters();
  }

  prevPage(): void {
    if (this.page() > 1) { this.page.update(p => p - 1); this.loadCharacters(); }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.loadCharacters(); }
  }

  onToggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }
}
