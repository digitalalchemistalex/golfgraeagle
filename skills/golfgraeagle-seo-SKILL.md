---
name: golfgraeagle-seo
description: "SEO and AEO strategy for GolfGraeagle.com. Target keywords per page, meta tag templates, full schema markup for every page type, sitemap priorities, and internal linking map. Read before any SEO or content optimization work."
---

# GolfGraeagle.com — SEO & AEO Skill
## Read golfgraeagle-master FIRST. Use this file for all SEO, schema, and AEO work.

---

## TARGET KEYWORD MAP

### Primary (homepage + site-wide)
- `graeagle golf` (highest volume, broadest)
- `graeagle golf courses` 
- `golf graeagle california`
- `graeagle golf packages`
- `graeagle golf trips`

### Course Hub (/courses)
- `best golf courses in graeagle`
- `graeagle golf courses ranked`
- `how many golf courses in graeagle`
- `graeagle california golf`

### Individual Course Pages
| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| graeagle-meadows | `graeagle meadows golf course` | `graeagle meadows tee times`, `graeagle meadows golf packages` |
| whitehawk-ranch | `whitehawk ranch golf course` | `whitehawk ranch graeagle`, `whitehawk ranch golf packages` |
| plumas-pines | `plumas pines golf resort` | `plumas pines golf course graeagle`, `plumas pines golf packages` |
| grizzly-ranch | `grizzly ranch golf club` | `grizzly ranch graeagle golf`, `grizzly ranch golf packages` |
| nakoma-dragon | `nakoma golf course` | `the dragon golf course graeagle`, `frank lloyd wright golf clubhouse`, `nakoma dragon golf packages` |

### Lodging Pages
- `graeagle golf lodging`
- `graeagle stay and play golf packages`
- `graeagle golf resort`
- `golf packages graeagle ca`

### Dining Pages
- `restaurants in graeagle ca`
- `graeagle restaurants`
- `dining near graeagle golf courses`

### Blog/Content Pages
- `when is the best time to golf in graeagle`
- `graeagle vs lake tahoe golf`
- `graeagle golf trip planning`
- `northern california mountain golf`

### High-Value Long-Tail (AEO targets)
- `what golf courses are near lake tahoe`
- `frank lloyd wright golf course california`
- `best golf courses northern california mountains`
- `graeagle golf trip how many days`
- `how far is graeagle from sacramento`
- `graeagle golf courses open to public`

---

## META TAG TEMPLATES

### Homepage
```
<title>Graeagle Golf Packages & Tee Times | GolfGraeagle.com</title>
<meta name="description" content="Plan your Graeagle golf trip with 5 championship courses — Graeagle Meadows, Whitehawk Ranch, Plumas Pines, Grizzly Ranch, and Nakoma Dragon. Custom packages, tee times, and lodging for groups of all sizes." />
```

### Course Hub
```
<title>Best Golf Courses in Graeagle, California | Complete Guide</title>
<meta name="description" content="Graeagle has 5 championship golf courses within 25 minutes of each other: Graeagle Meadows, Whitehawk Ranch, Plumas Pines, Grizzly Ranch, and Nakoma (The Dragon). Compare courses, fees, and difficulty." />
```

### Individual Course Page Pattern
```
<title>[Course Name] — Tee Times, Packages & Info | Graeagle, CA</title>
<meta name="description" content="[Course Name] is a [par/yards] championship course in Graeagle, CA, designed by [Designer]. [One key differentiator]. Book tee times and stay-and-play packages through GolfGraeagle." />
```

Example — Nakoma:
```
<title>Nakoma Dragon Golf Course — Tee Times & Packages | Graeagle, CA</title>
<meta name="description" content="Nakoma Dragon is a par-72, 7,015-yard championship course in Clio, CA, designed by Robin Nelson. The only golf clubhouse designed by Frank Lloyd Wright. Book packages through GolfGraeagle." />
```

