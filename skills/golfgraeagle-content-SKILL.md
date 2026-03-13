---
name: golfgraeagle-content
description: "Writing rules, page templates, and confirmed facts for creating content on GolfGraeagle.com. Read before writing any page, post, or portfolio item. Prevents invented facts. Requires golfgraeagle-master to be read first."
---

# GolfGraeagle.com — Content Skill
## Read golfgraeagle-master FIRST, then this file before writing any content.

---

## VOICE & TONE

| Principle | Rule |
|-----------|------|
| Audience | Both individual golfers AND golf groups (4–24 players) |
| Voice | Confident mountain insider — knows the region, cuts through noise |
| Tone | Warm but efficient — no fluff, no filler, no invented superlatives |
| POV | Third-party curator — GolfGraeagle picks and packages the best |
| Never say | "world-class", "breathtaking", "nestled" — overused resort clichés |
| Always say | Specific facts: distances, par, elevation, designer names |
| AEO-first | Every page answers a real question a golfer would ask Google |

---

## WRITING RULES

### MUST DO
- Open every page/section with the most important fact first (inverted pyramid)
- Use short declarative sentences: "Grizzly Ranch plays to 7,411 yards from the tips."
- Comparison tables wherever two or more items are being evaluated
- Include a FAQ section on every course and lodging page (minimum 4 Q&As)
- Every page ends with a CTA block pointing to /quote
- Schema markup required on all course, dining, and lodging pages

### MUST NOT DO
- Never invent green fees, ratings, designer names, or course specs — use [PLACEHOLDER: need X]
- Never show specific dollar prices — use $$/$$$/$$$$ tier indicators only
- Never say a restaurant "features" something you haven't verified
- Never describe a lodging property's room count, capacity, or amenities without research
- Never claim GolfGraeagle IS a golf course — it's a booking/planning platform

### PLACEHOLDER PATTERN
When a fact is needed but unverified:
```
[PLACEHOLDER: green fee range for Whitehawk Ranch]
[PLACEHOLDER: Grizzly Ranch private/public status]
[PLACEHOLDER: Cuccia's hours and cuisine type]
```

---

## PAGE TEMPLATES

### Course Package Page (`/courses/[slug]`)

```
H1: [Course Name] — Golf Packages & Tee Times | Graeagle, CA

Hero block:
- Course name, tagline, designer credit, year opened
- Par / Yards / Slope / Rating in a stat bar
- CTA: "Request a Package Quote →"

Section 1: Course Overview (3–4 paragraphs)
- What kind of course is it? (parkland, links, mountain)
- Who designed it and what's the design philosophy
- What makes it stand out in the Graeagle lineup
- Distance from other courses / from town

Section 2: What to Expect
- Difficulty rating / who it's best for (beginners, low-handicap, groups)
- Signature holes (if verified)
- Elevation, terrain, weather considerations
- Green fee tier: $$ / $$$ / $$$$

Section 3: GolfGraeagle Packages (if data available)
- Stay & Play options
- Multi-course deals
- Group rates
- CTA: "Get a Custom Quote →"

Section 4: FAQ (minimum 4 questions)
- Is [Course Name] open to the public?
- What is the best time to play [Course Name]?
- How far is [Course Name] from [other course]?
- Can GolfGraeagle book tee times at [Course Name]?

Schema: GolfCourse + FAQPage + BreadcrumbList
```

---

### Lodging Page (`/lodging/[slug]`)

```
H1: [Property Name] — Graeagle Golf Lodging & Stay and Play Packages

Hero block:
- Property name, type (hotel/resort/townhome/private home)
- Location relative to courses (e.g., "adjacent to Plumas Pines")
- CTA: "Check Package Availability →"

Section 1: Property Overview
- What kind of property
- Best for: couples / golf groups / families / large parties
- Capacity (if verified)
- Price tier: $$ / $$$ / $$$$

Section 2: Amenities (only verified facts — use [PLACEHOLDER] otherwise)

Section 3: Golf Connection
- Which courses are closest / walkable / driveable
- Any on-site or preferred course relationship

Section 4: FAQ (minimum 3 questions)

Schema: LodgingBusiness + FAQPage + BreadcrumbList
```

---

### Dining Page (`/dining/[slug]`)

```
H1: [Restaurant Name] — Graeagle, CA

Hero block:
- Restaurant name, cuisine type, price tier
- Address / area (e.g., "downtown Graeagle" or "at the Meadows course")
- Hours (if verified)

Section 1: Overview (2–3 paragraphs)
- Vibe and setting
- What to order (if verified)
- Who it's best for (post-round beers, fine dining, families)

Section 2: Details
- Price tier
- Hours
- Reservations: required / recommended / walk-in

Footer CTA: "Planning a golf trip? Request a quote →"

Schema: Restaurant + LocalBusiness
```

---

### Blog Post Template

