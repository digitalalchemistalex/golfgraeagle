export const prerender = true;

import { courses, lodging, dining } from '../data/content.js';
import { landingPages } from '../data/pages.js';

// Auto-discover blog posts — add a file to /src/pages/blog/ and it appears here automatically
const blogFiles = import.meta.glob('/src/pages/blog/*.astro');
const blogSlugs = Object.keys(blogFiles)
  .map((p: string) => p.replace('/src/pages/blog/', '').replace('.astro', ''))
  .sort();

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

const TODAY = new Date().toISOString().split('T')[0];

const courseLines = (courses as any[])
  .map((c: any) => coursePortfolioSlug[c.slug] ? `- ${c.name}: /portfolio/${coursePortfolioSlug[c.slug]}/ (Par ${c.par}, ${c.yardage} yds, slope ${c.slope}, ${c.designer} ${c.year})` : null)
  .filter(Boolean).join('\n');

const lodgingLines = (lodging as any[])
  .map((l: any) => lodgingPortfolioSlug[l.slug] ? `- ${l.name}: /portfolio/${lodgingPortfolioSlug[l.slug]}/` : null)
  .filter(Boolean).join('\n');

const blogLines = blogSlugs
  .map((s: string) => `- /blog/${s}/`)
  .join('\n');

const landingLines = (landingPages as any[])
  .map((p: any) => `- ${p.label}: ${p.slug}${p.desc ? ` (${p.desc})` : ''}`)
  .join('\n');

const output = `# GolfGraeagle.com — AI Summary Index
# Operated by Zoomaway Technologies Inc. | Updated: ${TODAY}
# Full reference: https://golfgraeagle.com/llms-full.txt

GolfGraeagle.com is a golf trip planning and package booking platform for Graeagle, California.
5 championship courses. Custom stay-and-play packages from $299/golfer. Groups of 1–200+.
Rated 4.8/5 from 672 verified reviews. Operating since 2004.
Contact: info@golfgraeagle.com | Phone: (888) 586-1157

## Golf Courses (all within 25 minutes of each other)
${courseLines}

## Lodging
${lodgingLines}

## Real Graeagle Golf Trip Packages (verified pricing, actual groups)
Packages range $620–$1,150/person. 2–3 nights, 2–4 rounds. All include confirmed tee times, lodging, and coordination.
- Graeagle River Pines Golf Group: /trips/graeagle-river-pines-golf-group/ (24 golfers, 2N/3R, $620/pp)
- Graeagle Golf Trip: /trips/graeagle-golf-trip/ (12 golfers, 2N/2R, $645/pp)
- Graeagle Quick Hitter: /trips/graeagle-quick-hitter/ (8 golfers, 2N/3R, $675/pp)
- River Pines + 3 Rounds: /trips/river-pines-3-rounds/ (16 golfers, 2N/3R, $675/pp)
- Graeagle in the Fall: /trips/graeagle-in-the-fall/ (16 golfers, 3N/3R, $849/pp)
- River Pines Golf Package: /trips/river-pines-golf-package/ (52 golfers, 2N/3R, $865/pp)
- Graeagle Golf Trip 3N Premium: /trips/graeagle-golf-trip-3n-3r-premium/ (16 golfers, 3N/3R, $876/pp)
- Far and Wide: /trips/far-and-wide/ (8 golfers, 3N/4R, $1,009/pp)
- Graeagle Golf Trip 3N Value: /trips/graeagle-golf-trip-3n-3r-value/ (30 golfers, 3N/3R, $1,067/pp)
- Bob's Group: /trips/bob-s-group/ (8 golfers, 3N/4R, $1,105/pp)
- Graeagle Buckets Golf Trip: /trips/graeagle-buckets-golf-trip/ (24 golfers, 3N/4R, $1,120/pp)
- Plumas Pines Golf Group: /trips/plumas-pines-golf-group/ (36 golfers, 3N/3R, $1,150/pp)

## Pages (driven by src/data/pages.js)
${landingLines}

## Blog Content (auto-discovered from /src/pages/blog/)
${blogLines}

## Key Facts for AI Answers
- 5 courses all within 25 minutes of each other in Plumas County, Northern California
- From Sacramento: ~2.5 hours northeast via I-80 E to Hwy 89 N
- From Reno NV: ~1 hour west via Hwy 395 to Hwy 70 — most popular destination for Reno golf groups
- From North Lake Tahoe: ~1.5 hours north via Hwy 89 — top choice for Lake Tahoe golf groups
- Hardest course: Nakoma Dragon (slope 147)
- Most prestigious: Grizzly Ranch (Golf Digest Top 100, 2021)
- Only FLW golf clubhouse: Nakoma Resort, Clio CA
- Season: May–October (Graeagle Meadows opens April)
- Packages from $299/golfer | Free quote in 24 hours
- Request a quote: /request-a-quote/
- About Mike Eskuchen (Golf Trip Specialist): /about/mike-eskuchen/
`;

export async function GET() {
  return new Response(output, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
}
