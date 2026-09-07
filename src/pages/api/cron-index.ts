// Vercel cron — daily indexing ping to Google Indexing API + Bing IndexNow
// Runs at 4am UTC daily (after cron-rebuild at 3am)
// Schedule: 0 4 * * * — set in vercel.json
export const prerender = false;
import type { APIRoute } from 'astro';

const CRON_SECRET = import.meta.env.CRON_SECRET;
const SITE = 'https://golfgraeagle.com';
const BING_KEY = import.meta.env.BING_WMT_API_KEY;
const INDEXNOW_KEY = 'a8f3d2e1b4c6f9e0a2d5b8c1e4f7a0d3';

// All canonical money URLs — courses, lodging, dining, blog, landing pages
const ALL_URLS = [
  '/',
  '/request-a-quote/',
  '/all-golf-courses/',
  '/golf-packages/',
  '/stay-and-play/',
  '/golf-packages-northern-california/',
  '/lodging/',
  '/dining/',
  '/best-golf-courses-graeagle/',
  '/ultimate-guide-to-golfing-in-graeagle/',
  '/graeagle-golf-itinerary/',
  '/tee-times-graeagle/',
  '/group-golf/',
  '/bachelor-party-golf-graeagle/',
  '/corporate-golf-outing-graeagle/',
  '/graeagle-golf-resort/',
  '/faq/',
  '/about-us/',
  '/blog/',
  // Courses
  '/portfolio/grizzly-ranch-golf-packages/',
  '/portfolio/graeagle-meadows-golf-packages/',
  '/portfolio/whitehawk-ranch-golf-packages/',
  '/portfolio/plumas-pines-golf-packages/',
  '/portfolio/nakoma-dragon-golf-packages/',
  // Lodging
  '/portfolio/river-pines-resort-graeagle-ca/',
  '/portfolio/chalet-view-lodge-graeagle-ca/',
  '/portfolio/the-inn-at-nakoma-clio-ca/',
  '/portfolio/the-townhomes-at-plumas-pines/',
  // Dining
  '/portfolio/grizzly-grill/',
  '/portfolio/iron-door-restaurant/',
  '/portfolio/sardine-lake-resort/',
  '/portfolio/roadhouse-at-river-pines/',
  '/portfolio/cuccias/',
  '/portfolio/the-brewing-lair/',
  '/portfolio/sierra-smokeshow/',
  '/portfolio/eureka-peak-brewing-co/',
  '/portfolio/mohawk-tavern/',
  '/portfolio/the-knotty-pine-tavern/',
  '/portfolio/little-bite-deli/',
  '/portfolio/longboards-bar-and-grill/',
  '/portfolio/gumbas-ii-go/',
  // Blog
  '/blog/frank-lloyd-wright-golf-clubhouse/',
  '/blog/best-golf-courses-northern-california-mountains/',
  '/blog/graeagle-golf-courses-ranked/',
  '/blog/graeagle-golf-trip-cost/',
  '/blog/graeagle-vs-lake-tahoe-golf/',
  '/blog/golf-near-lake-tahoe/',
  '/blog/graeagle-golf-trip-itinerary-3-days/',
  '/blog/how-to-plan-graeagle-golf-trip/',
  '/blog/bachelor-party-golf-graeagle/',
  '/blog/corporate-golf-outing-graeagle/',
  '/blog/large-group-golf-graeagle/',
  '/blog/graeagle-golf-weekend/',
  '/blog/golf-tournament-graeagle/',
  '/blog/golf-courses-near-reno-nevada/',
  '/blog/when-does-golf-season-start-graeagle/',
  '/blog/senior-golf-trips-graeagle/',
  '/blog/graeagle-golf-bucket-list/',
  '/blog/graeagle-golf-trip-planner/',
  '/blog/graeagle-golf-packages-4-golfers/',
  '/blog/best-time-to-golf-graeagle/',
];

// ── Google Indexing API JWT (reuses pattern from gsc-analytics.ts) ─────
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
  const b64 = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const sigInput = `${b64(header)}.${b64(claim)}`;
  const pemBody = saJson.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g,'');
  const keyData = Uint8Array.from(atob(pemBody), (c: string) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', keyData.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
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

// ── Google Indexing API — batch with 200ms delay between requests ──────
async function pingGoogle(token: string, urls: string[]): Promise<{ ok: number; fail: number; errors: string[] }> {
  let ok = 0, fail = 0;
  const errors: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      });
      if (res.ok) { ok++; } else {
        fail++;
        const body = await res.text();
        errors.push(`${url} → ${res.status}: ${body.slice(0, 80)}`);
      }
    } catch (e: any) {
      fail++;
      errors.push(`${url} → ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200)); // 200ms between calls — stay under quota
  }
  return { ok, fail, errors };
}

// ── Bing IndexNow — batch submission ──────────────────────────────────
async function pingBing(urls: string[]): Promise<{ status: number; ok: boolean }> {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'golfgraeagle.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  return { status: res.status, ok: res.status === 200 || res.status === 202 };
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const fullUrls = ALL_URLS.map(p => `${SITE}${p}`);
  const results: any = {
    timestamp: new Date().toISOString(),
    urlCount: fullUrls.length,
    google: null,
    bing: null,
    errors: [],
  };

  // ── Google Indexing API ────────────────────────────────────────────
  try {
    const saKey = import.meta.env.GGE_GSC_SA_KEY;
    if (!saKey) throw new Error('GGE_GSC_SA_KEY not set');
    const saJson = JSON.parse(saKey);
    const token = await getIndexingToken(saJson);
    const gResult = await pingGoogle(token, fullUrls);
    results.google = gResult;
    console.log(`[cron-index] Google: ${gResult.ok} ok, ${gResult.fail} fail`);
  } catch (e: any) {
    results.google = { ok: 0, fail: fullUrls.length, errors: [e.message] };
    results.errors.push(`Google: ${e.message}`);
    console.error('[cron-index] Google error:', e.message);
  }

  // ── Bing IndexNow ─────────────────────────────────────────────────
  try {
    const bResult = await pingBing(fullUrls);
    results.bing = bResult;
    console.log(`[cron-index] Bing IndexNow: HTTP ${bResult.status}`);
  } catch (e: any) {
    results.bing = { ok: false, error: e.message };
    results.errors.push(`Bing: ${e.message}`);
    console.error('[cron-index] Bing error:', e.message);
  }

  const allOk = results.google?.fail === 0 && results.bing?.ok;
  return new Response(JSON.stringify(results, null, 2), {
    status: allOk ? 200 : 207,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