### Lodging Page Pattern
```
<title>[Property Name] — Golf Lodging & Stay and Play | Graeagle, CA</title>
<meta name="description" content="[Property Name] offers [key feature] for golf groups visiting Graeagle, CA. [Distance to courses]. Book stay-and-play packages through GolfGraeagle." />
```

### Blog Post Pattern
```
<title>[Post Title] | GolfGraeagle.com</title>
<meta name="description" content="[Direct answer to the post's main question in 1 sentence.] [Supporting context sentence.]" />
```

---

## SCHEMA MARKUP — BY PAGE TYPE

### Golf Course Page
```json
{
  "@context": "https://schema.org",
  "@type": "GolfCourse",
  "name": "Nakoma Dragon Golf Course",
  "description": "Championship 18-hole golf course designed by Robin Nelson, featuring the only golf clubhouse designed by Frank Lloyd Wright.",
  "url": "https://golfgraeagle.com/courses/nakoma-dragon",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Clio",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.7543,
    "longitude": -120.5311
  },
  "numberOfHoles": 18,
  "sameAs": "https://www.nakoma.com"
}
```

### FAQPage Schema (add to every course, lodging, FAQ page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Nakoma Dragon Golf Course open to the public?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nakoma Dragon is a semi-private course open to public play, though tee time availability varies by season. Book through GolfGraeagle for guaranteed access."
      }
    }
  ]
}
```

### BreadcrumbList (add to all inner pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://golfgraeagle.com"},
    {"@type": "ListItem", "position": 2, "name": "Golf Courses", "item": "https://golfgraeagle.com/courses"},
    {"@type": "ListItem", "position": 3, "name": "Nakoma Dragon", "item": "https://golfgraeagle.com/courses/nakoma-dragon"}
  ]
}
```

### LocalBusiness (homepage and About page)
```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "GolfGraeagle.com",
  "description": "Golf trip planning and package booking for Graeagle, California — operated by Zoomaway Technologies Inc.",
  "url": "https://golfgraeagle.com",
  "email": "sean@zoomaway.com",
  "areaServed": {
    "@type": "Place",
    "name": "Graeagle, California"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Zoomaway Technologies Inc."
  }
}
```

### Restaurant Schema (dining pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "[Restaurant Name]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Graeagle",
    "addressRegion": "CA"
  },
  "servesCuisine": "[Cuisine type]",
  "priceRange": "$$$"
}
```

### LodgingBusiness Schema (lodging pages)
```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "[Property Name]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Graeagle",
    "addressRegion": "CA"
  },
  "description": "[Property description]",
  "url": "https://golfgraeagle.com/lodging/[slug]"
}
```

### BlogPosting Schema (blog posts)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title]",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "author": {
    "@type": "Organization",
    "name": "GolfGraeagle.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zoomaway Technologies Inc.",
    "url": "https://golfgraeagle.com"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://golfgraeagle.com/blog/[slug]"
  }
}
```

---

## SITEMAP PRIORITIES

```xml
<!-- Priority 1.0 — Core conversion pages -->
<url><loc>https://golfgraeagle.com/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
<url><loc>https://golfgraeagle.com/quote</loc><priority>1.0</priority><changefreq>monthly</changefreq></url>

<!-- Priority 0.9 — Course hub and individual courses -->
<url><loc>https://golfgraeagle.com/courses</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/courses/nakoma-dragon</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/courses/grizzly-ranch</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/courses/whitehawk-ranch</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/courses/plumas-pines</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/courses/graeagle-meadows</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>

<!-- Priority 0.8 — Lodging and dining hubs -->
<url><loc>https://golfgraeagle.com/lodging</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
<url><loc>https://golfgraeagle.com/dining</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>

<!-- Priority 0.7 — Blog posts -->
<!-- Priority 0.6 — Individual dining/lodging pages -->
<!-- Priority 0.3 — Legal pages -->
```

---

## INTERNAL LINKING MAP

### Homepage → links to:
- /courses (hub)
- /courses/nakoma-dragon (featured)
- /courses/grizzly-ranch (featured)
- /lodging
- /dining
- /quote (primary CTA)

