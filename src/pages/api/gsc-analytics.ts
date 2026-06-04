// GSC Search Analytics API — full performance data
// GET /api/gsc-analytics?auth=<key>&days=28&type=queries|pages|dates
export const prerender = false;
import type { APIRoute } from 'astro';

const AUTH_KEY = 'a8f3d2e1b4c6f9e0a2d5b8c1e4f7a0d3';
const SITE_URL = 'https://golfgraeagle.com/';

async function getGSCToken(saJson: any): Promise<string> {
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

async function querySearchAnalytics(token: string, body: any) {
  const encoded = encodeURIComponent(SITE_URL);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

function getDateRange(days: number) {
  const end = new Date(); end.setDate(end.getDate() - 2); // GSC 2-day lag
  const start = new Date(end); start.setDate(start.getDate() - days);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const auth = url.searchParams.get('auth');
  if (auth !== AUTH_KEY) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const days = parseInt(url.searchParams.get('days') || '28');
  const type = url.searchParams.get('type') || 'all';

  try {
    const saKey = import.meta.env.GGE_GSC_SA_KEY;
    if (!saKey) return new Response(JSON.stringify({ error: 'GGE_GSC_SA_KEY not set' }), { status: 500 });

    const saJson = JSON.parse(saKey);
    const token = await getGSCToken(saJson);
    const range = getDateRange(days);

    const results: any = { dateRange: range, days };

    if (type === 'all' || type === 'queries') {
      // Top queries by clicks
      const qData = await querySearchAnalytics(token, {
        ...range,
        dimensions: ['query'],
        rowLimit: 50,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      });
      results.topQueries = (qData.rows || []).map((r: any) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: Math.round(r.ctr * 1000) / 10,
        position: Math.round(r.position * 10) / 10,
      }));
    }

    if (type === 'all' || type === 'pages') {
      // Top pages by clicks
      const pData = await querySearchAnalytics(token, {
        ...range,
        dimensions: ['page'],
        rowLimit: 50,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      });
      results.topPages = (pData.rows || []).map((r: any) => ({
        page: r.keys[0].replace('https://golfgraeagle.com', ''),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: Math.round(r.ctr * 1000) / 10,
        position: Math.round(r.position * 10) / 10,
      }));
    }

    if (type === 'all' || type === 'dates') {
      // Daily clicks trend
      const dData = await querySearchAnalytics(token, {
        ...range,
        dimensions: ['date'],
        rowLimit: days,
        orderBy: [{ fieldName: 'date', sortOrder: 'ASCENDING' }],
      });
      results.daily = (dData.rows || []).map((r: any) => ({
        date: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
      }));
    }

    // Always include site totals
    const totals = await querySearchAnalytics(token, {
      ...range,
      rowLimit: 1,
    });
    results.totals = totals.rows?.[0]
      ? {
          clicks: totals.rows[0].clicks,
          impressions: totals.rows[0].impressions,
          ctr: Math.round(totals.rows[0].ctr * 1000) / 10,
          position: Math.round(totals.rows[0].position * 10) / 10,
        }
      : null;

    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
