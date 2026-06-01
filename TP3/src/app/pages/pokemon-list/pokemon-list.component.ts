import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Subject, switchMap, debounceTime } from 'rxjs';
import { PokemonApiService } from '../../services/pokemon-api.service';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private api = inject(PokemonApiService);

  // Pagination
  private limit = signal(151);

  pokemons = toSignal(
    toObservable(this.limit).pipe(
      switchMap(l => this.api.getList(l))
    ),
    { initialValue: [] }
  );

  chargerPlus() {
    this.limit.update(l => l + 151);
  }

  // Recherche avec debounce (300ms)
  private searchSubject = new Subject<string>();

  recherche = toSignal(
    this.searchSubject.pipe(debounceTime(300)),
    { initialValue: '' }
  );

  filtres = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    return this.pokemons().filter(p => p.name.includes(q));
  });

  onSearch(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }
}
