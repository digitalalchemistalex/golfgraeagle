export const prerender = true;

const SITE  = 'https://golfgraeagle.com';
const TODAY = new Date().toISOString().split('T')[0];

function url(loc: string, priority: string, changefreq: string) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// ── Course portfolio pages (canonical WP slugs, indexed in GSC) ──────────────
const coursePages = [
  '/portfolio/graeagle-meadows-golf-packages',
  '/portfolio/whitehawk-ranch-golf-packages',
  '/portfolio/plumas-pines-golf-packages',
  '/portfolio/grizzly-ranch-golf-packages',
  '/portfolio/nakoma-dragon-golf-packages',
];

// ── Lodging portfolio pages ───────────────────────────────────────────────────
const lodgingPages = [
  '/portfolio/river-pines-resort-graeagle-ca',
  '/portfolio/chalet-view-lodge-graeagle-ca',
  '/portfolio/the-inn-at-nakoma-clio-ca',
  '/portfolio/the-townhomes-at-plumas-pines',
];

// ── Dining portfolio pages ────────────────────────────────────────────────────
const diningPages = [
  '/portfolio/grizzly-grill',
  '/portfolio/iron-door-restaurant',
  '/portfolio/roadhouse-at-river-pines',
  '/portfolio/sardine-lake-resort',
  '/portfolio/longboards-bar-and-grill',
  '/portfolio/graeagle-meadows-golf-course-restaurant',
  '/portfolio/eureka-peak-brewing-co',
  '/portfolio/the-brewing-lair',
  '/portfolio/gumbas-ii-go',
  '/portfolio/sierra-smokeshow',
  '/portfolio/little-bite-deli',
  '/portfolio/graeagle-restaurant',
  '/portfolio/cuccias',
  '/portfolio/mohawk-tavern',
  '/portfolio/the-knotty-pine-tavern',
  '/portfolio/graeagle-mountain-frostee',
];

// ── Blog posts ────────────────────────────────────────────────────────────────
const blogPages = [
  '/best-golf-courses-graeagle',
  '/ultimate-guide-to-golfing-in-graeagle',
  '/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets',
  '/blog/graeagle-golf-courses-ranked',
  '/blog/graeagle-golf-trip-itinerary-3-days',
  '/blog/how-to-plan-graeagle-golf-trip',
  '/blog/graeagle-vs-lake-tahoe-golf',
  '/blog/best-time-to-golf-graeagle',
  '/blog/bachelor-party-golf-graeagle',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- ═══ Core Pages ════════════════════════════════════════════════════ -->
${url('/', '1.0', 'weekly')}
${url('/request-a-quote', '1.0', 'monthly')}
${url('/all-golf-courses', '0.9', 'monthly')}
${url('/lodging', '0.8', 'monthly')}
${url('/dining', '0.8', 'monthly')}
${url('/about-us', '0.7', 'monthly')}
${url('/blog', '0.7', 'weekly')}
${url('/faq', '0.7', 'monthly')}
${url('/townhomes', '0.6', 'monthly')}

<!-- ═══ Course Pages (canonical portfolio slugs) ══════════════════════ -->
${coursePages.map(s => url(s, '0.9', 'monthly')).join('\n')}

<!-- ═══ Lodging Pages ═════════════════════════════════════════════════ -->
${lodgingPages.map(s => url(s, '0.8', 'monthly')).join('\n')}

<!-- ═══ Dining Pages ══════════════════════════════════════════════════ -->
${diningPages.map(s => url(s, '0.7', 'monthly')).join('\n')}

<!-- ═══ Blog Posts ════════════════════════════════════════════════════ -->
${blogPages.map(s => url(s, '0.7', 'monthly')).join('\n')}

<!-- ═══ Legal ═════════════════════════════════════════════════════════ -->
${url('/privacy-policy', '0.3', 'yearly')}
${url('/terms-and-conditions', '0.3', 'yearly')}
${url('/cancellation-policy', '0.3', 'yearly')}
${url('/disclaimer', '0.3', 'yearly')}

</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
