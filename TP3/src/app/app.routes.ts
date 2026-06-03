import { Routes } from '@angular/router';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { FavorisComponent } from './pages/favoris/favoris.component';

export const routes: Routes = [
  { path: '',               component: PokemonListComponent },
  { path: 'pokemon/:name',  component: PokemonDetailComponent },
  { path: 'favoris',        component: FavorisComponent },
  { path: '**',             redirectTo: '' },
];
