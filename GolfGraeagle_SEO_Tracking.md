# GolfGraeagle.com — SEO / AEO / Schema Tracking File
**Last verified:** March 18, 2026  
**Total live URLs:** 55  
**Source of truth:** Live site scrape + content.js + [slug].astro

---

## KNOWN BUGS / ISSUES LOG

| Date | Issue | File | Status |
|------|-------|------|--------|
| Mar 18 | TypeScript annotations (`Record<string,string>`, `as HTMLInputElement`, `as HTMLTextAreaElement`, `: string[]`) in `<script>` tag caused browser parse error — entire prefill function silently failed | `src/pages/request-a-quote.astro` | ✅ FIXED & deployed |
| Mar 18 | Duplicate footer rendering | `src/components/Footer.astro` | ✅ Fixed |
| Mar 18 | `graeagle-golf-courses-ranked` FAQ section used dark-theme inline styles (`#f0f8f2`, `rgba(240,248,242,0.55)`) on a light-bg blog page | blog post | ✅ Fixed |
| Mar 18 | CTA links `/courses` and `/request-a-quote` missing trailing slashes in ranked post | blog post | ✅ Fixed |

**RULE: Never use TypeScript syntax in `<script>` tags (browser JS). TypeScript only allowed in frontmatter (`---`) or `.ts` files.**

---

## GLOBAL SEO ELEMENTS (every page)

### Base.astro injects on every page:
- `<title>` — from page prop
- `<meta name="description">` — from page prop
- `<link rel="canonical">` — from page prop (always trailing slash)
- `<meta property="og:title">` / `og:description` / `og:image` / `og:url`
- `<meta name="twitter:card">` / `twitter:title` / `twitter:description`
- Schema: `TravelAgency` + `WebSite` (with SearchAction) + `WebPage` + `SpeakableSpecification`

### Global schema (Base.astro, every page):
```json
TravelAgency: {
  name: "GolfGraeagle.com",
  url: "https://golfgraeagle.com",
  telephone: "+1-888-586-1157",
  address: { Graeagle, CA 96103 },
  priceRange: "$299–$1,705 per golfer",
  aggregateRating: { ratingValue: 4.8, reviewCount: 672 }
}
```

---

## PAGE-BY-PAGE SEO INVENTORY

### CORE PAGES

---

#### `/` — Homepage
- **Title:** `Graeagle Golf Packages — 5 Courses, Custom Itineraries, Tee Times + Lodging Guaranteed | GolfGraeagle`
- **Meta:** `Plan a Graeagle golf trip in the Sierra Nevada. Compare Nakoma Dragon, Whitehawk Ranch, Plumas Pines, Graeagle Meadows and Grizzly Ranch golf courses with stay and play golf packages.`
- **H1:** `Graeagle Golf Packages — 5 Courses, Custom Itineraries, Tee Times + Lodging Guaranteed`
- **Canonical:** `https://golfgraeagle.com/`
- **Schema:** TravelAgency, WebSite, WebPage, SpeakableSpecification
- **FAQPage:** ✅
- **Target keywords:** `graeagle golf`, `graeagle golf packages`, `graeagle stay and play`

---

#### `/about-us/`
- **Title:** `About GolfGraeagle | Graeagle Golf Group Packages & Stay and Play Deals`
- **Meta:** `GolfGraeagle is the #1 local booking agent for Graeagle golf group packages and stay and play deals...`
- **H1:** `We plan golf trips to Graeagle.`
- **Canonical:** `https://golfgraeagle.com/about-us/`
- **Schema:** WebPage, FAQPage, BreadcrumbList
- **FAQPage:** ✅
- **Target keywords:** `graeagle golf booking agent`, `golfgraeagle.com`
- **⚠ NOTE:** H1 has no space between "trips" and "to" in rendered HTML — cosmetic only, not SEO issue

---