```
Title: [Keyword-rich, AEO-optimized — answers a question]
Slug: [kebab-case, under 60 chars]

Introduction (2 paragraphs):
- Answer the title question immediately in paragraph 1
- Give context and set up the rest of the post in paragraph 2

Body sections (H2 headings):
- Each H2 is a sub-question the reader would have
- 2–4 paragraphs per section
- Use comparison tables for course/lodging/dining comparisons
- Include specific facts (distances, par, designer, cuisine)

FAQ section (bottom of post):
- 3–5 questions using exact phrasing people search
- Direct 1–2 sentence answers

CTA block (end of post):
- "Ready to book your Graeagle golf trip? Request a custom package quote →"

Schema: BlogPosting + FAQPage + BreadcrumbList
```

---

## COMPARISON TABLE FORMAT

Use this format for any page comparing 2+ courses, lodgings, or dining options:

```
| Course | Par | Yards | Difficulty | Best For | Price |
|--------|-----|-------|------------|----------|-------|
| Graeagle Meadows | 72 | 6,759 | Moderate | All levels | $$ |
| Whitehawk Ranch | 71 | 6,983 | Challenging | Mid-low HC | $$$ |
| Plumas Pines | 72 | 6,504 | Moderate | Seniors/groups | $$ |
| Grizzly Ranch | 72 | 7,411 | Very Hard | Low HC | $$$$ |
| Nakoma Dragon | 72 | 7,015 | Hardest | Low HC | $$$$ |
```

---

## AEO (Answer Engine Optimization) RULES

GolfGraeagle competes for AI Overview citations and voice assistant answers.

### Page structure for AEO:
1. **Question in H1** or immediately below H1: "How many golf courses are in Graeagle?"
2. **Direct answer in first sentence:** "There are five golf courses in the Graeagle area of Northern California."
3. **Supporting facts in 1–2 sentences:** Name them, distance relationship, season.
4. **Structured data:** FAQPage schema for every FAQ section.

### AEO-optimized FAQ format:
```html
<div itemscope itemtype="https://schema.org/FAQPage">
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">How many golf courses are in Graeagle, California?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">There are five golf courses in the Graeagle area: Graeagle Meadows, Whitehawk Ranch, Plumas Pines, Grizzly Ranch, and Nakoma (The Dragon). All five courses are within 5–25 minutes of each other.</p>
    </div>
  </div>
</div>
```

### High-value AEO questions to answer on every relevant page:
- "How many golf courses are in Graeagle California?"
- "What is the hardest golf course in Graeagle?"
- "Is Nakoma Golf Course open to the public?"
- "What is the best golf course in Graeagle for beginners?"
- "How far is Graeagle from Lake Tahoe / Sacramento / San Francisco?"
- "When is the best time to golf in Graeagle California?"
- "What is the Frank Lloyd Wright golf clubhouse in California?"

---

## CONFIRMED CONTENT — READY TO WRITE NOW

These pages can be written with facts already in hand:

| Page | Available Content |
|------|------------------|
| /courses (hub) | All 5 course specs, comparison table, AEO Q&As |
| /courses/nakoma-dragon | Full description, designer, FLW clubhouse, Top 75 accolade |
| /courses/grizzly-ranch | Par/yards/slope/rating/designer confirmed |
| /courses/whitehawk-ranch | Par/yards/slope/rating/designer confirmed |
| /courses/plumas-pines | Par/yards/slope/rating/designer confirmed |
| /courses/graeagle-meadows | Par/yards/slope/rating/designer confirmed |
| /faq | Use confirmed Q&As from master skill |
| /about | Use real WP content + Zoomaway identity facts |
| Lodging hub | Good intro copy confirmed |
| Townhomes page | Good descriptive copy confirmed |
| Eureka Peak Brewing | Tagline confirmed |
| All legal pages | Already built |

---

## CONTENT THAT REQUIRES RESEARCH FIRST

Do NOT write these pages until web research confirms the required facts:

| Page | What to search for |
|------|-------------------|
| Individual dining pages (12) | "[Venue name] Graeagle CA hours cuisine address" |
| River Pines Resort | "River Pines Resort Graeagle CA rooms amenities" |
| Chalet View Lodge | "Chalet View Lodge Graeagle CA rooms amenities" |
| Inn at Nakoma | "Inn at Nakoma Clio CA rooms golf packages" |
| Signature holes (all courses) | "[Course name] signature holes scorecard" |

---

## CTA BLOCK (use at end of every page)

```astro
<section class="cta-block">
  <h2>Ready to Book Your Graeagle Golf Trip?</h2>
  <p>Tell us your dates, group size, and which courses you want to play. 
     We'll build a custom package with tee times and lodging.</p>
  <a href="/quote" class="btn-primary">Request a Free Quote →</a>
</section>
```

Variations:
- "Plan your multi-course Graeagle golf trip →"
- "Get tee times at all 5 Graeagle courses →"
- "Build your custom stay & play package →"
