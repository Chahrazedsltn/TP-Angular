import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { Digimon } from '../../models/digimon.model';

@Component({
  selector: 'app-digimon-detail',
  imports: [RouterLink],
  templateUrl: './digimon-detail.component.html',
  styleUrl: './digimon-detail.component.scss',
})
export class DigimonDetailComponent implements OnInit {
  private service = inject(DigimonGraphqlService);

  id = input.required<string>();

  digimon = signal<Digimon | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.service.getDigimon(Number(this.id())).subscribe({
      next: d => { this.digimon.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
