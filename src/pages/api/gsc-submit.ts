export const prerender = false;
import type { APIRoute } from 'astro';

const CRON_SECRET = import.meta.env.CRON_SECRET;
const SA_KEY_ENV = import.meta.env.GGE_GSC_SA_KEY;

const SITE_URL = 'https://golfgraeagle.com';

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
  '/portfolio/grizzly-ranch-golf-packages/',
  '/portfolio/graeagle-meadows-golf-packages/',
  '/portfolio/whitehawk-ranch-golf-packages/',
  '/portfolio/plumas-pines-golf-packages/',
  '/portfolio/nakoma-dragon-golf-packages/',
  '/portfolio/the-townhomes-at-plumas-pines/',
  '/portfolio/river-pines-resort-graeagle-ca/',
  '/portfolio/chalet-view-lodge-graeagle-ca/',
  '/portfolio/the-inn-at-nakoma-clio-ca/',
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
  '/best-golf-courses-graeagle/',
  '/ultimate-guide-to-golfing-in-graeagle/',
  '/graeagle-course-guide/',
  '/mountain-dining-near-lake-tahoe-graeagles-best-kept-restaurant-secrets/',
  '/embed-graeagle-golf-trips/',
  '/trips-widget/',
];

async function getIndexingToken(saJson: any): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: saJson.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const b64 = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const sigInput = `${b64(header)}.${b64(claim)}`;
  const pemBody = saJson.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const keyData = Uint8Array.from(atob(pemBody), (c: string) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', keyData.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${sigInput}.${sigB64}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const td = await tokenRes.json() as any;
  if (!td.access_token) throw new Error(`Token error: ${JSON.stringify(td)}`);
  return td.access_token;
}

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get('x-cron-auth');
  if (auth !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  if (!SA_KEY_ENV) {
    return new Response(JSON.stringify({ error: 'GGE_GSC_SA_KEY not set' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const saJson = JSON.parse(SA_KEY_ENV);
  const token = await getIndexingToken(saJson);

  const results: { url: string; status: number }[] = [];
  for (const path of ALL_URLS) {
    const url = `${SITE_URL}${path}`;
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    });
    results.push({ url, status: res.status });
  }

  const ok = results.filter((r) => r.status === 200).length;
  const failed = results.filter((r) => r.status !== 200);
  return new Response(JSON.stringify({ submitted: ok, failed, total: ALL_URLS.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