#### `/all-golf-courses/`
- **Title:** `Best Golf Courses in the Sierra Nevada — Graeagle, Northern California | GolfGraeagle`
- **Meta:** `5 championship golf courses in Graeagle, California — Golf Digest Top 100, Golf World Top 75, Top 20 California. All within 25 minutes in the Sierra Nevada mountains.`
- **H1:** `Golf Courses in Graeagle, California`
- **Canonical:** `https://golfgraeagle.com/all-golf-courses/`
- **Schema:** ItemList (5 courses), FAQPage, BreadcrumbList
- **FAQPage:** ✅ (6 questions: count, best, easiest, proximity, altitude, season)
- **Target keywords:** `best golf courses sierra nevada`, `golf courses northern california`, `how many golf courses graeagle`

---

#### `/faq/`
- **Title:** `Graeagle Golf FAQ — Expert Answers for Planning Your Trip`
- **Meta:** `Answers to the most common questions about Graeagle golf courses, trip planning, packages, lodging, and dining.`
- **H1:** `Graeagle Golf: Common Questions`
- **Canonical:** `https://golfgraeagle.com/faq/`
- **Schema:** FAQPage (full)
- **FAQPage:** ✅
- **Categories:** The Courses (6Q) | Planning Your Trip (7Q) | Packages & Booking (5Q) | Lodging (2Q) | Graeagle vs Other Destinations (7Q)
- **Target keywords:** `graeagle golf faq`, `is graeagle near lake tahoe`, `golf near lake tahoe`, `graeagle vs tahoe`, `best golf northern california`

---

#### `/lodging/`
- **Title:** `Graeagle Lodging for Golf Groups | Trusted Stay and Play Packages from GolfGraeagle`
- **Meta:** `Choose from Graeagle's best lodging options — townhomes, boutique hotels, and private homes — professionally bundled with tee times, dining, and group logistics.`
- **H1:** `Sleep on the courses. Wake up ready to play.`
- **Canonical:** `https://golfgraeagle.com/lodging/`
- **Schema:** WebPage, FAQPage
- **FAQPage:** ✅
- **Target keywords:** `graeagle golf lodging`, `graeagle stay and play golf packages`

---

#### `/dining/`
- **Title:** `Dining in Graeagle CA | Best Restaurants Near Golf Courses`
- **Meta:** `The best restaurants near Graeagle's golf courses. Fine dining at Sardine Lake Resort, craft beer at The Brewing Lair, steaks at Iron Door...`
- **H1:** `Eat well. Drink even better.`
- **Canonical:** `https://golfgraeagle.com/dining/`
- **Schema:** WebPage, FAQPage
- **FAQPage:** ✅
- **Target keywords:** `restaurants graeagle ca`, `dining near graeagle golf courses`

---

#### `/request-a-quote/`
- **Title:** `Request a Quote | Graeagle Golf Packages | Stay & Play from $299 per golfer`
- **Meta:** `Plan your Graeagle golf trip. Tell us your dates, group size, courses, and lodging — we'll build a custom stay-and-play package. Free quote, 24-hour response.`
- **H1:** `Build your Graeagle golf trip.`
- **H2s (keyword-rich):** `Your Details` | `Graeagle Golf Trip Dates & Group Size` | `Golf & Budget Preferences` | `Which Graeagle Golf Courses?` | `Graeagle Golf Lodging` | `Additional Requests`
- **Canonical:** `https://golfgraeagle.com/request-a-quote/`
- **Schema:** ContactPage, FAQPage, BreadcrumbList
- **FAQPage:** ✅
- **URL prefill params:** `ref`, `trip`, `partySize`, `nights`, `rounds`, `lodging`, `vibe`, `courses`, `budget`
- **⚠ BUG HISTORY:** TypeScript in `<script>` tag broke prefill (Mar 18, FIXED). Rule: never use TS types in browser scripts.
- **Target keywords:** `graeagle golf packages quote`, `graeagle tee times booking`

---

