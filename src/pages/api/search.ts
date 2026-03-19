// API route: GET /api/search?q=query
// Proxies Algolia search — keeps API key server-side, never exposed to browser
export const prerender = false;

import type { APIRoute } from 'astro';

const ALGOLIA_APP_ID     = import.meta.env.ALGOLIA_APP_ID     || process.env.ALGOLIA_APP_ID;
const ALGOLIA_ACCESS_KEY = import.meta.env.ALGOLIA_ACCESS_KEY || process.env.ALGOLIA_ACCESS_KEY;
const INDEX_NAME = 'golfgraeagle';

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ hits: [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!ALGOLIA_APP_ID || !ALGOLIA_ACCESS_KEY) {
    return new Response(JSON.stringify({ error: 'Search unavailable' }), { status: 503 });
  }

  const algoliaUrl = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${INDEX_NAME}/query`;

  const resp = await fetch(algoliaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'X-Algolia-API-Key': ALGOLIA_ACCESS_KEY,
    },
    body: JSON.stringify({
      query: q,
      hitsPerPage: 8,
      attributesToRetrieve: ['name', 'url', 'type', 'hero', 'description', 'accolade', 'cuisine'],
      attributesToHighlight: ['name', 'description'],
    }),
  });

  const data = await resp.json();

  return new Response(JSON.stringify({ hits: data.hits || [] }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
