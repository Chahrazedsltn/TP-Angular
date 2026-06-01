import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, NouveauContact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3001/contacts';

  // READ
  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

  // CREATE
  create(contact: NouveauContact): Observable<Contact> {
    return this.http.post<Contact>(this.url, contact);
  }

  // UPDATE
  update(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.url}/${contact.id}`, contact);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
