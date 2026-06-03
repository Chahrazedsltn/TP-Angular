import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">✉️ Contact</h1>
        <p class="page-subtitle">Une question ? Un portail inter-dimensionnel à signaler ?</p>
      </div>

      <div class="form-container">
        @if (success()) {
          <div class="success-box">
            <span class="success-icon">✅</span>
            <div>
              <p class="success-title">Message envoyé !</p>
              <p class="success-text">Merci, nous vous répondrons depuis la dimension C-137.</p>
            </div>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <div class="field">
            <label class="label">Nom <span class="required">*</span></label>
            <input formControlName="nom" type="text" placeholder="Rick Sanchez" class="input" [class.invalid]="form.get('nom')?.invalid && form.get('nom')?.touched" />
            @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
              <div class="error-msg">
                @if (form.get('nom')?.errors?.['required']) { ⚠ Le nom est requis. }
                @else if (form.get('nom')?.errors?.['minlength']) { ⚠ Minimum 3 caractères. }
              </div>
            }
          </div>

          <div class="field">
            <label class="label">Email <span class="required">*</span></label>
            <input formControlName="email" type="email" placeholder="rick@citadel.space" class="input" [class.invalid]="form.get('email')?.invalid && form.get('email')?.touched" />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <div class="error-msg">
                @if (form.get('email')?.errors?.['required']) { ⚠ L'email est requis. }
                @else if (form.get('email')?.errors?.['email']) { ⚠ Email invalide. }
              </div>
            }
          </div>

          <div class="field">
            <label class="label">Message <span class="required">*</span></label>
            <textarea formControlName="message" rows="5" placeholder="Votre message inter-dimensionnel..." class="input textarea" [class.invalid]="form.get('message')?.invalid && form.get('message')?.touched"></textarea>
            @if (form.get('message')?.invalid && form.get('message')?.touched) {
              <div class="error-msg">
                @if (form.get('message')?.errors?.['required']) { ⚠ Le message est requis. }
                @else if (form.get('message')?.errors?.['minlength']) { ⚠ Minimum 10 caractères. }
              </div>
            }
          </div>

          <button type="submit" [disabled]="form.invalid" class="submit-btn">
            🚀 Envoyer le message
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 680px;
      margin: 0 auto;
      padding: 2rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2rem;
      font-weight: 900;
      color: #e2e8f0;
    }
    .page-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .form-container {
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 20px;
      padding: 2rem;
    }
    .success-box {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }
    .success-icon { font-size: 1.5rem; }
    .success-title {
      font-weight: 800;
      color: #22c55e;
      font-size: 0.95rem;
      margin-bottom: 0.2rem;
    }
    .success-text { color: #86efac; font-size: 0.85rem; }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .required { color: #ef4444; }
    .input {
      padding: 0.75rem 1rem;
      background: #0f0f1a;
      border: 1px solid #2d2d44;
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
      resize: vertical;
    }
    .input::placeholder { color: #94a3b8; }
    .input:focus {
      border-color: #00d4aa;
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    .input.invalid {
      border-color: rgba(239, 68, 68, 0.5);
    }
    .input.invalid:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .textarea { min-height: 130px; }
    .error-msg {
      color: #fca5a5;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .submit-btn {
      padding: 0.85rem 1.75rem;
      background: #00d4aa;
      color: #0f0f1a;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      align-self: flex-start;
    }
    .submit-btn:hover:not(:disabled) {
      background: #00f0c3;
      box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
      transform: translateY(-1px);
    }
    .submit-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  success = signal(false);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.success.set(true);
      this.form.reset();
    }
  }
}
