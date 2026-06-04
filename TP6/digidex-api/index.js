const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { gql } = require('graphql-tag');
const fetch = require('node-fetch');

const BASE = 'https://digi-api.com/api/v1';

const typeDefs = gql`
  type Image {
    href: String
    transparent: Boolean
  }

  type Evolution {
    id: Int
    digimon: String
    condition: String
    image: String
  }

  type DigimonSummary {
    id: Int
    name: String
    image: String
  }

  type DigimonPage {
    items: [DigimonSummary]
    totalElements: Int
    totalPages: Int
    currentPage: Int
  }

  type Digimon {
    id: Int
    name: String
    releaseDate: String
    images: [Image]
    levels: [String]
    types: [String]
    attributes: [String]
    descriptions: [String]
    priorEvolutions: [Evolution]
    nextEvolutions: [Evolution]
  }

  type Query {
    digimons(page: Int!, pageSize: Int!, name: String): DigimonPage
    digimon(id: Int!): Digimon
  }
`;

const resolvers = {
  Query: {
    digimons: async (_, { page, pageSize, name }) => {
      let url = `${BASE}/digimon?page=${page}&pageSize=${pageSize}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      const res = await fetch(url);
      const data = await res.json();
      return {
        items: (data.content || []).map(d => ({
          id: d.id,
          name: d.name,
          image: d.image,
        })),
        totalElements: data.pageable?.totalElements ?? 0,
        totalPages: data.pageable?.totalPages ?? 1,
        currentPage: data.pageable?.currentPage ?? page,
      };
    },

    digimon: async (_, { id }) => {
      const res = await fetch(`${BASE}/digimon/${id}`);
      const d = await res.json();
      return {
        id: d.id,
        name: d.name,
        releaseDate: d.releaseDate,
        images: d.images || [],
        levels: (d.levels || []).map(l => l.level),
        types: (d.types || []).map(t => t.type),
        attributes: (d.attributes || []).map(a => a.attribute),
        descriptions: (d.descriptions || []).map(x => x.description),
        priorEvolutions: (d.priorEvolutions || []).map(e => ({
          id: e.id,
          digimon: e.digimon,
          condition: e.condition,
          image: e.image,
        })),
        nextEvolutions: (d.nextEvolutions || []).map(e => ({
          id: e.id,
          digimon: e.digimon,
          condition: e.condition,
          image: e.image,
        })),
      };
    },
  },
};

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({}),
  });
  console.log(`🚀 Serveur GraphQL prêt sur ${url}`);
}

start();
