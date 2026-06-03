import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader-wrapper">
      <div class="spinner-container">
        <div class="spinner-ring"></div>
        <div class="spinner-ring spinner-ring--2"></div>
        <div class="spinner-core">🛸</div>
      </div>
      <p class="loader-text">Chargement en cours<span class="dots">...</span></p>
    </div>
  `,
  styles: [`
    .loader-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      gap: 1.5rem;
    }
    .spinner-container {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spinner-ring {
      position: absolute;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: #00d4aa;
      animation: spin 1s linear infinite;
    }
    .spinner-ring--2 {
      width: 60px;
      height: 60px;
      border-top-color: #7c3aed;
      animation: spin 0.7s linear infinite reverse;
    }
    .spinner-core {
      font-size: 1.8rem;
      animation: pulse 1.5s ease-in-out infinite;
      filter: drop-shadow(0 0 8px #00d4aa);
    }
    .loader-text {
      color: #94a3b8;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .dots {
      display: inline-block;
      animation: dots 1.5s steps(3, end) infinite;
      width: 1.5em;
      overflow: hidden;
      vertical-align: bottom;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    @keyframes dots {
      0%   { width: 0; }
      33%  { width: 0.5em; }
      66%  { width: 1em; }
      100% { width: 1.5em; }
    }
  `]
})
export class LoaderComponent {}
