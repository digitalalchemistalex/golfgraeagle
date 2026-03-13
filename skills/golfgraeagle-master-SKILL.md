---
name: golfgraeagle-master
description: "Complete site inventory, brand identity, confirmed facts, and content gaps for GolfGraeagle.com. Read this FIRST before any task on this project. Contains every confirmed fact from the WordPress export — nothing invented."
---

# GolfGraeagle.com — Master Skill
## READ THIS FIRST before any task on this project.

---

## BUSINESS IDENTITY

| Field | Value |
|-------|-------|
| Site | golfgraeagle.com |
| Operator | Zoomaway Technologies Inc. |
| Contact | sean@zoomaway.com |
| Parent company | Zoomaway Technologies Inc. |
| Sibling sites | golfthehighsierra.com, groupgolftours.com, mesquitestgeorgegolftours.com |
| Subsidiaries | Zoomaway Inc., Tripsee |
| Web products | Golf the High Sierra, Group Golf Tours, Golf Graeagle, ZoomedIN |
| What it is | Golf trip planning and package booking platform for Graeagle, CA — NOT a golf course |
| Primary CTA | Request a Quote → /quote |
| Cancellation | 72-hour standard window; group contracts separately |

---

## TECH STACK (CURRENT — DO NOT DEVIATE)

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (output: 'server') |
| Adapter | @astrojs/vercel |
| Styling | Tailwind CSS v4 + @tailwindcss/vite |
| Fonts | Playfair Display (headlines), Inter (body), Libre Baskerville (accent) |
| Database | Supabase (project: egplpluvbfsjrqzecnjf) |
| Hosting | Vercel (auto-deploy from GitHub main) |
| GitHub | digitalalchemistalex/golfgraeagle |

### CRITICAL: Tailwind v4
- NO tailwind.config.mjs — CSS-first config via @theme {} in src/styles/global.css
- Vite plugin: @tailwindcss/vite in astro.config.mjs
- DO NOT install @astrojs/tailwind

### CRITICAL: Astro page pattern
- All pages: `export const prerender = true`
- API routes only: `export const prerender = false`

---

## CREDENTIALS (READ FROM PROJECT FILES — NEVER HARDCODE IN CODE)

| Key | Location |
|-----|----------|
| GitHub classic token | /mnt/project/goit_classic_token_ |
| Vercel token | /mnt/project/vercel_token |
| Supabase anon (legacy) | /mnt/project/https___supabase_com_dashboard... |
| Supabase service_role (legacy) | /mnt/project/https___supabase_com_dashboard... |

Vercel team: `golfbookingsystem` | team ID: `team_DIp7IhTyWkStmeevzS9FPx20`  
Vercel project: `golfgraeagle` | project ID: `prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl`  
Supabase URL: `https://egplpluvbfsjrqzecnjf.supabase.co`

### Supabase Auth Pattern (ALWAYS use this)
```bash
curl -s "$SUPA_URL/rest/v1/TABLE?limit=1&apikey=$ANON" \
  -H "Authorization: Bearer $SVC"
```

---

## DESIGN SYSTEM (Sierra Morning Palette)

| Token | Value | Use |
|-------|-------|-----|
| Background | #0d1a0e | Deep forest green — NOT pure black |
| Primary accent | #e8a850 | Dawn gold — CTAs, highlights |
| Accent hover | #f2c878 | Gold hover state |
| Accent deep | #c88840 | Pressed/active state |
| sierra-950 | defined in global.css | Full scale available |
| mist-* | defined in global.css | Sky/water accents |

- Real Unsplash images on all cards with gradient overlays
- Animations and parallax effects expected
- Price display: `$$` / `$$$` / `$$$$` tiers only — NEVER show specific dollar amounts
- Copyright: `© {year} Zoomaway Technologies Inc.` — auto-updates year

---

## PROJECT STRUCTURE

```
golfgraeagle/
├── astro.config.mjs
├── package.json
├── public/robots.txt, llms.txt
└── src/
    ├── components/
    │   ├── Nav.astro          # Mega menu
    │   └── Footer.astro       # 5-col footer
    ├── data/content.js        # ALL site data + siteConfig
    ├── layouts/Base.astro     # SEO head + animations
    ├── styles/global.css      # Tailwind v4 @theme Sierra palette
    └── pages/
        ├── index.astro              # Homepage
        ├── quote.astro              # 5-step quote form
        ├── lodging.astro
        ├── dining.astro
        ├── privacy-policy.astro
        ├── terms-and-conditions.astro
        ├── cancellation-policy.astro
        ├── disclaimer.astro
        ├── api/leads.ts             # POST → Supabase gg_leads
        └── courses/
            ├── index.astro          # Hub: comparison table
            └── [slug].astro         # 5 individual course pages
supabase/migrations/
    ├── 001_create_gg_tables.sql
    ├── 002_seed_gg_courses.sql
    └── 003_update_gg_leads_full_schema.sql  # EXECUTED ✅
```

