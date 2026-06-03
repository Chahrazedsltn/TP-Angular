import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="text-align:center; padding:4rem;">
      <h1>404 — Page introuvable</h1>
      <a routerLink="/dashboard">Retour à l'accueil</a>
    </div>
  `
})
export class NotFoundComponent {}
