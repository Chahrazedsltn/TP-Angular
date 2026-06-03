import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  private base = 'https://rickandmortyapi.com/api/character';

  getAll(page: number, name?: string, status?: string): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page.toString());
    if (name) params = params.set('name', name);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<Character>>(this.base, { params });
  }

  getById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.base}/${id}`);
  }

  getMany(ids: number[]): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.base}/${ids.join(',')}`);
  }
}
