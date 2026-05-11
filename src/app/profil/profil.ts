import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  @Input() photo = '';
  @Input() nom = '';
  @Input() titrePro = '';

  contacter() {
    alert('Message envoyé à ' + this.nom);
  }
}