#### `/trips/`
- **Title:** `Graeagle Golf Trip Packages — Real Itineraries & Pricing | GolfGraeagle`
- **Meta:** `Browse 15 real Graeagle golf trip packages from $620/person. Actual itineraries, actual pricing, actual groups.`
- **H1:** `Real Graeagle Golf Trips. Real prices. Real groups.`
- **Canonical:** `https://golfgraeagle.com/trips/`
- **Schema:** ItemList (8 trip entries, numberOfItems dynamic from API), FAQPage, BreadcrumbList
- **FAQPage:** ✅
- **Data source:** TripsCaddie API `https://golfthehighsierra.com/trips-caddie/api/api-recaps.php` — fetched at build time
- **Target keywords:** `graeagle golf trip packages`, `graeagle golf trip cost`

---

### GOLF COURSE PAGES (`/portfolio/[slug]/`)

Template: `src/pages/portfolio/[slug].astro` with `type: 'course'`  
Schema on all course pages: `GolfCourse` + `AggregateRating` + `Review[]` + `FAQPage` + `BreadcrumbList`

---

#### `/portfolio/graeagle-meadows-golf-packages/`
- **Title:** `Graeagle Meadows Golf Course — Tee Times & Stay and Play Packages | Graeagle, CA`
- **Meta:** `Graeagle Meadows Golf Course — par 72, slope 120, designed by Ellis Van Gorder (1968). The most accessible championship course in the valley with mountain views and the famous "English Gold" signature hole. Stay-and-play packages from $299/golfer.`
- **H1:** `Graeagle Meadows Golf Packages & Tee Times — Graeagle, CA`
- **Canonical:** `https://golfgraeagle.com/portfolio/graeagle-meadows-golf-packages/`
- **Schema:** GolfCourse, AggregateRating (4.8/5, 672 reviews), FAQPage, BreadcrumbList
- **Target keywords:** `graeagle meadows golf course`, `graeagle meadows tee times`, `graeagle meadows golf packages`

---

#### `/portfolio/whitehawk-ranch-golf-packages/`
- **Title:** `Whitehawk Ranch Golf Course — Top 20 California | Tee Times & Packages | Graeagle, CA`
- **Meta:** `Whitehawk Ranch Golf Course — Top 20 Golf Courses in California (1998). Par 71, slope 132. 550 acres of Mohawk Valley meadows and forested hillsides. Stay-and-play packages with guaranteed tee times.`
- **H1:** `Whitehawk Ranch Golf Packages & Tee Times — Graeagle, CA`
- **Canonical:** `https://golfgraeagle.com/portfolio/whitehawk-ranch-golf-packages/`
- **Schema:** GolfCourse, AggregateRating, FAQPage, BreadcrumbList
- **Target keywords:** `whitehawk ranch golf course`, `whitehawk ranch graeagle`, `whitehawk ranch golf packages`

---

#### `/portfolio/plumas-pines-golf-packages/`
- **Title:** `Plumas Pines Golf Resort — Best Value Sierra Nevada | Tee Times & Stay and Play | Graeagle, CA`
- **Meta:** `Plumas Pines Golf Resort — Top 5 Best Values in the Sierra Nevada (California Golf + Travel). Par 72, slope 132, designed by Homer Flint. Stay-and-play packages from $299/golfer.`
- **H1:** `Plumas Pines Golf Packages & Tee Times — Graeagle, CA`
- **Canonical:** `https://golfgraeagle.com/portfolio/plumas-pines-golf-packages/`
- **Schema:** GolfCourse, AggregateRating, FAQPage, BreadcrumbList
- **Target keywords:** `plumas pines golf resort`, `plumas pines golf course graeagle`

---

