---
name: golfgraeagle-tripscaddie
description: "RelatedTrips component and TripsCaddie integration for GolfGraeagle.com. Use whenever working on the RelatedTrips widget, the /trips/ page, Trip Caddie API integration, trip card UI, or anything connecting golfgraeagle.com to the Trip Caddie data system. Trigger on: RelatedTrips, TripsCaddie, trips caddie, trip cards, trip data, trip page, /trips/, real trips, past trips, graeagle trips API."
---

# GolfGraeagle — TripsCaddie Integration Skill

Read `golfgraeagle-master` and `golf-platform-deploy` before making any changes.

---

## What This Is

TripsCaddie is a separate application at `tripscaddie.golfthehighsierra.com` that stores real past golf trip itineraries — group name, courses played, lodging, pricing, day-by-day logistics, highlights, and pro tips. GolfGraeagle integrates with it to show social proof: real trips that real groups have booked through GolfGraeagle.

This integration surfaces on:
- Every course portfolio page (`/portfolio/[course]-golf-packages/`)
- Every lodging portfolio page (`/portfolio/[lodging]-graeagle-ca/`)
- A dedicated trips hub page (`/trips/` — planned, see below)

---

## Data Source

```
API endpoint: https://golfthehighsierra.com/trips-caddie/api/api-recaps.php
Method: GET (no auth required)
Response: JSON array of trip objects
Cache: fetch with ?t=Date.now() to bust cache
```

**Current dataset (March 2026):**
- 76 total trips
- 15 trips with `region: "Graeagle"` (the primary filter for the /trips/ page)
- 19 trips matching Graeagle courses/lodging by name (broader set for per-page widgets)

**Graeagle trip price range:** $620–$1,705 per person (real, confirmed data — always displayed as actual prices, never ranges)

---

## Trip Object Schema

```typescript
interface Trip {
  id: string;                    // e.g. "1764366235111"
  groupName: string;             // e.g. "Graeagle River Pines Golf Group"
  groupSize: number;             // e.g. 12
  nights: number;                // e.g. 2
  rounds: number;                // e.g. 3
  region: string;                // e.g. "Graeagle", "Reno", "Truckee"
  month: string;                 // e.g. "July"
  year: number;                  // e.g. 2025
  vibe: string;                  // "Value" | "Premium" | "Budget" | "Bucket List" | "Bachelor Party" | "Corporate"
  courses: string[];             // e.g. ["Whitehawk Ranch Golf Club", "Grizzly Ranch Golf Club"]
  lodging: string;               // e.g. "River Pines Resort"
  synopsis: string;              // 1-2 sentence trip summary
  highlights: string[];          // bullet points of what was included
  whyItWorked: string;           // pro tip / insight
  pricePerPerson: number;        // actual price — always present on Graeagle trips
  pricePerPersonEstimate?: number; // fallback if pricePerPerson missing
  dailyItinerary: DayItem[];     // day-by-day schedule
  logistics: { transportType, passengerCount, specialRequests[] };
  imageUrl: string;              // base64 avif or empty — use STOCK fallback if empty/base64
}

interface DayItem {
  day: number;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}
```

**IMPORTANT:** `imageUrl` is often a base64 avif string (not a usable URL). Always check `trip.imageUrl.startsWith('data:')` — if true, use a stock fallback image instead.

---

## Component: RelatedTrips

**File:** `src/components/RelatedTrips.tsx`
**Type:** React client island (`client:load`)
**Renders:** Section of trip cards filtered to the current page's course or lodging

### Usage in templates

```astro
<!-- In course template (portfolio/[slug].astro) -->
<RelatedTrips client:load slug={item.slug} type="course" />

<!-- In lodging template (portfolio/[slug].astro) -->
<RelatedTrips client:load slug={item.slug} type="lodging" />
```

### Props

| Prop | Type | Values |
|------|------|--------|
| `slug` | string | The `item.slug` from content.js — e.g. `"grizzly-ranch"`, `"river-pines-resort"` |
| `type` | string | `"course"` or `"lodging"` |

### How filtering works

The component maintains two slug→names maps:

