import { Component } from '@angular/core';

@Component({
  selector: 'app-citations',
  imports: [],
  templateUrl: './citations.html',
  styleUrl: './citations.css',
})
export class Citations {
  citations = [
    { texte: 'La vie, c\'est ce qui arrive quand on est occupé à faire d\'autres plans.', auteur: 'John Lennon' },
    { texte: 'Le succès, c\'est tomber sept fois et se relever huit.', auteur: 'Proverbe japonais' },
    { texte: 'Soyez le changement que vous voulez voir dans le monde.', auteur: 'Gandhi' },
    { texte: 'L\'imagination est plus importante que le savoir.', auteur: 'Albert Einstein' },
    { texte: 'La créativité, c\'est l\'intelligence qui s\'amuse.', auteur: 'Albert Einstein' },
  ];

  index = Math.floor(Math.random() * this.citations.length);

  get citation() {
    return this.citations[this.index];
  }

  changer() {
    let nouveau;
    do {
      nouveau = Math.floor(Math.random() * this.citations.length);
    } while (nouveau === this.index);
    this.index = nouveau;
  }
}
