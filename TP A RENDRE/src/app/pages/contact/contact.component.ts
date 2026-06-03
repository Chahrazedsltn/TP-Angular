import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <h1>Contact</h1>
      @if (success()) {
        <div class="success">Message envoyé avec succès ! Merci.</div>
      }
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="field">
          <label>Nom</label>
          <input formControlName="nom" type="text" />
          @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
            <div class="error-msg">
              @if (form.get('nom')?.errors?.['required']) { Le nom est requis. }
              @else if (form.get('nom')?.errors?.['minlength']) { Minimum 3 caractères. }
            </div>
          }
        </div>
        <div class="field">
          <label>Email</label>
          <input formControlName="email" type="email" />
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <div class="error-msg">
              @if (form.get('email')?.errors?.['required']) { L'email est requis. }
              @else if (form.get('email')?.errors?.['email']) { Email invalide. }
            </div>
          }
        </div>
        <div class="field">
          <label>Message</label>
          <textarea formControlName="message" rows="5"></textarea>
          @if (form.get('message')?.invalid && form.get('message')?.touched) {
            <div class="error-msg">
              @if (form.get('message')?.errors?.['required']) { Le message est requis. }
              @else if (form.get('message')?.errors?.['minlength']) { Minimum 10 caractères. }
            </div>
          }
        </div>
        <button type="submit" [disabled]="form.invalid">Envoyer</button>
      </form>
    </div>
  `,
  styles: [`
    .page { max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
    .form { display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    input, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    .error-msg { color: red; font-size: 0.85rem; }
    .success { color: green; padding: 1rem; background: #e8f5e9; border-radius: 4px; margin-bottom: 1rem; }
    button { padding: 0.75rem; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
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