#### `/portfolio/grizzly-ranch-golf-packages/`
- **Title:** `Grizzly Ranch Golf Club — Golf Digest Top 100 | Tee Times & Stay and Play | Graeagle, CA`
- **Meta:** `Grizzly Ranch Golf Club — Golf Digest Top 100 Greatest Public Courses in the US (2021). Par 72, 7,411 yards, slope 140 at 4,800–5,400 ft elevation. Designed by Bob Cupp.`
- **H1:** `Grizzly Ranch Golf Packages & Tee Times — Graeagle, CA`
- **Canonical:** `https://golfgraeagle.com/portfolio/grizzly-ranch-golf-packages/`
- **Schema:** GolfCourse, AggregateRating, FAQPage, BreadcrumbList
- **Target keywords:** `grizzly ranch golf club`, `golf digest top 100 graeagle`, `grizzly ranch graeagle golf`

---

#### `/portfolio/nakoma-dragon-golf-packages/`
- **Title:** `Nakoma Dragon Golf Course — Frank Lloyd Wright Clubhouse | Golf World Top 75 | Graeagle, CA`
- **Meta:** `Nakoma Dragon Golf Course — Golf World Top 75 at debut. Par 72, slope 147. The only golf clubhouse in the world designed by Frank Lloyd Wright. Designed by Robin Nelson.`
- **H1:** `Nakoma — The Dragon Golf Packages & Tee Times — Graeagle, CA`
- **Canonical:** `https://golfgraeagle.com/portfolio/nakoma-dragon-golf-packages/`
- **Schema:** GolfCourse, AggregateRating, FAQPage, BreadcrumbList
- **Target keywords:** `nakoma golf course`, `the dragon golf course graeagle`, `frank lloyd wright golf clubhouse california`

---

### LODGING PAGES (`/portfolio/[slug]/`)

Template: `src/pages/portfolio/[slug].astro` with `type: 'lodging'`  
Schema on all lodging pages: `LodgingBusiness` + `AggregateRating` + `FAQPage` + `BreadcrumbList`

| URL | Title | H1 | Target Keyword |
|-----|-------|----|----------------|
| `/portfolio/river-pines-resort-graeagle-ca/` | River Pines Resort Graeagle — Golf Lodging & Stay and Play Packages | River Pines Resort | `river pines resort graeagle` |
| `/portfolio/chalet-view-lodge-graeagle-ca/` | Chalet View Lodge Graeagle — Golf Lodging & Stay and Play Packages | Chalet View Lodge | `chalet view lodge graeagle` |
| `/portfolio/the-inn-at-nakoma-clio-ca/` | Inn at Nakoma — Frank Lloyd Wright Resort \| Golf Stay and Play \| Clio, CA | The Inn at Nakoma | `inn at nakoma golf` |
| `/portfolio/the-townhomes-at-plumas-pines/` | Townhomes at Plumas Pines — On-Course Golf Lodging \| Graeagle, CA | Townhomes at Plumas Pines | `townhomes plumas pines graeagle` |

---

### DINING PAGES (`/portfolio/[slug]/`)

Template: `src/pages/portfolio/[slug].astro` with `type: 'dining'`  
Schema on all dining pages: `Restaurant` + `FAQPage` + `BreadcrumbList`

