import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/dashboard" class="brand">🛸 Rick & Morty</a>
      <div class="nav-links">
        <a routerLink="/characters">Personnages</a>
        <a routerLink="/locations">Lieux</a>
        <a routerLink="/episodes">Épisodes</a>
        <a routerLink="/favoris">⭐ Favoris</a>
        <a routerLink="/contact">Contact</a>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: #1a1a2e; color: white; }
    .brand { color: white; text-decoration: none; font-size: 1.5rem; font-weight: bold; }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a { color: #90e0ef; text-decoration: none; }
    .nav-links a:hover { color: white; }
    main { min-height: calc(100vh - 64px); }
  `]
})
export class App {}
