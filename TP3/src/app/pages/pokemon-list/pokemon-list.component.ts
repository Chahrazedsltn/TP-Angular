import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { PokemonApiService } from '../../services/pokemon-api.service';

const PAGE_SIZE = 18;

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private api = inject(PokemonApiService);

  pokemons = toSignal(this.api.getList(), { initialValue: [] });

  // Recherche avec debounce 300ms
  private searchSubject = new Subject<string>();
  recherche = toSignal(this.searchSubject.pipe(debounceTime(300)), { initialValue: '' });

  page = signal(1);

  filtres = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    return this.pokemons().filter(p => p.name.includes(q));
  });

  totalPages = computed(() => Math.ceil(this.filtres().length / PAGE_SIZE));

  pagines = computed(() =>
    this.filtres().slice((this.page() - 1) * PAGE_SIZE, this.page() * PAGE_SIZE)
  );

  pagesList = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  onSearch(event: Event) {
    this.page.set(1);
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  goTo(p: number) {
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev() { if (this.page() > 1) this.goTo(this.page() - 1); }
  next() { if (this.page() < this.totalPages()) this.goTo(this.page() + 1); }
}
