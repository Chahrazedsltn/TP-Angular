export interface Contact {
  id: number;
  nom: string;
  email: string;
  tel: string;
}

// pour la création : pas encore d'id (l'API le génère)
export type NouveauContact = Omit<Contact, 'id'>;
