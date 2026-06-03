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
      <h1>Personnages</h1>
      <div class="filters">
        <app-search-bar (search)="onSearch($event)" />
        <select [(ngModel)]="status" (ngModelChange)="onStatusChange($event)" class="status-select">
          <option value="">Tous les statuts</option>
          <option value="alive">Vivant</option>
          <option value="dead">Mort</option>
          <option value="unknown">Inconnu</option>
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
        <app-paginator [currentPage]="page()" [totalPages]="totalPages()" (prev)="prevPage()" (next)="nextPage()" />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    .status-select { padding: 0.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
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
