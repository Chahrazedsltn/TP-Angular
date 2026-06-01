import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PokemonListResponse,
  PokemonPreview,
  PokemonDetail,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2';

  // GET : la liste des 151 premiers, transformée en aperçus avec image
  getList(limit = 151): Observable<PokemonPreview[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`)
      .pipe(
        map(res =>
          res.results.map(p => {
            // l'URL finit par /pokemon/25/ → on extrait l'id "25"
            const id = Number(p.url.split('/').filter(Boolean).pop());
            return {
              name: p.name,
              id,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          })
        )
      );
  }

  // GET : le détail d'un Pokémon par son nom
  getByName(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${name}`);
  }
}
