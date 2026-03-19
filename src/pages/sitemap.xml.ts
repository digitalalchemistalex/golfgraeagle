export const prerender = true;

import { courses, lodging, dining } from '../data/content.js';

const SITE  = 'https://golfgraeagle.com';
const TODAY = new Date().toISOString().split('T')[0];

function url(loc: string, priority: string, changefreq: string) {
  // Always use trailing slash to match WP-indexed canonical URLs in GSC
  const withSlash = loc.endsWith('/') ? loc : loc + '/';
  return `  <url>\n    <loc>${SITE}${withSlash}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Slug maps: data slug → portfolio URL slug
const coursePortfolioSlug: Record<string,string> = {
  'graeagle-meadows': 'graeagle-meadows-golf-packages',
  'whitehawk-ranch':  'whitehawk-ranch-golf-packages',
  'plumas-pines':     'plumas-pines-golf-packages',
  'grizzly-ranch':    'grizzly-ranch-golf-packages',
  'nakoma-dragon':    'nakoma-dragon-golf-packages',
};

const lodgingPortfolioSlug: Record<string,string> = {
  'river-pines-resort':        'river-pines-resort-graeagle-ca',
  'chalet-view-lodge':         'chalet-view-lodge-graeagle-ca',
  'inn-at-nakoma':             'the-inn-at-nakoma-clio-ca',
  'townhomes-at-plumas-pines': 'the-townhomes-at-plumas-pines',
};

const diningPortfolioSlug: Record<string,string> = {
  'grizzly-grill':'grizzly-grill','iron-door':'iron-door-restaurant',
  'sardine-lake':'sardine-lake-resort','roadhouse':'roadhouse-at-river-pines',
  'graeagle-restaurant':'graeagle-restaurant','meadows-restaurant':'graeagle-meadows-golf-course-restaurant',
  'sierra-smokeshow':'sierra-smokeshow','gumbas':'gumbas-ii-go','cuccias':'cuccias',
  'eureka-peak-brewing':'eureka-peak-brewing-co','brewing-lair':'the-brewing-lair',
  'mohawk-tavern':'mohawk-tavern','knotty-pine':'the-knotty-pine-tavern',
  'little-bite-deli':'little-bite-deli','mountain-frostee':'graeagle-mountain-frostee',
  'longboards':'longboards-bar-and-grill',
};

// Dynamic from content.js — add entry to content.js and it auto-appears here
const courseUrls   = courses.map((c:any) => coursePortfolioSlug[c.slug]).filter(Boolean).map((s:string) => url(`/portfolio/${s}`,'0.9','monthly'));
const lodgingUrls  = lodging.map((l:any) => lodgingPortfolioSlug[l.slug]).filter(Boolean).map((s:string) => url(`/portfolio/${s}`,'0.8','monthly'));
const diningUrls   = dining.map((d:any) => diningPortfolioSlug[d.slug]).filter(Boolean).map((s:string) => url(`/portfolio/${s}`,'0.7','monthly'));

// Blog posts — manual until a blog content array exists
const blogUrls = [
  '/best-golf-courses-graeagle',
  '/ultimate-guide-to-golfing-in-graeagle',
  '/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets',
  '/blog/graeagle-golf-courses-ranked',
  '/blog/graeagle-golf-trip-itinerary-3-days',
  '/blog/how-to-plan-graeagle-golf-trip',
  '/blog/graeagle-vs-lake-tahoe-golf',
  '/blog/best-time-to-golf-graeagle',
  '/blog/bachelor-party-golf-graeagle',
  '/blog/graeagle-golf-trip-cost',
  '/blog/large-group-golf-graeagle',
  '/blog/corporate-golf-outing-graeagle',
  '/blog/graeagle-golf-bucket-list',
  '/blog/graeagle-golf-weekend',
  '/blog/golf-near-lake-tahoe',
  '/blog/golf-tournament-graeagle',
].map(s => url(s,'0.7','monthly'));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- Core Pages -->
${url('/','1.0','weekly')}
${url('/request-a-quote','1.0','monthly')}
${url('/stay-and-play','0.9','monthly')}
${url('/group-golf','0.9','monthly')}
${url('/golf-packages','0.9','monthly')}
${url('/all-golf-courses','0.9','monthly')}
${url('/lodging','0.8','monthly')}
${url('/dining','0.8','monthly')}
${url('/about-us','0.7','monthly')}
${url('/blog','0.7','weekly')}
${url('/faq','0.7','monthly')}
${url('/trips','0.8','weekly')}
${url('/townhomes','0.6','monthly')}

<!-- Courses (${courseUrls.length} — auto from content.js) -->
${courseUrls.join('\n')}

<!-- Lodging (${lodgingUrls.length} — auto from content.js) -->
${lodgingUrls.join('\n')}

<!-- Dining (${diningUrls.length} — auto from content.js) -->
${diningUrls.join('\n')}

<!-- Blog (${blogUrls.length}) -->
${blogUrls.join('\n')}

<!-- Legal -->
${url('/privacy-policy','0.3','yearly')}
${url('/terms-and-conditions','0.3','yearly')}
${url('/cancellation-policy','0.3','yearly')}
${url('/disclaimer','0.3','yearly')}

</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
}