| URL | Title | Target Keyword |
|-----|-------|----------------|
| `/portfolio/grizzly-grill/` | Grizzly Grill — Gourmet Dining in Plumas National Forest \| Graeagle, CA | `grizzly grill graeagle` |
| `/portfolio/iron-door-restaurant/` | Iron Door Restaurant — Historic Steakhouse Since 1961 \| Graeagle, CA | `iron door restaurant graeagle` |
| `/portfolio/sardine-lake-resort/` | Sardine Lake Resort \| GolfGraeagle.com | `sardine lake resort dining` |
| `/portfolio/roadhouse-at-river-pines/` | Roadhouse at River Pines — Steaks & Whisky \| Après-Golf Dining \| Graeagle, CA | `roadhouse river pines graeagle` |
| `/portfolio/the-brewing-lair/` | The Brewing Lair — Craft Brewery & Après-Golf Bar \| Graeagle, CA | `brewing lair graeagle` |
| `/portfolio/eureka-peak-brewing-co/` | Eureka Peak Brewing Co. — Craft Beer at Chalet View Lodge \| Graeagle, CA | `eureka peak brewing graeagle` |
| `/portfolio/gumbas-ii-go/` | Gumba's II Go — Pizza & Italian To-Go \| Graeagle Golf Groups | `gumbas graeagle` |
| `/portfolio/sierra-smokeshow/` | Sierra SmokeShow — BBQ Ribs & Brisket Near Graeagle Golf Courses | `sierra smokeshow graeagle` |
| `/portfolio/little-bite-deli/` | Little Bite Deli — Fresh Sandwiches & Salads on Hwy 89 \| Blairsden, CA | `little bite deli graeagle` |
| `/portfolio/graeagle-restaurant/` | Graeagle Restaurant — Family-Owned Café Since 1958 \| Graeagle, CA | `graeagle restaurant` |
| `/portfolio/graeagle-meadows-golf-course-restaurant/` | Graeagle Meadows Golf Course Restaurant — Clubhouse Dining \| Graeagle, CA | `graeagle meadows restaurant` |
| `/portfolio/longboards-bar-and-grill/` | Longboards Bar and Grill \| GolfGraeagle.com | `longboards bar graeagle` |
| `/portfolio/the-knotty-pine-tavern/` | The Knotty Pine Tavern \| GolfGraeagle.com | `knotty pine tavern graeagle` |
| `/portfolio/mohawk-tavern/` | Mohawk Tavern \| GolfGraeagle.com | `mohawk tavern graeagle` |
| `/portfolio/cuccias/` | Cuccia's Pasta, Pizza & Wine Bar \| GolfGraeagle.com | `cuccias graeagle` |
| `/portfolio/graeagle-mountain-frostee/` | Graeagle Mountain Frostee \| GolfGraeagle.com | `graeagle mountain frostee` |

**⚠ Sardine Lake, Longboards, Knotty Pine, Mohawk, Cuccia's, Mountain Frostee** — titles use fallback `| GolfGraeagle.com`. These should be upgraded with descriptive titles when content is enriched.

---

### BLOG POSTS (`/blog/[slug]/`)

Schema on all blog posts: `BlogPosting` + `FAQPage` + `BreadcrumbList`

| Slug | Title | Primary Keyword | FAQPage |
|------|-------|-----------------|---------|
| `graeagle-golf-trip-cost` | How Much Does a Graeagle Golf Trip Cost? Real Pricing from 15 Actual Packages | `graeagle golf trip cost` | ✅ |
| `large-group-golf-graeagle` | Large Group Golf in Graeagle: How 50+ Golfers Do It Right | `large group golf graeagle` | ✅ |
| `corporate-golf-outing-graeagle` | Corporate Golf Outing in Graeagle, CA: Complete Planning Guide | `corporate golf outing graeagle` | ✅ |
| `bachelor-party-golf-graeagle` | Bachelor Party Golf in Graeagle, CA: The Complete Group Guide | `bachelor party golf graeagle` | ✅ |
| `graeagle-golf-courses-ranked` | Graeagle Golf Courses Ranked: All 5 Compared Honestly | `graeagle golf courses ranked` | ✅ |
| `best-time-to-golf-graeagle` | Best Time to Golf in Graeagle, CA: Month-by-Month Guide | `best time golf graeagle` | ✅ |
| `graeagle-vs-lake-tahoe-golf` | Graeagle vs Lake Tahoe Golf: Honest Comparison for 2025 | `graeagle vs lake tahoe golf` | ✅ |
| `how-to-plan-graeagle-golf-trip` | How to Plan a Graeagle Golf Trip: Complete Group Planner (2025) | `how to plan graeagle golf trip` | ✅ |
| `graeagle-golf-trip-itinerary-3-days` | Graeagle Golf Trip Itinerary: 3 Days, 4 Courses (The Ideal Schedule) | `graeagle golf trip itinerary` | ✅ |
| `graeagle-golf-bucket-list` | The Graeagle Golf Bucket List: 4 Courses, 36-Hole Days, 3 Nights | `graeagle golf bucket list` | ✅ |
| `graeagle-golf-weekend` | Graeagle Golf Weekend: 2-Day and 3-Day Itineraries (With Real Pricing) | `graeagle golf weekend` | ✅ |
| `golf-near-lake-tahoe` | Golf Near Lake Tahoe: Why Graeagle Is the Answer Most Golfers Miss | `golf near lake tahoe` | ✅ |
| `golf-tournament-graeagle` | Golf Tournament in Graeagle, CA: How to Run a Group Event Across 5 Courses | `golf tournament graeagle` | ✅ |

