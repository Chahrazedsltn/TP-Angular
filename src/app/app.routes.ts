import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CharactersListComponent } from './pages/characters-list/characters-list.component';
import { CharacterDetailComponent } from './pages/character-detail/character-detail.component';
import { LocationsListComponent } from './pages/locations-list/locations-list.component';
import { LocationDetailComponent } from './pages/location-detail/location-detail.component';
import { EpisodesListComponent } from './pages/episodes-list/episodes-list.component';
import { EpisodeDetailComponent } from './pages/episode-detail/episode-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'characters', component: CharactersListComponent },
  { path: 'characters/:id', component: CharacterDetailComponent },
  { path: 'locations', component: LocationsListComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: 'episodes', component: EpisodesListComponent },
  { path: 'episodes/:id', component: EpisodeDetailComponent },
  { path: 'favoris', loadComponent: () => import('./pages/favoris/favoris.component').then(m => m.FavorisComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', component: NotFoundComponent },
];
