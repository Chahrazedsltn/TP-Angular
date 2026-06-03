import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/dashboard" class="brand">
        <span class="brand-icon">🛸</span>
        <span class="brand-text">Rick<span class="accent">&</span>Morty</span>
      </a>
      <div class="nav-links">
        <a routerLink="/characters" routerLinkActive="active">Personnages</a>
        <a routerLink="/locations" routerLinkActive="active">Lieux</a>
        <a routerLink="/episodes" routerLinkActive="active">Épisodes</a>
        <a routerLink="/favoris" routerLinkActive="active" class="fav-link">⭐ Favoris</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: rgba(15, 15, 26, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #2d2d44;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #e2e8f0;
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .brand-icon {
      font-size: 1.6rem;
      filter: drop-shadow(0 0 8px #00d4aa);
    }
    .brand-text .accent {
      color: #00d4aa;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      padding: 0.4rem 0.9rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .nav-links a:hover {
      color: #e2e8f0;
      background: #1a1a2e;
      border-color: #2d2d44;
    }
    .nav-links a.active {
      color: #00d4aa;
      background: rgba(0, 212, 170, 0.1);
      border-color: rgba(0, 212, 170, 0.3);
    }
    .fav-link {
      color: #f59e0b !important;
    }
    .fav-link:hover {
      background: rgba(245, 158, 11, 0.1) !important;
      border-color: rgba(245, 158, 11, 0.3) !important;
    }
    .fav-link.active {
      color: #f59e0b !important;
      background: rgba(245, 158, 11, 0.1) !important;
      border-color: rgba(245, 158, 11, 0.3) !important;
    }
    main {
      min-height: calc(100vh - 64px);
      background: #0f0f1a;
    }
  `]
})
export class App {}
