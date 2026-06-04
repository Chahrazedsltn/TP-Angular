import { Routes } from '@angular/router';
import { DigimonListComponent } from './pages/digimon-list/digimon-list.component';
import { DigimonDetailComponent } from './pages/digimon-detail/digimon-detail.component';

export const routes: Routes = [
  { path: '', component: DigimonListComponent },
  { path: 'digimon/:id', component: DigimonDetailComponent },
  { path: '**', redirectTo: '' },
];
