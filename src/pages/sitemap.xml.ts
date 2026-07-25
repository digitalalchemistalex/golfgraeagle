export const prerender = true;

import { courses, lodging, dining } from '../data/content.js';
import { landingPages } from '../data/pages.js';

const SITE  = 'https://golfgraeagle.com';
const TODAY = new Date().toISOString().split('T')[0];

// Auto-discover blog posts — add a file to /src/pages/blog/ and it appears automatically
const blogFiles = import.meta.glob('/src/pages/blog/*.astro');
const blogSlugs = Object.keys(blogFiles).map(p => p.replace('/src/pages/blog/', '').replace('.astro', ''));

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

// Blog posts — auto-discovered from /src/pages/blog/*.astro
const blogUrls = blogSlugs.map(s => url(`/blog/${s}`, '0.7', 'monthly'));

// Landing pages — driven by src/data/pages.js
const landingUrls = landingPages.map(p => url(p.slug, p.priority, p.changefreq));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- Homepage -->
${url('/','1.0','weekly')}

<!-- Landing pages (${landingUrls.length} — driven by src/data/pages.js) -->
${landingUrls.join('\n')}

<!-- Trip pages -->
${url('/trips/graeagle-river-pines-golf-group','0.8','monthly')}
${url('/trips/graeagle-golf-trip','0.8','monthly')}
${url('/trips/graeagle-quick-hitter','0.8','monthly')}
${url('/trips/river-pines-3-rounds','0.8','monthly')}
${url('/trips/graeagle-in-the-fall','0.8','monthly')}
${url('/trips/river-pines-golf-package','0.8','monthly')}
${url('/trips/graeagle-golf-trip-3n-3r-premium','0.8','monthly')}
${url('/trips/far-and-wide','0.8','monthly')}
${url('/trips/graeagle-golf-trip-3n-3r-value','0.8','monthly')}
${url('/trips/bob-s-group','0.8','monthly')}
${url('/trips/graeagle-buckets-golf-trip','0.8','monthly')}
${url('/trips/plumas-pines-golf-group','0.8','monthly')}

<!-- Courses (${courseUrls.length} — driven by content.js) -->
${courseUrls.join('\n')}

<!-- Lodging (${lodgingUrls.length} — driven by content.js) -->
${lodgingUrls.join('\n')}

<!-- Dining (${diningUrls.length} — driven by content.js) -->
${diningUrls.join('\n')}

<!-- Blog (${blogUrls.length} — auto-discovered from /src/pages/blog/) -->
${url('/blog','0.7','weekly')}
${blogUrls.join('\n')}

<!-- Tools -->
${url('/embed-graeagle-golf-trips','0.7','monthly')}

</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
}