### /courses (hub) → links to:
- All 5 individual course pages
- /quote
- /lodging (stay & play)

### Each course page → links to:
- /courses (back to hub)
- /lodging (stay near this course)
- /quote (CTA)
- 2–3 other course pages (compare/pair)

### /lodging → links to:
- Individual lodging pages
- /courses (nearby courses)
- /quote

### Blog posts → link to:
- Relevant course pages
- /quote (end of post CTA)
- Related blog posts

---

## OG TAGS (Base Layout)

```astro
<!-- In Base.astro <head> -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url.href} />
<meta property="og:image" content="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&q=80&auto=format" />
<meta property="og:site_name" content="GolfGraeagle.com" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

---

## CANONICAL URL PATTERN

```astro
<link rel="canonical" href={`https://golfgraeagle.com${Astro.url.pathname}`} />
```

Never allow duplicate content between `/courses/nakoma-dragon` and any package sub-pages.

---

## llms.txt (AEO — AI Crawler File)

Located at: `public/llms.txt`  
Update whenever a new page is added.

```
# GolfGraeagle.com — AI-readable site index
# Operated by Zoomaway Technologies Inc.

GolfGraeagle.com is a golf trip planning platform for the Graeagle, California region.
We offer packages, tee times, and lodging for 5 championship golf courses.

## Golf Courses
- Graeagle Meadows Golf Course: /courses/graeagle-meadows (Par 72, 6,759 yards, Ellis Van Gorder, 1968)
- Whitehawk Ranch Golf Course: /courses/whitehawk-ranch (Par 71, 6,983 yards, Dick Bailey, 1996)
- Plumas Pines Golf Resort: /courses/plumas-pines (Par 72, 6,504 yards, Homer Flint, 1980)
- Grizzly Ranch Golf Club: /courses/grizzly-ranch (Par 72, 7,411 yards, Bob Cupp, 2005)
- Nakoma Dragon Golf Course: /courses/nakoma-dragon (Par 72, 7,015 yards, Robin Nelson, 1998, FLW clubhouse)

## Plan Your Trip
- Request a Quote: /quote
- Lodging: /lodging
- Dining: /dining

## About
Operator: Zoomaway Technologies Inc. | Contact: sean@zoomaway.com
```

---

## robots.txt

```
User-agent: *
Allow: /

Sitemap: https://golfgraeagle.com/sitemap.xml
```

---

## PAGE TITLE FORMAT

```
[Primary Keyword / Page Topic] | GolfGraeagle.com
```

- Homepage: `Graeagle Golf Packages & Tee Times | GolfGraeagle.com`
- Keep titles under 60 characters
- Include location modifier (Graeagle, CA) on all inner pages

---

## HEADING HIERARCHY RULES

- H1: One per page — keyword-rich, answers the page's core question
- H2: Major section breaks — use question format for AEO ("What makes Grizzly Ranch the hardest course?")
- H3: Sub-sections within H2s
- Never skip levels (no H1 → H3)

---

## AEO PRIORITY QUESTIONS (target for featured snippet / AI Overview)

These are the exact questions to answer with structured, direct responses:

1. "How many golf courses are in Graeagle California?" → Answer: 5 (list them)
2. "What is the best golf course in Graeagle?" → Answer: depends on skill level (direct comparison)
3. "Is Graeagle near Lake Tahoe?" → Answer: ~1.5 hours from North Lake Tahoe
4. "What is the Frank Lloyd Wright golf clubhouse?" → Answer: Nakoma, designed by FLW, located in Clio CA
5. "Is Nakoma Golf Course open to the public?" → Answer: semi-private, public play available
6. "When does golf season start in Graeagle?" → Answer: typically May, closes October/November
7. "How far is Graeagle from Sacramento?" → Answer: approximately 2.5 hours
8. "How far is Graeagle from San Francisco?" → Answer: approximately 3.5–4 hours
9. "What is the hardest golf course in Graeagle?" → Answer: Nakoma Dragon (slope 147)
10. "What golf courses are in Plumas County California?" → Answer: list all 5