---

## PAGES BUILT (14 total — all deployed ✅)

| Page | URL | Status |
|------|-----|--------|
| Homepage | / | ✅ Live |
| Courses Hub | /courses | ✅ Live |
| Graeagle Meadows | /courses/graeagle-meadows | ✅ Live |
| Whitehawk Ranch | /courses/whitehawk-ranch | ✅ Live |
| Plumas Pines | /courses/plumas-pines | ✅ Live |
| Grizzly Ranch | /courses/grizzly-ranch | ✅ Live |
| Nakoma Dragon | /courses/nakoma-dragon | ✅ Live |
| Lodging | /lodging | ✅ Live |
| Dining | /dining | ✅ Live |
| Quote Form | /quote | ✅ Live |
| Privacy Policy | /privacy-policy | ✅ Live |
| Terms | /terms-and-conditions | ✅ Live |
| Cancellation | /cancellation-policy | ✅ Live |
| Disclaimer | /disclaimer | ✅ Live |

### PAGES NOT YET BUILT
- /about
- /blog (hub)
- /blog/[slug] (individual posts)
- /faq
- Individual dining venue pages
- Individual lodging property pages
- /courses/graeagle-meadows-golf-packages (package detail)
- /courses/whitehawk-ranch-golf-packages
- etc.

---

## THE 5 GOLF COURSES (CONFIRMED FACTS — DO NOT INVENT)

### Graeagle Meadows Golf Course
- Par: 72 | Yards: 6,759 | Slope: 120 | Rating: 70.7
- Designer: Ellis Van Gorder | Opened: 1968
- Type: Classic parkland, tree-lined, meadow setting
- Slug: graeagle-meadows

### Whitehawk Ranch Golf Course
- Par: 71 | Yards: 6,983 | Slope: 132 | Rating: 72.3
- Designer: Dick Bailey | Opened: 1996
- Type: Mountain links, open terrain, elevation changes
- Must-Play ⭐ | Slug: whitehawk-ranch

### Plumas Pines Golf Resort
- Par: 72 | Yards: 6,504 | Slope: 132 | Rating: 71.3
- Designer: Homer Flint | Opened: 1980
- Type: Mountain parkland, water features, pine forest
- Slug: plumas-pines

### Grizzly Ranch Golf Club
- Par: 72 | Yards: 7,411 | Slope: 140 | Rating: 74.9
- Designer: Bob Cupp | Opened: 2005
- Type: Championship, links-style, exposed ridges, mountain wind
- Must-Play ⭐ | Slug: grizzly-ranch

### Nakoma (The Dragon) Golf Course
- Par: 72 | Yards: 7,015 | Slope: 147 | Rating: 73.4
- Designer: Robin Nelson & Neil Haworth | Opened: 1998
- Clubhouse: Designed by Frank Lloyd Wright (only FLW golf clubhouse)
- Accolade: Golf World Top 75 courses at debut
- Type: Championship, most challenging in the region
- Must-Play ⭐ | Slug: nakoma-dragon

### Regional Facts
- All 5 courses within 5–25 minutes of each other
- Altitude advantage: longer carry, faster greens, cleaner air
- Season: typically May through October (weather dependent)
- No big-city traffic — predictable drive times from Sacramento/Bay Area

---

## LODGING PROPERTIES (CONFIRMED FROM WP EXPORT)

| Property | Slug | Status |
|----------|------|--------|
| River Pines Resort | river-pines-resort-graeagle-ca | Portfolio item (empty content) |
| Chalet View Lodge | chalet-view-lodge-graeagle-ca | Portfolio item (empty content) |
| The Inn at Nakoma | the-inn-at-nakoma-clio-ca | Portfolio item (empty content) |
| The Townhomes at Plumas Pines | the-townhomes-at-plumas-pines | Portfolio item (empty content) |

Townhomes description (confirmed): "Spacious and cozy multi-room townhomes – perfect for families or golf groups seeking comfort and convenience."  
Near championship golf courses, multiple bedrooms, full kitchens, pools and tennis courts.

---

## DINING VENUES (CONFIRMED FROM WP EXPORT)

### Fine Dining Category
- Grizzly Grill (slug: grizzly-grill)
- Cuccia's (slug: cuccias)
- Iron Door Restaurant (slug: iron-door-restaurant)
- Sardine Lake Resort (slug: sardine-lake-resort)

### Variety Dining Category
- Roadhouse at River Pines (slug: roadhouse-at-river-pines)
- Longboards Bar and Grill (slug: longboards-bar-and-grill)
- Graeagle Meadows Golf Course Restaurant (slug: graeagle-meadows-golf-course-restaurant)
- Gumba's II Go (slug: gumbas-ii-go)
- Sierra SmokeShow (slug: sierra-smokeshow)
- Graeagle Mountain Frostee (slug: graeagle-mountain-frostee)
- Little Bite Deli (slug: little-bite-deli)
- Graeagle Restaurant (slug: graeagle-restaurant)

