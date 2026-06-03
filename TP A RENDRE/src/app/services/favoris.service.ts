import { Injectable, computed, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private storage = inject(StorageService);
  private STORAGE_KEY = 'favoris';

  favoris = signal<Character[]>(this.storage.get<Character[]>(this.STORAGE_KEY) ?? []);

  nombre = computed(() => this.favoris().length);

  repartitionParStatut = computed(() => {
    const list = this.favoris();
    return {
      alive: list.filter(c => c.status === 'Alive').length,
      dead: list.filter(c => c.status === 'Dead').length,
      unknown: list.filter(c => c.status === 'unknown').length,
    };
  });

  toggle(c: Character): void {
    const current = this.favoris();
    const exists = current.some(f => f.id === c.id);
    const updated = exists ? current.filter(f => f.id !== c.id) : [...current, c];
    this.favoris.set(updated);
    this.storage.set(this.STORAGE_KEY, updated);
  }

  isFavori(id: number): boolean {
    return this.favoris().some(f => f.id === id);
  }
}
