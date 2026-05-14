// GSC Health Check API — reads live index status for all money pages
// GET /api/gsc-health?auth=<key> — returns JSON report
// Used for automated monitoring and alerting
export const prerender = false;
import type { APIRoute } from 'astro';

const AUTH_KEY = 'a8f3d2e1b4c6f9e0a2d5b8c1e4f7a0d3'; // same as indexnow key

// All money pages — ordered by business priority
const MONEY_PAGES = [
  'https://golfgraeagle.com/',
  'https://golfgraeagle.com/request-a-quote/',
  'https://golfgraeagle.com/all-golf-courses/',
  'https://golfgraeagle.com/golf-packages/',
  'https://golfgraeagle.com/tee-times-graeagle/',
  'https://golfgraeagle.com/portfolio/grizzly-ranch-golf-packages/',
  'https://golfgraeagle.com/portfolio/nakoma-dragon-golf-packages/',
  'https://golfgraeagle.com/portfolio/whitehawk-ranch-golf-packages/',
  'https://golfgraeagle.com/portfolio/plumas-pines-golf-packages/',
  'https://golfgraeagle.com/portfolio/graeagle-meadows-golf-packages/',
  'https://golfgraeagle.com/portfolio/river-pines-resort-graeagle-ca/',
  'https://golfgraeagle.com/portfolio/the-townhomes-at-plumas-pines/',
  'https://golfgraeagle.com/portfolio/chalet-view-lodge-graeagle-ca/',
  'https://golfgraeagle.com/portfolio/the-inn-at-nakoma-clio-ca/',
  'https://golfgraeagle.com/bachelor-party-golf-graeagle/',
  'https://golfgraeagle.com/corporate-golf-outing-graeagle/',
  'https://golfgraeagle.com/graeagle-golf-weekend-packages/',
  'https://golfgraeagle.com/golf-trip-from-sacramento/',
  'https://golfgraeagle.com/summer-golf-graeagle/',
  'https://golfgraeagle.com/graeagle-course-guide/',
  'https://golfgraeagle.com/trips/',
  'https://golfgraeagle.com/blog/graeagle-golf-trip-cost/',
  'https://golfgraeagle.com/blog/graeagle-vs-lake-tahoe-golf/',
  'https://golfgraeagle.com/blog/frank-lloyd-wright-golf-clubhouse/',
  'https://golfgraeagle.com/blog/golf-courses-near-reno-nevada/',
  'https://golfgraeagle.com/blog/large-group-golf-graeagle/',
  'https://golfgraeagle.com/portfolio/sardine-lake-resort/',
  'https://golfgraeagle.com/portfolio/grizzly-grill/',
];

async function getGSCToken(saJson: any): Promise<string> {
  // Build JWT for service account auth
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: saJson.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const b64 = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const sigInput = `${b64(header)}.${b64(claim)}`;

  // Import private key
  const pemBody = saJson.private_key.replace(/-----BEGIN PRIVATE KEY-----|\n|-----END PRIVATE KEY-----/g,'');
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', keyData.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key,
    new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');

  const jwt = `${sigInput}.${sigB64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json() as any;
  return tokenData.access_token;
}

async function inspectUrl(token: string, url: string) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: 'https://golfgraeagle.com/' }),
  });
  const data = await res.json() as any;
  const ir = data?.inspectionResult?.indexStatusResult || {};
  return {
    url: url.replace('https://golfgraeagle.com','') || '/',
    verdict: ir.verdict || 'UNKNOWN',
    coverage: ir.coverageState || 'Unknown',
    lastCrawl: ir.lastCrawlTime ? ir.lastCrawlTime.slice(0,10) : 'never',
    robotsTxt: ir.robotsTxtState || 'unknown',
    canonical: ir.googleCanonical || '',
    indexed: ir.verdict === 'PASS',
  };
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const auth = url.searchParams.get('auth');
  if (auth !== AUTH_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const saKey = import.meta.env.GGE_GSC_SA_KEY;
  if (!saKey) {
    return new Response(JSON.stringify({ error: 'GGE_GSC_SA_KEY env var not set' }), { status: 500 });
  }

  let sa: any;
  try { sa = JSON.parse(saKey); } catch {
    return new Response(JSON.stringify({ error: 'GGE_GSC_SA_KEY is not valid JSON' }), { status: 500 });
  }

  try {
    const token = await getGSCToken(sa);
    const results = [];
    const notIndexed = [];
    const errors = [];

    for (const page of MONEY_PAGES) {
      const r = await inspectUrl(token, page);
      results.push(r);
      if (!r.indexed) notIndexed.push(r);
      if (r.verdict === 'ERROR') errors.push(r);
      // Rate limit: GSC inspect API allows ~1 req/sec
      await new Promise(res => setTimeout(res, 1100));
    }

    const report = {
      generated: new Date().toISOString(),
      summary: {
        total: results.length,
        indexed: results.filter(r => r.indexed).length,
        notIndexed: notIndexed.length,
        errors: errors.length,
      },
      notIndexed,
      errors,
      all: results,
    };

    return new Response(JSON.stringify(report, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