### Breweries & Bars Category
- Eureka Peak Brewing Co. (slug: eureka-peak-brewing-co) — confirmed tagline: "Handcrafted Mountain Brews & Seasonal Fare"
- The Brewing Lair (slug: the-brewing-lair)
- Mohawk Tavern (slug: mohawk-tavern) — confirmed name: "Mohawk Tavern"
- The Knotty Pine Tavern (slug: the-knotty-pine-tavern)

---

## SUPABASE TABLES

| Table | Purpose | Status |
|-------|---------|--------|
| gg_leads | Quote form submissions | ✅ Live, RLS enabled |
| gg_courses | Golf course data | ✅ Created |
| gg_blog_posts | Blog content | ✅ Created |

**IMPORTANT:** This Supabase project (`egplpluvbfsjrqzecnjf`) is SHARED with mesquitestgeorgegolftours.com. The `gg_` prefix isolates GolfGraeagle tables from MSG tables. NEVER touch tables without `gg_` prefix.

---

## QUOTE FORM (5-step native form)

| Step | Fields |
|------|--------|
| 1 Contact | firstName, lastName, email, phone, howHeard |
| 2 Trip Details | desiredRegion, partySize, arrivalDate, departureDate, numNights, datesFlexible, lodgingType, roomConfig |
| 3 Golf Prefs | totalRounds, idealTeeTimes, playOnArrival, playOnDeparture |
| 4 Course Selection | coursesInterested[] — all 5 courses as toggle cards |
| 5 Extras | transportationNeeded, specialFBEvent, fbEventWhen (conditional), specialRequests |

URL param pre-check: `/quote?course=nakoma-dragon&courseName=Nakoma+Dragon`  
API endpoint: POST /api/leads → Supabase gg_leads  
Success state: personalized with firstName + email  

---

## HUBSPOT FORM (legacy — available but native form preferred)

Portal ID: `20743417`  
Form ID: `8ac29a68-a31f-41d4-9c5b-6c4549dd5dcf`  
Embed script: `https://js.hsforms.net/forms/embed/20743417.js`

---

## BLOG POSTS (from WP export)

| Post | Status | Slug |
|------|--------|------|
| Mountain Dining Near Lake Tahoe: Graeagle's Best Kept Restaurant Secrets | Published | mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets |
| Graeagle Golf Courses Ranked by Player Experience | DRAFT (empty) | — |
| Ultimate Guide to Golfing in Graeagle | Published | ultimate-guide-to-golfing-in-graeagle |
| Best Golf Courses in Graeagle, California (Complete Guide) | Published | best-golf-courses-graeagle |

---

## CONTENT GAPS (what needs research before writing)

| Item | Missing |
|------|---------|
| Graeagle Meadows | Signature holes, green fee range, amenities |
| Whitehawk Ranch | Signature holes, green fee range, lodge details |
| Plumas Pines | Signature holes, green fee range, resort amenities |
| Grizzly Ranch | Signature holes, green fee range, member/public access |
| 12 dining venues | Hours, cuisine type, address, vibe, what to order |
| River Pines Resort | Room types, capacity, group amenities, pricing tier |
| Chalet View Lodge | Room types, capacity, amenities |
| Inn at Nakoma | Room types, connection to Nakoma course, amenities |
| About Us | Company story, team, mission |

**RULE:** If a fact is not in this skill file or verifiable via web search, insert `[PLACEHOLDER: need X]` and move on. Never invent.

---

## DEPLOYMENT WORKFLOW

```bash
cd /home/claude/golfgraeagle
npx astro build          # verify clean build
git add -A
git commit -m "type: description"
git push origin main
# Vercel auto-deploys in ~20 seconds
```

Build verification:
```bash
curl -s https://api.vercel.com/v6/deployments \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -G --data-urlencode "projectId=prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl" \
  --data-urlencode "teamId=team_DIp7IhTyWkStmeevzS9FPx20" \
  --data-urlencode "limit=1" | jq '.deployments[0].state'
```

---

## HARD RULES

1. **Never invent:** green fees, pricing, ratings, designer names, or any fact not in this file or verified via web search
2. **Always search** for: yardages, par, designers, restaurant hours/address/cuisine, lodging amenities
3. **Price display:** `$$` / `$$$` / `$$$$` only — no specific dollar amounts
4. **Every page** needs a CTA pointing to /quote or /request-a-quote
5. **Copyright always:** © {year} Zoomaway Technologies Inc.
6. **DB safety:** Only touch `gg_*` tables in Supabase — never MSG tables
7. **Tailwind v4:** No tailwind.config.mjs — CSS-first only
8. **AEO structure:** Direct Q&A format, short declarative sentences, comparison tables
