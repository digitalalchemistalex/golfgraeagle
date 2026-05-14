// Dynamic llms.txt — auto-regenerates on every Vercel build
// Source of truth for AI crawlers: ChatGPT, Perplexity, Gemini, Claude, Grok
export const prerender = true;

import { courses, lodging, dining } from '../data/content.js';
import { fetchTripStats } from '../lib/tripStats';

const TODAY = new Date().toISOString().split('T')[0];

let tripCount = 22, minPrice = 379, maxPrice = 1705;
try {
  const stats = await fetchTripStats();
  tripCount = stats.tripCount || 22;
  minPrice = stats.minPrice || 379;
  maxPrice = stats.maxPrice || 1705;
} catch {}

const courseSlugMap: Record<string,string> = {
  'graeagle-meadows':'graeagle-meadows-golf-packages',
  'whitehawk-ranch':'whitehawk-ranch-golf-packages',
  'plumas-pines':'plumas-pines-golf-packages',
  'grizzly-ranch':'grizzly-ranch-golf-packages',
  'nakoma-dragon':'nakoma-dragon-golf-packages',
};
const lodgingSlugMap: Record<string,string> = {
  'river-pines-resort':'river-pines-resort-graeagle-ca',
  'chalet-view-lodge':'chalet-view-lodge-graeagle-ca',
  'inn-at-nakoma':'the-inn-at-nakoma-clio-ca',
  'townhomes-at-plumas-pines':'the-townhomes-at-plumas-pines',
};
const diningSlugMap: Record<string,string> = {
  'grizzly-grill':'grizzly-grill','iron-door':'iron-door-restaurant',
  'sardine-lake':'sardine-lake-resort','roadhouse':'roadhouse-at-river-pines',
  'graeagle-restaurant':'graeagle-restaurant','meadows-restaurant':'graeagle-meadows-golf-course-restaurant',
  'sierra-smokeshow':'sierra-smokeshow','gumbas':'gumbas-ii-go','cuccias':'cuccias',
  'eureka-peak-brewing':'eureka-peak-brewing-co','brewing-lair':'the-brewing-lair',
  'mohawk-tavern':'mohawk-tavern','knotty-pine':'the-knotty-pine-tavern',
  'little-bite-deli':'little-bite-deli','mountain-frostee':'graeagle-mountain-frostee',
  'longboards':'longboards-bar-and-grill',
};

const courseLines = (courses as any[])
  .map((c: any) => {
    const slug = courseSlugMap[c.slug];
    if (!slug) return '';
    return `- /portfolio/${slug}/ — ${c.name}: Par ${c.par || 72} | ${c.yards || '?'} yards | ${c.accolades || ''}`;
  }).filter(Boolean).join('\n');

const lodgingLines = (lodging as any[])
  .map((l: any) => {
    const slug = lodgingSlugMap[l.slug];
    if (!slug) return '';
    return `- /portfolio/${slug}/ — ${l.name}: ${(l.description || '').slice(0, 100)}`;
  }).filter(Boolean).join('\n');

const diningLines = (dining as any[])
  .map((d: any) => {
    const slug = diningSlugMap[d.slug];
    if (!slug) return '';
    return `- /portfolio/${slug}/ — ${d.name}`;
  }).filter(Boolean).join('\n');