---

### LEGACY BLOG POSTS (WP-era URLs preserved)

| URL | Title | Status |
|-----|-------|--------|
| `/best-golf-courses-graeagle/` | Best Golf Courses in Graeagle, California (Complete Guide) | ✅ Live |
| `/ultimate-guide-to-golfing-in-graeagle/` | Ultimate Guide to Golfing in Graeagle \| Northern California Golf Hub | ✅ Live |
| `/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets/` | Mountain Dining Near Lake Tahoe: Graeagle's Best Kept Restaurant Secrets | ✅ Live |

---

## SCHEMA TYPES BY PAGE TYPE

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | TravelAgency, WebSite (SearchAction), WebPage, SpeakableSpecification, FAQPage |
| All pages (global) | TravelAgency, Organization, WebSite, WebPage, SpeakableSpecification |
| Course pages | GolfCourse, AggregateRating (4.8/672), Review[], FAQPage, BreadcrumbList |
| Lodging pages | LodgingBusiness, AggregateRating, FAQPage, BreadcrumbList |
| Dining pages | Restaurant, AggregateRating, FAQPage, BreadcrumbList |
| Blog posts | BlogPosting, FAQPage, BreadcrumbList |
| /trips/ | ItemList (dynamic count), FAQPage, BreadcrumbList |
| /request-a-quote/ | ContactPage, FAQPage, BreadcrumbList |
| /all-golf-courses/ | ItemList (5 courses), FAQPage, BreadcrumbList |
| /faq/ | FAQPage (full — 27 questions across 5 categories) |

---

## AEO QUESTION COVERAGE

Questions Google AI Overviews and Perplexity are likely to pull from this site:

| Question | Page that answers it | FAQPage schema |
|----------|---------------------|----------------|
| How many golf courses are in Graeagle? | /all-golf-courses/, /faq/ | ✅ |
| What is the best golf course in Graeagle? | /faq/, /blog/graeagle-golf-courses-ranked/ | ✅ |
| What is the hardest golf course in Graeagle? | /faq/ | ✅ |
| Is Graeagle near Lake Tahoe? | /faq/ | ✅ |
| What golf courses are near Lake Tahoe? | /faq/, /blog/golf-near-lake-tahoe/ | ✅ |
| How far is Graeagle from Sacramento? | /faq/ | ✅ |
| How far is Graeagle from San Francisco? | /faq/ | ✅ |
| How far is Graeagle from Reno? | /faq/ | ✅ |
| How much does a Graeagle golf trip cost? | /blog/graeagle-golf-trip-cost/ | ✅ |
| Is Graeagle golf cheaper than Lake Tahoe? | /faq/, /blog/golf-near-lake-tahoe/ | ✅ |
| What is the Frank Lloyd Wright golf clubhouse? | /faq/, /portfolio/nakoma-dragon-golf-packages/ | ✅ |
| When are Graeagle golf courses open? | /faq/, /blog/best-time-to-golf-graeagle/ | ✅ |
| Does altitude affect golf in Graeagle? | /faq/ | ✅ |
| What is the best golf destination in Northern California? | /faq/ | ✅ |
| What are the best golf courses in the Sierra Nevada? | /faq/, /all-golf-courses/ | ✅ |
| Can you run a golf tournament in Graeagle? | /blog/golf-tournament-graeagle/ | ✅ |

