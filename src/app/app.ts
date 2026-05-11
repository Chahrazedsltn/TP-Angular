import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Profil } from './profil/profil';
import { Citations } from './citations/citations';
import { MeteoCarte } from './meteo-carte/meteo-carte';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Profil, Citations, MeteoCarte],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tp');
}