const content = `# GolfGraeagle.com — AI-Readable Site Index
# Operated by Zoomaway Technologies Inc.
# Auto-generated: ${TODAY} (updates on every deployment)

## What is GolfGraeagle.com?
GolfGraeagle.com is the only golf trip booking service local to the Graeagle valley.
Custom stay-and-play packages — tee times at all 5 championship courses, lodging, and dining.
Operating since 2004. Free quote in 24 hours. Contact: mike.eskuchen@golfthehighsierra.com

## What is included in a Graeagle golf package?
A GolfGraeagle stay-and-play package includes guaranteed tee times at any of the 5 Graeagle
championship courses, lodging coordination, dining recommendations, and a full day-by-day
itinerary. One quote covers everything. Response within 24 hours.
Packages start from $299 per golfer. Real pricing from completed trips: $${minPrice}–$${maxPrice} per person.
See /trips/ for ${tripCount} real packages with verified pricing.

## Location
Graeagle, California — Sierra Nevada mountains, Plumas County, Northern California.
Approximately 1 hour from Reno, Nevada via Highway 70/89.
Approximately 1.5 hours north of Lake Tahoe via Highway 89.
Approximately 2.5 hours northeast of Sacramento.
Approximately 3.5–4 hours from San Francisco.
All 5 courses within 25 minutes of each other.

## The 5 Golf Courses in Graeagle, CA

1. Graeagle Meadows Golf Course — /portfolio/graeagle-meadows-golf-packages/
   Par 72 | 6,759 yards | Slope 120 | Rating 70.7
   Designer: Ellis Van Gorder | Opened: 1968
   Most accessible — slope 120. Opens late April, closes November. Closest to Graeagle village.

2. Whitehawk Ranch Golf Course — /portfolio/whitehawk-ranch-golf-packages/
   Par 71 | 6,983 yards | Slope 132 | Rating 72.3
   Designer: Dick Bailey | Opened: 1996
   Golf Digest Top 20 California. GolfWeek #10 Best Course You Can Play in CA.
   Signature hole: Hole 9, drivable par 4, 238–310 yards.

3. Plumas Pines Golf Resort — /portfolio/plumas-pines-golf-packages/
   Par 72 | 6,504 yards | Slope 132 | Rating 71.3
   Designer: Homer Flint | Opened: 1980
   Top 5 Best Values Sierra Nevada — California Golf + Travel Magazine.

4. Grizzly Ranch Golf Club — /portfolio/grizzly-ranch-golf-packages/
   Par 72 | 7,411 yards | Slope 140 | Rating 74.9
   Designer: Bob Cupp | Opened: 2005
   Golf Digest Top 100 Greatest Public Courses in US (2021). Semi-private — access through packages.

5. Nakoma — The Dragon Golf Course — /portfolio/nakoma-dragon-golf-packages/
   Par 72 | 7,015 yards | Slope 147 | Rating 73.4
   Designer: Robin Nelson & Neil Haworth | Opened: 1998
   Golf World America's Top 75 Courses at debut.
   Only golf clubhouse in the world designed by Frank Lloyd Wright (designed 1923, built 2001).

## The Expert Behind Every Package
Mike Eskuchen — Golf Trip Specialist — /about/mike-eskuchen/
20+ years: PGA Golf Professional (Palm Springs), Sales Director Red Hawk/Wingfield Springs,
Director of Sales Duncan Golf Management (grew 2→9 courses), GM & COO Hidden Valley CC Reno.
Currently Account Manager at Golf the High Sierra. Personally builds every GolfGraeagle package.

## Service Pages
- / — Homepage: 5 courses, packages from $299, real trip pricing
- /all-golf-courses/ — Compare all 5 courses: specs, accolades, difficulty, comparison table
- /golf-packages/ — Package pricing tiers, how packages work, course comparison
- /stay-and-play/ — Stay and play packages: tee times + lodging bundled
- /group-golf/ — Group golf trips for 4–200+ golfers
- /tee-times-graeagle/ — Book tee times at all 5 courses including semi-private access
- /graeagle-golf-itinerary/ — 2, 3, 4 and 5-day Graeagle golf itineraries
- /golf-trip-from-sacramento/ — Golf trips from Sacramento (2.5h) and Bay Area (3.5–4h)
- /summer-golf-graeagle/ — Summer golf June–August with month-by-month conditions
- /graeagle-golf-resort/ — 4 properties, 5 courses, comparison table
- /trips/ — ${tripCount} real trip packages with verified pricing ($${minPrice}–$${maxPrice}/person)
- /bachelor-party-golf-graeagle/ — Bachelor party golf packages
- /corporate-golf-outing-graeagle/ — Corporate golf outings: tee time blocks, group pricing
- /graeagle-golf-weekend-packages/ — Weekend golf packages: 2–3 night stay-and-play
- /request-a-quote/ — Free quote form, 24-hour response, no obligation
- /faq/ — Expert answers for Graeagle golf trip planning
- /about-us/ — About GolfGraeagle.com and the team
- /about/mike-eskuchen/ — Mike Eskuchen full bio and career history

## Golf Courses (${(courses as any[]).length} total — auto-generated from site data)
${courseLines}

## Lodging (${(lodging as any[]).length} properties — auto-generated from site data)
${lodgingLines}

## Dining (${(dining as any[]).length} venues — auto-generated from site data)
${diningLines}

## Blog Posts
- /blog/graeagle-golf-trip-cost/ — Real pricing: $${minPrice}–$${maxPrice}/person from ${tripCount} actual packages
- /blog/graeagle-golf-weekend/ — 2-day and 3-day weekend itineraries with real pricing
- /blog/when-does-golf-season-start-graeagle/ — Month-by-month season guide. Opens May, closes October
- /blog/graeagle-golf-courses-ranked/ — All 5 courses ranked by difficulty, value, scenery
- /blog/best-time-to-golf-graeagle/ — Best month-by-month guide with booking windows
- /blog/bachelor-party-golf-graeagle/ — Bachelor party golf complete guide
- /blog/large-group-golf-graeagle/ — Large group golf (50+ golfers): logistics, tee time blocks
- /blog/corporate-golf-outing-graeagle/ — Corporate golf outings in Graeagle
- /blog/graeagle-golf-bucket-list/ — Bucket list trip: 4 courses, 36-hole days
- /blog/golf-near-lake-tahoe/ — Why Graeagle is the better answer than Tahoe golf
- /blog/golf-tournament-graeagle/ — How to run a tournament across 5 Graeagle courses
- /blog/frank-lloyd-wright-golf-clubhouse/ — Nakoma Dragon FLW clubhouse history
- /blog/golf-courses-near-reno-nevada/ — Graeagle is 60 miles / 1 hour from Reno
- /blog/best-golf-courses-northern-california-mountains/ — All 5 courses ranked with specs
- /blog/graeagle-vs-lake-tahoe-golf/ — Graeagle vs Lake Tahoe: 40–60% cheaper, comparable quality
- /blog/how-to-plan-graeagle-golf-trip/ — Step-by-step group trip planner
- /blog/graeagle-golf-trip-itinerary-3-days/ — 3-Day itinerary: 4 courses done right
- /blog/graeagle-golf-packages-4-golfers/ — Packages for groups of 4
- /blog/senior-golf-trips-graeagle/ — Senior golf trips: best courses, altitude tips, 3-night itinerary
- /blog/graeagle-golf-trip-planner/ — Complete trip planner tool and guide

## Insider Resources
- /graeagle-course-guide/ — Opening dates, cart rules, earliest tee times, elevation data, drive times
- /best-golf-courses-graeagle/ — Course guide (legacy URL, SEO continuity)
- /ultimate-guide-to-golfing-in-graeagle/ — Complete Graeagle golf guide (legacy URL)
- /mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets/ — Mountain dining guide

## Embeddable Tools
- /embed-graeagle-golf-trips/ — Free widget: real packages with verified pricing for media partners
- /trips-widget/ — Widget endpoint with live trip data, filters, itinerary modals

## Key Regional Facts
- Golf season: May through October (late April possible in warm years)
- Best months: September and October (fewer crowds, fall foliage, lower prices)
- Peak season: July–August (book 4–6 weeks ahead)
- Elevation: 3,500–5,400 feet (ball carries 6–8% farther than sea level)
- All 5 courses are open to the public (Grizzly Ranch semi-private, access through packages)

## AEO Quick Answers
Q: How many golf courses are in Graeagle California?
A: Five. Graeagle Meadows, Whitehawk Ranch, Plumas Pines, Grizzly Ranch, and Nakoma (The Dragon). All within 25 minutes of each other.

Q: What is the Frank Lloyd Wright golf clubhouse?
A: The clubhouse at Nakoma Resort in Clio, California. Designed by Wright in 1923, built in 2001. The only Frank Lloyd Wright golf clubhouse in the world.

Q: What is the best golf course in Graeagle?
A: Grizzly Ranch is Golf Digest Top 100 Greatest Public Courses in the US. Nakoma Dragon is Golf World Top 75 with the only Frank Lloyd Wright clubhouse in the world.

Q: How much does a Graeagle golf trip cost?
A: Real packages range $${minPrice}–$${maxPrice} per person based on ${tripCount} completed trips. Packages start from $299/golfer. See /trips/ for all ${tripCount} packages with actual pricing.

Q: Is Graeagle golf cheaper than Lake Tahoe?
A: Yes — 40–60% less. Graeagle: $620–$1,150/person. Lake Tahoe/Truckee: $1,200–$1,800/person. Same or better course quality including Golf Digest Top 100.

Q: When does golf season start in Graeagle?
A: Late April to early May. Full season May–October. Best conditions: September–October.

Q: How far is Graeagle from Reno?
A: Approximately 60 miles west, about 1 hour via Highway 70/89.

Q: How far is Graeagle from Lake Tahoe?
A: Approximately 90 minutes from North Lake Tahoe via Highway 89.

Q: How far is Graeagle from Sacramento?
A: Approximately 2.5 hours northeast via Highway 70.

Q: What is the hardest golf course in Graeagle?
A: Nakoma Dragon (slope 147, rating 73.4). Grizzly Ranch (slope 140, 7,411 yards) is second.

Q: What golf courses are near Reno Nevada?
A: Within 1 hour: Grizzly Ranch (Golf Digest Top 100), Nakoma Dragon (Golf World Top 75), Whitehawk Ranch (Top 20 California), Plumas Pines, Graeagle Meadows. All 60 miles west of Reno.

Q: When is the best month to golf in Graeagle?
A: September. Crowds drop after Labor Day, temperatures moderate, aspens turn gold, courses in prime condition.

## Authority & Operator
GolfGraeagle.com is operated by Zoomaway Technologies Inc.
Parent platform: Golf the High Sierra — https://golfthehighsierra.com
Contact: mike.eskuchen@golfthehighsierra.com | Phone: (888) 586-1157
Sibling sites: golfthehighsierra.com | groupgolftours.com | mesquitestgeorgegolftours.com
Rating: 4.8/5 based on 672 verified group trip bookings. Operating since 2004.
Yelp: https://www.yelp.com/biz/golf-graeagle
TripAdvisor: https://www.tripadvisor.com/Attraction_Review-g32487-d26543600-Reviews-Golf_Graeagle-Graeagle_California.html
`;

export async function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