---

## SITEMAP

- **URL:** `https://golfgraeagle.com/sitemap.xml`
- **File:** `src/pages/sitemap.xml.ts` (custom, NOT @astrojs/sitemap)
- **Total URLs:** 55
- **All URLs have trailing slashes:** ✅
- **IndexNow submitted:** March 17, 2026 (launch day)
- **GSC sitemap submitted:** March 17, 2026

---

## CANONICAL URL RULES

- All canonical URLs use trailing slashes: `https://golfgraeagle.com/path/`
- `vercel.json` enforces `trailingSlash: true`
- Never redirect a canonical URL to another path (breaks GSC indexing)
- Redirects only go FROM dead/old URLs TO live canonical URLs

---

## ROBOTS.TXT

```
User-agent: *
Allow: /
Sitemap: https://golfgraeagle.com/sitemap.xml
Disallow: /api/
```

---

## INDEXING STATUS (as of March 18, 2026)

- **DNS cutover:** March 17, 2026 — 1 day ago
- **Google re-indexing timeline:** 7–21 days for full crawl on a new domain
- **GSC impressions lag:** 2–3 days minimum before new data appears
- **Action:** Check GSC Coverage report daily. If no URLs appear as "Indexed" by Day 7, investigate crawl blocking.
- **IndexNow submitted:** 47 URLs on March 17 (covers sitemap at that time)
- **New IndexNow needed for:** `/blog/golf-near-lake-tahoe/`, `/blog/graeagle-golf-weekend/`, `/blog/golf-tournament-graeagle/` (added post-launch)

---

## KEYWORD COVERAGE SUMMARY

| Cluster | Page | Status |
|---------|------|--------|
| `graeagle golf` | / | ✅ |
| `graeagle golf courses` | /all-golf-courses/ | ✅ |
| `graeagle golf packages` | / | ✅ |
| `graeagle golf trips` | /trips/ | ✅ |
| `best golf courses sierra nevada` | /all-golf-courses/ | ✅ |
| `best golf northern california` | /all-golf-courses/, /faq/ | ✅ |
| `golf near lake tahoe` | /blog/golf-near-lake-tahoe/, /faq/ | ✅ |
| `graeagle golf weekend` | /blog/graeagle-golf-weekend/ | ✅ |
| `graeagle golf trip cost` | /blog/graeagle-golf-trip-cost/ | ✅ |
| `golf tournament graeagle` | /blog/golf-tournament-graeagle/ | ✅ |
| `frank lloyd wright golf clubhouse` | /portfolio/nakoma-dragon-golf-packages/ | ✅ |
| `golf digest top 100 graeagle` | /portfolio/grizzly-ranch-golf-packages/ | ✅ |
| `corporate golf outing graeagle` | /blog/corporate-golf-outing-graeagle/ | ✅ |
| `bachelor party golf graeagle` | /blog/bachelor-party-golf-graeagle/ | ✅ |
| `large group golf graeagle` | /blog/large-group-golf-graeagle/ | ✅ |
| `graeagle golf courses ranked` | /blog/graeagle-golf-courses-ranked/ | ✅ |
| `graeagle vs lake tahoe golf` | /blog/graeagle-vs-lake-tahoe-golf/ | ✅ |
| `graeagle golf vacation` | No dedicated page | ⚠ Gap |
| `stay and play golf california` | No dedicated page | ⚠ Gap |
| `golf packages northern california` | No dedicated page | ⚠ Gap |
| `grizzly ranch tee times` | No tee-times page | ⚠ Gap |

---

## llms.txt

- **URL:** `https://golfgraeagle.com/llms.txt`
- **File:** `public/llms.txt`
- Contains all 55 portfolio/blog/page URLs with descriptions
- Update whenever new pages are added

---

*File maintained by: GolfGraeagle build sessions. Update after every deploy that changes titles, meta, schema, or adds pages.*
