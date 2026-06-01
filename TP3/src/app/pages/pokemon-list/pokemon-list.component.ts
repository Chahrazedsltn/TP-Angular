import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { PokemonPreview } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private api = inject(PokemonApiService);

  // Liste cumulée des Pokémon chargés
  pokemons = signal<PokemonPreview[]>([]);
  chargement = signal(false);

  constructor() {
    // Chargement initial
    this.chargerBatch(0);
  }

  private chargerBatch(offset: number) {
    this.chargement.set(true);
    this.api.getList(151, offset).subscribe(batch => {
      this.pokemons.update(prev => [...prev, ...batch]);
      this.chargement.set(false);
    });
  }

  chargerPlus() {
    this.chargerBatch(this.pokemons().length);
  }

  // Recherche avec debounce (300ms)
  private searchSubject = new Subject<string>();
  recherche = toSignal(this.searchSubject.pipe(debounceTime(300)), { initialValue: '' });

  filtres = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    return this.pokemons().filter(p => p.name.includes(q));
  });

  onSearch(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }
}