```typescript
// COURSE_NAMES: content.js slug → array of name variants as they appear in Trip Caddie
const COURSE_NAMES = {
  "graeagle-meadows":  ["Graeagle Meadows", "Graeagle Meadows Golf Course"],
  "whitehawk-ranch":   ["Whitehawk Ranch", "Whitehawk Ranch Golf Course", "Whitehawk Ranch Golf Club"],
  "plumas-pines":      ["Plumas Pines", "Plumas Pines Golf Resort"],
  "grizzly-ranch":     ["Grizzly Ranch", "Grizzly Ranch Golf Club"],
  "nakoma-dragon":     ["The Dragon at Nakoma", "Nakoma", "Dragon", "Nakoma Dragon", "The Dragon"],
};

// LODGING_NAMES: content.js slug → array of name variants
const LODGING_NAMES = {
  "river-pines-resort":        ["River Pines Resort", "River Pines"],
  "chalet-view-lodge":         ["Chalet View Lodge", "Chalet View"],
  "inn-at-nakoma":             ["The Inn at Nakoma", "Inn at Nakoma", "Nakoma Resort"],
  "townhomes-at-plumas-pines": ["Townhomes at Plumas Pines", "Plumas Pines Townhomes", "Plumas Pines Golf Resort (Townhomes)"],
};
```

Matching is bidirectional substring: `c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase())`

**Known issue:** Some trips in Trip Caddie use non-standard names (e.g. "Whitehawk Ranch Golf Club" vs "Whitehawk Ranch"). Always add variants to the COURSE_NAMES arrays when new name formats appear.

### Filtering by region (RelatedTrips component)

The component does NOT currently filter by `region` — it filters by course/lodging name match. This is intentional: a trip that includes Grizzly Ranch but has `region: "Reno"` should still appear on the Grizzly Ranch page.

The `region: "Graeagle"` filter is used only on the `/trips/` page to show the full Graeagle trip catalog.

---

## Slug → Portfolio URL Maps

```typescript
// These must stay in sync with vercel.json and content.js slugs
const COURSE_PORTFOLIO = {
  "graeagle-meadows":  "/portfolio/graeagle-meadows-golf-packages/",
  "whitehawk-ranch":   "/portfolio/whitehawk-ranch-golf-packages/",
  "plumas-pines":      "/portfolio/plumas-pines-golf-packages/",
  "grizzly-ranch":     "/portfolio/grizzly-ranch-golf-packages/",
  "nakoma-dragon":     "/portfolio/nakoma-dragon-golf-packages/",
};
const LODGING_PORTFOLIO = {
  "river-pines-resort":        "/portfolio/river-pines-resort-graeagle-ca/",
  "chalet-view-lodge":         "/portfolio/chalet-view-lodge-graeagle-ca/",
  "inn-at-nakoma":             "/portfolio/the-inn-at-nakoma-clio-ca/",
  "townhomes-at-plumas-pines": "/portfolio/the-townhomes-at-plumas-pines/",
};
```

---

## Visual Design

The component uses inline styles (not Tailwind classes) to avoid specificity conflicts with the page's `light-page` CSS variables. Color tokens used:

| Token | Value | Use |
|-------|-------|-----|
| Card background | `#ffffff` | Trip card bg |
| Section background | `#f7f3ec` | Warm cream — matches light-page feel |
| Primary text | `#1c1208` | Dark brown |
| Gold accent | `#e8a850` | Vibe badge, divider, CTA hover |
| Green CTA | `#2d7a3a` | "Get This Trip" button |
| Muted text | `rgba(28,18,8,0.4–0.6)` | Labels, secondary info |
| Price color | `#1a7a40` | "From $X" stat |

Stock fallback images (used when imageUrl is base64 or empty):
```
https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa (golf fairway)
https://images.unsplash.com/photo-1535131749006-b7f58c99034b (golf course aerial)
https://images.unsplash.com/photo-1592919505780-303950717480 (golfer)
```

---

## Trip Card — What Renders

Each card shows (in order):
1. **Hero image** (160px) — trip photo or stock fallback
2. **Vibe badge** — top-right corner (gold pill)
3. **Group name + month/year** — overlaid on image
4. **Stats grid** — Pax / From $X / Nights / Rounds (4-col)
5. **Synopsis** — italic pull quote with gold left border
6. **Courses played** — linked chips → portfolio pages
7. **Lodging** — linked chip → portfolio page
8. **Highlights** — first 3 bullet points with gold ✓
9. **Pro Tip** — whyItWorked in a gold-tinted box
10. **▼ View Day-by-Day Itinerary** — expandable toggle
11. **Footer** — "Get This Trip" → `/request-a-quote/?ref=trips-caddie&trip=...` + 📞 call button

