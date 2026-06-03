import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="portal-bg">
        <div class="portal-ring r1"></div>
        <div class="portal-ring r2"></div>
        <div class="portal-ring r3"></div>
      </div>
      <div class="content">
        <div class="error-code">404</div>
        <div class="portal-emoji">🌀</div>
        <h1 class="title">Dimension introuvable</h1>
        <p class="subtitle">
          "Wubba lubba dub dub !" — Cette page s'est perdue dans une dimension parallèle.<br>
          Même Rick ne peut pas la retrouver.
        </p>
        <div class="rick-quote">
          <span class="quote-icon">🧪</span>
          <em>"Si tu regardes dans un miroir assez longtemps, tu finiras par voir quelque chose d'effrayant."</em>
        </div>
        <a routerLink="/dashboard" class="home-btn">
          🛸 Retour à la dimension C-137
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .portal-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .portal-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(0, 212, 170, 0.08);
      animation: spin 20s linear infinite;
    }
    .r1 { width: 600px; height: 600px; }
    .r2 { width: 450px; height: 450px; border-color: rgba(124, 58, 237, 0.07); animation-duration: 15s; animation-direction: reverse; }
    .r3 { width: 300px; height: 300px; animation-duration: 10s; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.25rem;
      z-index: 1;
      max-width: 580px;
    }
    .error-code {
      font-size: clamp(5rem, 15vw, 9rem);
      font-weight: 900;
      background: linear-gradient(135deg, #00d4aa, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      filter: drop-shadow(0 0 30px rgba(0, 212, 170, 0.3));
    }
    .portal-emoji {
      font-size: 3.5rem;
      filter: drop-shadow(0 0 16px #00d4aa);
      animation: pulse 2s ease-in-out infinite;
      margin-top: -0.5rem;
    }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .title {
      font-size: 1.8rem;
      font-weight: 900;
      color: #e2e8f0;
      margin: 0;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.7;
    }
    .rick-quote {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: rgba(0, 212, 170, 0.06);
      border: 1px solid rgba(0, 212, 170, 0.15);
      border-radius: 14px;
      color: #94a3b8;
      font-size: 0.88rem;
      line-height: 1.5;
      font-style: italic;
      text-align: left;
    }
    .quote-icon { font-size: 1.3rem; flex-shrink: 0; }
    .home-btn {
      padding: 0.85rem 2rem;
      background: #00d4aa;
      color: #0f0f1a;
      border-radius: 14px;
      font-weight: 800;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
    }
    .home-btn:hover {
      background: #00f0c3;
      box-shadow: 0 0 24px rgba(0, 212, 170, 0.5);
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}
