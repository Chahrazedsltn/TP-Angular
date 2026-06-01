import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Contact, NouveauContact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3001/contacts';

  // READ
  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url).pipe(
      catchError(() => throwError(() => new Error('Impossible de charger (json-server est-il lancé sur :3001 ?)')))
    );
  }

  // CREATE
  create(contact: NouveauContact): Observable<Contact> {
    return this.http.post<Contact>(this.url, contact).pipe(
      catchError(() => throwError(() => new Error("Échec de l'ajout")))
    );
  }

  // UPDATE (PATCH — modification partielle)
  update(contact: Contact): Observable<Contact> {
    return this.http.patch<Contact>(`${this.url}/${contact.id}`, contact).pipe(
      catchError(() => throwError(() => new Error('Échec de la modification')))
    );
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Échec de la suppression')))
    );
  }
}
