import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { FavorisService } from '../../services/favoris.service';

const TYPE_COLORS: Record<string, string> = {
  fire:     '#F08030',
  water:    '#6890F0',
  grass:    '#78C850',
  electric: '#F8D030',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
  normal:   '#A8A878',
};

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
})
export class PokemonDetailComponent {
  private api = inject(PokemonApiService);
  favoris = inject(FavorisService);

  name = input.required<string>();
  error = signal<string | null>(null);

  pokemon = toSignal(
    toObservable(this.name).pipe(
      switchMap(n => {
        this.error.set(null);
        return this.api.getByName(n).pipe(
          catchError(() => {
            this.error.set(`Pokémon "${n}" introuvable.`);
            return of(null);
          })
        );
      })
    )
  );

  typeColor(type: string): string {
    return TYPE_COLORS[type] ?? '#A8A878';
  }
}
