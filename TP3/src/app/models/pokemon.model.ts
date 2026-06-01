// Réponse de la liste
export interface PokemonListResponse {
  count: number;
  results: { name: string; url: string }[];
}

// Ce qu'on affiche dans la liste (enrichi)
export interface PokemonPreview {
  name: string;
  id: number;
  image: string;
}

// Réponse détaillée (on ne type que ce qu'on utilise)
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;   // en décimètres
  weight: number;   // en hectogrammes
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': { front_default: string };
    };
  };
}
