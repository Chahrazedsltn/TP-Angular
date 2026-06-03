# 🛸 Rick & Morty Explorer

Application Angular explorant l'univers de Rick & Morty via l'API REST publique `https://rickandmortyapi.com`.

---

## Installation & lancement

```bash
npm install
npm start
```

Ouvre ensuite `http://localhost:4200` dans ton navigateur.

---

## Fonctionnalités réalisées

- [x] **Dashboard** avec statistiques (total personnages, lieux, épisodes, favoris, répartition par statut)
- [x] **Liste des personnages** paginée avec recherche par nom (RxJS : debounceTime + distinctUntilChanged + switchMap) et filtre par statut
- [x] **Fiche personnage** : image, infos, liens cliquables vers son origine et son lieu actuel, liste des épisodes
- [x] **Liste des lieux** paginée
- [x] **Fiche lieu** : infos + liste des résidents (cliquables)
- [x] **Liste des épisodes** paginée
- [x] **Fiche épisode** : infos + liste des personnages (cliquables)
- [x] **Favoris** persistants via localStorage (signal + computed), chargés au rechargement de page
- [x] **Formulaire de contact** réactif (ReactiveFormsModule) avec validation et messages d'erreur
- [x] **Page 404** personnalisée
- [x] **Lazy loading** pour les routes `favoris` et `contact`
- [x] **5 composants dumb** : CharacterCard, SearchBar, Paginator, Loader, ErrorMessage
- [x] **2 pipes** : StatusPipe, TruncatePipe
- [x] **OnPush** sur tous les composants dumb et les pages liste/détail
- [x] **Aucun `any`**, TypeScript strict activé
- [x] Désabonnement propre via `takeUntilDestroyed()` et pipe `async`

---

## Architecture

```
src/app/
├── pages/
│   ├── dashboard/
│   ├── characters-list/
│   ├── character-detail/
│   ├── locations-list/
│   ├── location-detail/
│   ├── episodes-list/
│   ├── episode-detail/
│   ├── favoris/           ← lazy loaded
│   ├── contact/           ← lazy loaded
│   └── not-found/
├── components/
│   ├── character-card/
│   ├── search-bar/
│   ├── paginator/
│   ├── loader/
│   └── error-message/
├── services/
│   ├── character.service.ts
│   ├── location.service.ts
│   ├── episode.service.ts
│   ├── favoris.service.ts
│   └── storage.service.ts
├── models/
│   ├── character.model.ts
│   ├── location.model.ts
│   ├── episode.model.ts
│   ├── info.model.ts
│   └── api-response.model.ts
└── pipes/
    ├── status.pipe.ts
    └── truncate.pipe.ts
```

---

## Design patterns utilisés

| Pattern | Où | Pourquoi |
|---|---|---|
| **Singleton** (via `providedIn: 'root'`) | Tous les services | Une seule instance partagée dans toute l'app |
| **Smart / Dumb components** | Pages (smart) vs composants réutilisables (dumb) | Séparation des responsabilités, testabilité |
| **Reactive programming** | `CharactersListComponent`, RxJS | Gestion asynchrone propre des événements utilisateur |
| **Signal + Computed** | `FavorisService` | Réactivité fine-grained sans zone.js, state management simple |
| **Dependency Injection** | Tous les services injectés via `inject()` | Couplage faible, testabilité |
| **Lazy loading** | Routes `favoris` et `contact` | Réduction du bundle initial |

---

## Réponses aux 10 questions

### 1. Composant « smart » vs « dumb » ?

Un composant **smart** (ou conteneur) est responsable de la logique métier : il injecte des services, fait des appels HTTP, gère l'état et coordonne les interactions. Un composant **dumb** (ou de présentation) ne reçoit que des `input()` et émet des `output()`, sans logique interne.

