import { Component } from '@angular/core';

@Component({
  selector: 'app-meteo-carte',
  imports: [],
  templateUrl: './meteo-carte.html',
  styleUrl: './meteo-carte.css',
})
export class MeteoCarte {
  ville = 'Paris';
  temperature = 18;
  condition = 'Ensoleillé';
  humidite = 45;
  vent = 12;

  get emoji() {
    const emojis: Record<string, string> = {
      'Ensoleillé': '☀️',
      'Nuageux': '☁️',
      'Pluvieux': '🌧️',
    };
    return emojis[this.condition] ?? '🌡️';
  }
}