**The card appearance is close to but not identical to GTHS.** GTHS uses Tailwind classes with white/emerald color scheme. GolfGraeagle uses inline styles with the cream/gold/dark-brown design system. The information architecture is the same; the visual language matches golfgraeagle.com.

---

## /trips/ Page (Planned — Not Yet Built)

**URL:** `/trips/` (canonical: `https://golfgraeagle.com/trips/`)
**Purpose:** Standalone trips hub showing all 15 Graeagle-region trips as a browsable catalog with real pricing, filtering by vibe/budget, and strong conversion to `/request-a-quote/`

**Strategy:**
- Filter API by `trip.region === "Graeagle"` (returns 15 trips)
- Sort by `pricePerPerson` ascending by default (value-first)
- Add filter tabs: All / Value ($<750) / Standard ($750–$1,000) / Premium ($1,000+)
- Each trip is a full page-like card — NOT a blog post, a structured itinerary
- Page is AEO-optimized with FAQ schema and ItemList schema of the trips
- Real prices displayed prominently — this is the differentiator vs competitors
- H1: "Real Graeagle Golf Trip Packages — Actual Itineraries & Pricing"
- This page targets: "how much does a graeagle golf trip cost", "graeagle golf package price", "graeagle golf itinerary"

**Schema on /trips/:**
```json
{
  "@type": "ItemList",
  "name": "Graeagle Golf Trip Packages",
  "numberOfItems": 15,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "TouristTrip",
        "name": "Graeagle River Pines Golf Group",
        "description": "...",
        "offers": { "@type": "Offer", "price": "620", "priceCurrency": "USD" }
      }
    }
  ]
}
```

**Page file to create:** `src/pages/trips.astro`
**Component to create:** `src/components/TripsHub.tsx` (client:load, fetches + filters + renders all Graeagle trips)

---

## Match Counts (March 2026)

| Page | Filter | Trip Count |
|------|--------|-----------|
| Grizzly Ranch | name match | 17 |
| Whitehawk Ranch | name match | 11 |
| Plumas Pines | name match | 8 |
| Graeagle Meadows | name match | 6 |
| Nakoma Dragon | name match | 1 |
| River Pines Resort | lodging match | 4 |
| Townhomes at Plumas Pines | lodging match | 4 |
| Chalet View Lodge | lodging match | 0 |
| Inn at Nakoma | lodging match | 1 |
| /trips/ page | region=Graeagle | 15 |

---

## Known Issues & To-Dos

1. **imageUrl is base64** on most trips — stock fallback renders correctly but real trip photos would be better. The Trip Caddie API sends avif base64 directly; would need a separate image proxy endpoint or CDN upload to use them.

2. **Name variant coverage** — if new trips are added to Trip Caddie with different course name formats (e.g. "Whitehawk Golf Course" instead of "Whitehawk Ranch Golf Club"), they won't match. Periodically check new trips and add variants to COURSE_NAMES.

3. **Chalet View Lodge** — 0 matching trips. No trip in the current dataset uses "Chalet View Lodge" as lodging. Component renders null (nothing shown) — correct behavior, no fix needed until trips are added.

4. **Townhomes slug issue** — Trip Caddie uses "Plumas Pines Golf Resort (Townhomes)" and "Townhomes at Plumas Pines Resort" — both covered by current LODGING_NAMES variants.

5. **/trips/ page not yet built** — see above for complete spec.

---

## Adding a New Course or Lodging to the Matching

If new courses or lodging are added to golfgraeagle in the future:

1. Add slug → name variants to `COURSE_NAMES` or `LODGING_NAMES` in `RelatedTrips.tsx`
2. Add slug → portfolio URL to `COURSE_PORTFOLIO` or `LODGING_PORTFOLIO` in `RelatedTrips.tsx`
3. Check Trip Caddie dataset to confirm the name format used there
4. Build and deploy

---

## External Links

- Trip Caddie live app: `https://tripscaddie.golfthehighsierra.com`
- Trip Caddie API: `https://golfthehighsierra.com/trips-caddie/api/api-recaps.php`
- GTHS reference implementation: `https://golfthehighsierra.vercel.app/portfolio/arrowcreek-golf-club/`
- GTHS RelatedTrips source: `digitalalchemistalex/golfthehighsierra` → `src/components/RelatedTrips.tsx`
