// API route: POST /api/search-index
// Builds and uploads the Algolia search index for all site content
// Called once (or on deploy) — not on every page load
// prerender = false — this is a server-side API route

export const prerender = false;

import type { APIRoute } from 'astro';
import { courses, lodging, dining } from '../../data/content.js';

const ALGOLIA_APP_ID  = import.meta.env.ALGOLIA_APP_ID  || process.env.ALGOLIA_APP_ID;
const ALGOLIA_ACCESS_KEY = import.meta.env.ALGOLIA_ACCESS_KEY || process.env.ALGOLIA_ACCESS_KEY;
const INDEX_NAME = 'golfgraeagle';

// Slug map: data slug → portfolio URL slug
const COURSE_SLUG_MAP: Record<string, string> = {
  'graeagle-meadows':  'graeagle-meadows-golf-packages',
  'whitehawk-ranch':   'whitehawk-ranch-golf-packages',
  'plumas-pines':      'plumas-pines-golf-packages',
  'grizzly-ranch':     'grizzly-ranch-golf-packages',
  'nakoma-dragon':     'nakoma-dragon-golf-packages',
};
const LODGING_SLUG_MAP: Record<string, string> = {
  'river-pines-resort':      'river-pines-resort-graeagle-ca',
  'chalet-view-lodge':       'chalet-view-lodge-graeagle-ca',
  'inn-at-nakoma':           'the-inn-at-nakoma-clio-ca',
  'townhomes-at-plumas-pines': 'the-townhomes-at-plumas-pines',
};

export const POST: APIRoute = async () => {
  if (!ALGOLIA_APP_ID || !ALGOLIA_ACCESS_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Algolia credentials' }), { status: 500 });
  }

  const records: Record<string, unknown>[] = [];

  // --- Courses ---
  for (const c of courses) {
    const urlSlug = COURSE_SLUG_MAP[c.slug] || `${c.slug}-golf-packages`;
    records.push({
      objectID: `course-${c.slug}`,
      type: 'course',
      name: c.name,
      slug: c.slug,
      url: `/portfolio/${urlSlug}/`,
      hero: c.hero,
      description: c.description?.slice(0, 200),
      accolade: c.badge || c.accolade || '',
      par: c.par,
      yards: c.yards,
      slope: c.slope,
      designer: c.designer,
      keywords: `${c.name} golf course graeagle tee times packages ${c.accolade || ''} ${c.badge || ''}`,
    });
  }

  // --- Lodging ---
  for (const l of lodging) {
    const urlSlug = LODGING_SLUG_MAP[l.slug] || l.slug;
    records.push({
      objectID: `lodging-${l.slug}`,
      type: 'lodging',
      name: l.name,
      slug: l.slug,
      url: `/portfolio/${urlSlug}/`,
      hero: l.hero,
      description: l.description?.slice(0, 200),
      keywords: `${l.name} graeagle golf lodging stay and play resort hotel`,
    });
  }

  // --- Dining ---
  for (const d of dining) {
    records.push({
      objectID: `dining-${d.slug}`,
      type: 'dining',
      name: d.name,
      slug: d.slug,
      url: `/portfolio/${d.slug}/`,
      hero: d.hero,
      description: (d.description || d.shortDesc || '').slice(0, 200),
      cuisine: d.cuisine || '',
      keywords: `${d.name} graeagle restaurant dining bar golf ${d.cuisine || ''}`,
    });
  }

  // --- Static pages ---
  const staticPages = [
    { objectID: 'page-home',          type: 'page', name: 'Home — Graeagle Golf Packages', url: '/',                   keywords: 'graeagle golf packages stay and play tee times' },
    { objectID: 'page-courses',       type: 'page', name: 'All 5 Golf Courses',             url: '/all-golf-courses/', keywords: 'graeagle golf courses compare all 5' },
    { objectID: 'page-lodging',       type: 'page', name: 'Golf Lodging in Graeagle',       url: '/lodging/',          keywords: 'graeagle golf lodging stay and play hotels' },
    { objectID: 'page-dining',        type: 'page', name: 'Dining in Graeagle',             url: '/dining/',           keywords: 'graeagle restaurants dining bars golf' },
    { objectID: 'page-packages',      type: 'page', name: 'Golf Packages & Pricing',        url: '/golf-packages/',    keywords: 'graeagle golf packages pricing cost per person' },
    { objectID: 'page-stay-play',     type: 'page', name: 'Stay and Play Packages',         url: '/stay-and-play/',    keywords: 'graeagle stay and play golf packages lodging' },
    { objectID: 'page-group',         type: 'page', name: 'Group Golf Trips',               url: '/group-golf/',       keywords: 'graeagle group golf trips outings large groups' },
    { objectID: 'page-quote',         type: 'page', name: 'Request a Free Quote',           url: '/request-a-quote/', keywords: 'graeagle golf quote package booking' },
    { objectID: 'page-trips',         type: 'page', name: 'Real Trip Packages & Pricing',   url: '/trips/',            keywords: 'graeagle real trip packages pricing archive' },
    { objectID: 'page-faq',           type: 'page', name: 'Graeagle Golf FAQ',              url: '/faq/',              keywords: 'graeagle golf questions answers planning' },
    { objectID: 'page-about',         type: 'page', name: 'About GolfGraeagle.com',         url: '/about-us/',         keywords: 'graeagle golf booking agent local expert' },
  ];
  records.push(...staticPages);

  // Upload to Algolia
  const algoliaUrl = `https://${ALGOLIA_APP_ID}.algolia.net/1/indexes/${INDEX_NAME}/batch`;
  const resp = await fetch(algoliaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'X-Algolia-API-Key': ALGOLIA_ACCESS_KEY,
    },
    body: JSON.stringify({
      requests: records.map(r => ({ action: 'updateObject', body: r })),
    }),
  });

  const result = await resp.json();
  return new Response(JSON.stringify({ ok: resp.ok, count: records.length, result }), {
    status: resp.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
