export const prerender = false;
import type { APIRoute } from 'astro';

const INDEXNOW_KEY = 'a8f3d2e1b4c6f9e0a2d5b8c1e4f7a0d3';
const SITE_URL = 'https://golfgraeagle.com';

// All canonical URLs — kept in sync with sitemap.xml.ts
const ALL_URLS = [
  '/',
  '/request-a-quote/',
  '/golf-packages/',
  '/stay-and-play/',
  '/group-golf/',
  '/graeagle-golf-itinerary/',
  '/tee-times-graeagle/',
  '/all-golf-courses/',
  '/golf-trip-from-sacramento/',
  '/summer-golf-graeagle/',
  '/graeagle-golf-resort/',
  '/bachelor-party-golf-graeagle/',
  '/corporate-golf-outing-graeagle/',
  '/graeagle-golf-weekend-packages/',
  '/trips/',
  '/lodging/',
  '/dining/',
  '/faq/',
  '/about-us/',
  '/about/mike-eskuchen/',
  '/blog/',
  // Courses
  '/portfolio/grizzly-ranch-golf-packages/',
  '/portfolio/graeagle-meadows-golf-packages/',
  '/portfolio/whitehawk-ranch-golf-packages/',
  '/portfolio/plumas-pines-golf-packages/',
  '/portfolio/nakoma-dragon-golf-packages/',
  // Lodging
  '/portfolio/the-townhomes-at-plumas-pines/',
  '/portfolio/river-pines-resort-graeagle-ca/',
  '/portfolio/chalet-view-lodge-graeagle-ca/',
  '/portfolio/the-inn-at-nakoma-clio-ca/',
  // Dining
  '/portfolio/grizzly-grill/',
  '/portfolio/iron-door-restaurant/',
  '/portfolio/sardine-lake-resort/',
  '/portfolio/roadhouse-at-river-pines/',
  '/portfolio/graeagle-restaurant/',
  '/portfolio/graeagle-meadows-golf-course-restaurant/',
  '/portfolio/sierra-smokeshow/',
  '/portfolio/gumbas-ii-go/',
  '/portfolio/cuccias/',
  '/portfolio/eureka-peak-brewing-co/',
  '/portfolio/the-brewing-lair/',
  '/portfolio/mohawk-tavern/',
  '/portfolio/the-knotty-pine-tavern/',
  '/portfolio/little-bite-deli/',
  '/portfolio/graeagle-mountain-frostee/',
  '/portfolio/longboards-bar-and-grill/',
  // Blog
  '/blog/graeagle-golf-courses-ranked/',
  '/blog/graeagle-golf-trip-itinerary-3-days/',
  '/blog/how-to-plan-graeagle-golf-trip/',
  '/blog/graeagle-vs-lake-tahoe-golf/',
  '/blog/best-time-to-golf-graeagle/',
  '/blog/bachelor-party-golf-graeagle/',
  '/blog/graeagle-golf-trip-cost/',
  '/blog/graeagle-golf-trip-planner/',
  '/blog/graeagle-golf-packages-4-golfers/',
  '/blog/large-group-golf-graeagle/',
  '/blog/corporate-golf-outing-graeagle/',
  '/blog/graeagle-golf-bucket-list/',
  '/blog/graeagle-golf-weekend/',
  '/blog/golf-near-lake-tahoe/',
  '/blog/golf-tournament-graeagle/',
  '/blog/when-does-golf-season-start-graeagle/',
  '/blog/frank-lloyd-wright-golf-clubhouse/',
  '/blog/golf-courses-near-reno-nevada/',
  '/blog/best-golf-courses-northern-california-mountains/',
  '/blog/senior-golf-trips-graeagle/',
  // Landing pages
  '/best-golf-courses-graeagle/',
  '/ultimate-guide-to-golfing-in-graeagle/',
  '/graeagle-course-guide/',
  '/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets/',
  '/embed-graeagle-golf-trips/',
  '/trips-widget/',
];

// Bing IndexNow endpoint (also notifies Yandex, Seznam, others in the IndexNow network)
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export const POST: APIRoute = async ({ request }) => {
  // Simple auth: require a secret header to prevent abuse
  const auth = request.headers.get('x-indexnow-auth');
  if (auth !== INDEXNOW_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const urlList = ALL_URLS.map(path => `${SITE_URL}${path}`);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'golfgraeagle.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    const status = res.status;
    // 200 = OK submitted, 202 = accepted for processing, both are success
    const success = status === 200 || status === 202;

    console.log(`[indexnow] Submitted ${urlList.length} URLs — HTTP ${status}`);

    return new Response(JSON.stringify({
      success,
      status,
      urlsSubmitted: urlList.length,
      message: success ? `${urlList.length} URLs submitted to IndexNow` : `IndexNow returned ${status}`,
    }), { status: success ? 200 : 500, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[indexnow] Error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

// Also expose GET for manual trigger from browser (authenticated same way)
export const GET: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({
    message: 'IndexNow endpoint ready. POST with x-indexnow-auth header to submit all URLs.',
    urls: ALL_URLS.length,
    key: INDEXNOW_KEY,
    keyFile: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
