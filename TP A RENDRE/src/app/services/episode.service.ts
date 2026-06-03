import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Episode } from '../models/episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private http = inject(HttpClient);
  private base = 'https://rickandmortyapi.com/api/episode';

  getAll(page: number): Observable<ApiResponse<Episode>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<Episode>>(this.base, { params });
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.base}/${id}`);
  }

  getMany(ids: number[]): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.base}/${ids.join(',')}`);
  }
}
