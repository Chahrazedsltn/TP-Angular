import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact, NouveauContact } from '../../models/contact.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contact-manager',
  imports: [],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.scss',
})
export class ContactManagerComponent implements OnInit {
  private service = inject(ContactService);

  contacts   = signal<Contact[]>([]);
  loading    = signal(true);
  error      = signal<string | null>(null);
  enEdition  = signal<Contact | null>(null);

  // DEVOIR 1 — Recherche
  recherche  = signal('');
  contactsFiltres = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.contacts();
    return this.contacts().filter(c =>
      c.nom.toLowerCase().includes(terme) ||
      c.email.toLowerCase().includes(terme) ||
      c.tel.includes(terme)
    );
  });

  // DEVOIR 2 — Validation email
  emailInvalide = signal(false);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: data => { this.contacts.set(data); this.loading.set(false); },
      error: (e: Error) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  validerEmail(email: string) {
    this.emailInvalide.set(!!email && !EMAIL_REGEX.test(email));
  }

  enregistrer(form: { nom: string; email: string; tel: string }) {
    if (!EMAIL_REGEX.test(form.email)) {
      this.emailInvalide.set(true);
      return;
    }
    this.emailInvalide.set(false);
    const enEdition = this.enEdition();

    if (enEdition) {
      const maj: Contact = { ...enEdition, ...form };
      this.service.update(maj).subscribe({
        next: c => {
          this.contacts.update(list => list.map(x => x.id === c.id ? c : x));
          this.annulerEdition();
        },
        error: (e: Error) => this.error.set(e.message),
      });
    } else {
      this.service.create(form as NouveauContact).subscribe({
        next: c => this.contacts.update(list => [...list, c]),
        error: (e: Error) => this.error.set(e.message),
      });
    }
  }

  editer(contact: Contact) {
    this.enEdition.set(contact);
    this.emailInvalide.set(false);
  }

  annulerEdition() {
    this.enEdition.set(null);
    this.emailInvalide.set(false);
  }

  // DEVOIR 4 — Optimistic UI
  supprimer(contact: Contact) {
    if (!confirm(`Supprimer ${contact.nom} ?`)) return;

    // Suppression immédiate dans l'UI
    const snapshot = this.contacts();
    this.contacts.update(list => list.filter(c => c.id !== contact.id));

    this.service.delete(contact.id).subscribe({
      error: (e: Error) => {
        // Rollback si l'API échoue
        this.contacts.set(snapshot);
        this.error.set(e.message);
      },
    });
  }
}