**Dans ce projet** : `CharactersListComponent` est smart (il injecte `CharacterService`, gère la pagination, la recherche RxJS, l'état loading/error) ; `CharacterCardComponent` est dumb (il reçoit un `Character` en input et émet un événement `toggleFavori`).

---

### 2. Pourquoi `OnPush` ? Quel lien avec l'immutabilité ?

`ChangeDetectionStrategy.OnPush` indique à Angular de ne vérifier les changements d'un composant que lorsque ses `input()` changent de **référence**, qu'un événement DOM interne se produit, ou qu'un Observable (pipe async) émet. Cela évite les vérifications inutiles à chaque cycle de détection de changements.

Le lien avec l'immutabilité est direct : si on mutait directement un objet (ex : `character.name = 'Rick'`), Angular ne détecterait pas le changement car la **référence** de l'objet n'a pas changé. Il faut donc créer de nouveaux objets (`{ ...character, name: 'Rick' }`), ce qui garantit une nouvelle référence et déclenche la mise à jour.

---

### 3. Pourquoi le `pipe async` plutôt qu'un `subscribe()` manuel ?

Le `pipe async` s'abonne automatiquement à un Observable et **se désabonne automatiquement** quand le composant est détruit. Avec un `subscribe()` manuel sans nettoyage (`unsubscribe()` dans `ngOnDestroy`), l'abonnement reste actif après la destruction du composant, ce qui provoque des **memory leaks** et peut déclencher des erreurs en tentant de modifier un composant détruit.

Dans ce projet, j'utilise aussi `takeUntilDestroyed()` comme alternative équivalente pour les abonnements dans le constructeur.

---

### 4. `providedIn: 'root'` : quel design pattern ? Combien d'instances ?

C'est le pattern **Singleton**. Avec `providedIn: 'root'`, Angular crée **une seule instance** du service pour toute l'application, partagée par tous les composants qui l'injectent. Il n'existe donc qu'**une seule instance** de `CharacterService` dans toute l'app, quel que soit le nombre de composants qui l'utilisent.

---

### 5. Différence entre un `signal` et un `BehaviorSubject` ?

Un `BehaviorSubject` (RxJS) est un Observable qui mémorise sa dernière valeur et la réémet à chaque nouvel abonné. Il faut s'y abonner (`.subscribe()`) et se désabonner proprement. Un `signal` (Angular 17+) est une valeur réactive plus simple : on la lit directement (`signal()`), on la modifie avec `.set()` ou `.update()`, et Angular sait automatiquement quels composants dépendent de cette valeur.

J'ai choisi un **`signal`** pour les favoris car la donnée est locale (pas de stream de données asynchrones), la lecture est synchrone, et les `computed` dépendants (`nombre`, `repartitionParStatut`) sont mis à jour automatiquement sans opérateurs RxJS. C'est plus simple et plus performant pour ce cas d'usage.

---

### 6. Pourquoi `switchMap` (et pas `mergeMap`) ? À quoi sert `debounceTime` ?

`switchMap` **annule la requête précédente** si une nouvelle recherche est émise avant que la précédente ne soit terminée. Avec `mergeMap`, toutes les requêtes seraient exécutées en parallèle et les résultats pourraient arriver dans le désordre, affichant des résultats incohérents avec la saisie actuelle.

`debounceTime(300)` attend 300ms après la dernière frappe avant d'envoyer la requête, évitant d'appeler l'API à chaque caractère tapé et réduisant drastiquement le nombre de requêtes.

---

### 7. Reactive Forms vs Template-driven ?

Les **Reactive Forms** définissent la structure du formulaire dans le TypeScript (`FormBuilder`, `FormGroup`), ce qui les rend plus testables, plus prévisibles et mieux adaptés à la validation complexe. Le formulaire est un **objet immuable** dont l'état est entièrement observable.

Les **Template-driven forms** définissent la logique dans le template via des directives (`ngModel`), ce qui convient pour des formulaires simples mais devient difficile à tester et à maintenir pour des validations complexes. Le projet impose le réactif car il nécessite des validateurs personnalisés, une désactivation conditionnelle du bouton, et une gestion fine des erreurs par champ.

---

### 8. Comment récupérer les relations (épisodes d'un personnage, résidents d'un lieu) ?

L'API renvoie les relations sous forme de **tableaux d'URLs**, par exemple `episode: ["https://rickandmortyapi.com/api/episode/1", ...]`. Pour les exploiter, j'extrais les IDs numériques avec `url.split('/').pop()`, puis j'appelle `episodeService.getMany(ids)` qui interroge l'endpoint `/api/episode/1,2,3` acceptant une liste d'IDs séparés par des virgules. Angular reçoit directement un tableau typé `Episode[]`.

---

### 9. Qu'apporte le lazy loading des routes `favoris` et `contact` ?

Le lazy loading (via `loadComponent: () => import(...).then(m => m.FavorisComponent)`) fait que le code de ces pages n'est pas inclus dans le bundle JavaScript initial. Il n'est téléchargé que quand l'utilisateur navigue vers ces routes. Cela réduit le temps de chargement initial de l'application, ce qui améliore les métriques de performance (First Contentful Paint, Time to Interactive).

---

### 10. (Bonus) GraphQL vs REST

En REST, pour afficher la fiche d'un personnage avec ses épisodes et son lieu, il faut **3 requêtes séparées** : une pour le personnage, une pour ses épisodes (`/api/episode/1,2,3`), et une pour son lieu (`/api/location/1`). C'est de l'**under-fetching**.

En GraphQL, une seule requête récupère tout :
```graphql
query ($id: ID!) {
  character(id: $id) {
    name status image
    location { id name }
    episode { id name episode }
  }
}
```
L'avantage est une réduction du nombre de round-trips réseau, moins de données transférées (pas d'over-fetching), et un code client plus simple.

---

## Captures d'écran

Les captures sont dans le dossier `screenshots/`.

---

*Projet réalisé dans le cadre de la formation Angular — IPSSI*
