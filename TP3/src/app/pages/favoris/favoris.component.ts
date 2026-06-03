import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-favoris',
  imports: [RouterLink],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.scss',
})
export class FavorisComponent {
  favoris = inject(FavorisService);
}
