// Vercel cron — site health check, emails alert on any failure
// Schedule: */30 * * * * (every 30 min) — set in vercel.json
export const prerender = false;

import type { APIRoute } from 'astro';
import { sendMail } from '../../lib/mailer';

const SITE = 'https://golfgraeagle.com';

const CHECKS = [
  {
    name: 'Homepage',
    url: '/',
    mustContain: 'hero-section',
    checkCSP: true,
  },
  {
    name: 'Grizzly Ranch page',
    url: '/portfolio/grizzly-ranch-golf-packages/',
    mustContain: 'Grizzly Ranch',
    checkCSP: true,
    checkFrameSrc: true,
  },
  {
    name: 'Quote form',
    url: '/request-a-quote/',
    mustContain: 'request-a-quote',
    checkCSP: false,
  },
  {
    name: 'Trips API',
    url: '/api/trips',
    mustContain: '"id"',
    checkCSP: false,
  },
];

interface CheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
}

async function runCheck(check: typeof CHECKS[0]): Promise<CheckResult> {
  const fullUrl = `${SITE}${check.url}`;
  try {
    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': 'GGE-HealthCheck/1.0' },
      redirect: 'follow',
    });

    if (!res.ok) {
      return { name: check.name, url: fullUrl, ok: false, status: res.status, error: `HTTP ${res.status}` };
    }

    const body = await res.text();

    // Content check
    if (check.mustContain && !body.includes(check.mustContain)) {
      return { name: check.name, url: fullUrl, ok: false, status: res.status, error: `Missing expected content: "${check.mustContain}"` };
    }

    // CSP check — strict-dynamic must NOT be present
    if (check.checkCSP) {
      const csp = res.headers.get('content-security-policy') || '';
      if (csp.includes('strict-dynamic')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP contains strict-dynamic — site will be blank' };
      }
      if (!csp.includes('unsafe-inline')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP missing unsafe-inline — scripts may be blocked' };
      }
    }

    // Frame-src check — Google Maps must be allowed
    if (check.checkFrameSrc) {
      const csp = res.headers.get('content-security-policy') || '';
      if (!csp.includes('google.com')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP frame-src missing google.com — Maps embed broken' };
      }
    }

    return { name: check.name, url: fullUrl, ok: true, status: res.status };

  } catch (e: any) {
    return { name: check.name, url: fullUrl, ok: false, error: `Fetch failed: ${e.message}` };
  }
}

export const GET: APIRoute = async ({ request, url }) => {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const forceAlert = url.searchParams.get('force') === '1';
  const results: CheckResult[] = await Promise.all(CHECKS.map(runCheck));
  const failures = results.filter(r => !r.ok);

  if (failures.length > 0 || forceAlert) {
    const rows = results.map(r =>
      `<tr style="background:${r.ok ? '#f0fdf4' : '#fef2f2'}">
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${r.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb"><a href="${r.url}">${r.url}</a></td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:${r.ok ? '#16a34a' : '#dc2626'}">${r.ok ? '✅ OK' : '❌ FAIL'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280">${r.error || `HTTP ${r.status}`}</td>
      </tr>`
    ).join('');

    await sendMail({
      to: [
        { name: 'Sean', email: 'sean@zoomaway.com' },
        { name: 'Mike Milligan', email: 'mike@zoomaway.com' },
      ],
      subject: `🚨 GolfGraeagle.com — ${failures.length} check(s) failing`,
      html: `
        <div style="font-family:sans-serif;max-width:700px;margin:0 auto">
          <h2 style="color:#dc2626">GolfGraeagle.com — Site Health Alert</h2>
          <p style="color:#374151">${failures.length} of ${results.length} checks failed at ${new Date().toUTCString()}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f3f4f6">
                <th style="padding:8px 12px;text-align:left">Check</th>
                <th style="padding:8px 12px;text-align:left">URL</th>
                <th style="padding:8px 12px;text-align:left">Status</th>
                <th style="padding:8px 12px;text-align:left">Error</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top:24px;color:#6b7280;font-size:13px">
            Failures to investigate:<br>
            — HTTP 500: server error, check Vercel deployment logs<br>
            — Missing content: page rendering blank, check CSP + JS<br>
            — strict-dynamic in CSP: site will be blank, revert middleware.ts immediately<br>
            — Missing google.com in frame-src: Maps embed broken on course pages
          </p>
        </div>
      `,
    });
  }

  return new Response(JSON.stringify({
    ok: failures.length === 0,
    checked: results.length,
    failed: failures.length,
    results,
    timestamp: new Date().toISOString(),
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
