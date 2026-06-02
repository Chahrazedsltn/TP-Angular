import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardApiService } from '../../services/card-api.service';
import { FilterService } from '../../services/filter.service';
import { CollectionService } from '../../services/collection.service';
import { Card } from '../../models';

const PAGE_SIZE = 24;

@Component({
  selector: 'app-card-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  private api = inject(CardApiService);
  protected filters = inject(FilterService);
  protected collection = inject(CollectionService);

  cards = signal<Card[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = '';

  page = signal(0);
  totalRows = signal(0);
  pagesRemaining = signal(0);
  hasPrev = computed(() => this.page() > 0);
  hasNext = computed(() => this.pagesRemaining() > 0);
  totalPages = computed(() =>
    this.totalRows() > 0 ? Math.ceil(this.totalRows() / PAGE_SIZE) : this.page() + 1
  );

  ngOnInit() { this.charger(); }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.api.getCards(this.filters.filters(), PAGE_SIZE, this.page() * PAGE_SIZE).subscribe({
      next: res => {
        this.cards.set(res.data);
        this.loading.set(false);
        if (res.meta) {
          this.totalRows.set(res.meta.total_rows);
          this.pagesRemaining.set(res.meta.pages_remaining);
        } else {
          this.pagesRemaining.set(0);
        }
      },
      error: () => { this.error.set('Erreur de chargement des cartes.'); this.loading.set(false); },
    });
  }

  rechercher() {
    this.filters.setRecherche(this.recherche);
    this.page.set(0);
    this.charger();
  }

  filtrerType(type: string)     { this.filters.setType(type); this.page.set(0); this.charger(); }
  filtrerAttribut(attr: string) { this.filters.setAttribute(attr); this.page.set(0); this.charger(); }
  reinitialiser() { this.filters.reset(); this.recherche = ''; this.page.set(0); this.charger(); }

  pagePrecedente() { this.page.update(p => p - 1); this.charger(); window.scrollTo(0, 0); }
  pageSuivante()   { this.page.update(p => p + 1); this.charger(); window.scrollTo(0, 0); }
}
