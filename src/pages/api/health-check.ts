// Vercel cron — full site health check, emails alert on any failure
// Schedule: */30 * * * * (every 30 min) — set in vercel.json
export const prerender = false;

import type { APIRoute } from 'astro';
import { sendMail } from '../../lib/mailer';

const SITE = 'https://golfgraeagle.com';

const CHECKS = [
  // --- Core pages ---
  { name: 'Homepage',             url: '/',                                    mustContain: 'hero-section',       checkCSP: true },
  { name: 'Quote form',           url: '/request-a-quote/',                    mustContain: 'request-a-quote',    checkCSP: false },
  { name: 'FAQ',                  url: '/faq/',                                mustContain: 'FAQ',                checkCSP: false },
  { name: 'Blog index',           url: '/blog/',                               mustContain: 'blog',               checkCSP: false },
  { name: 'Real Trips',           url: '/trips/',                              mustContain: 'trips',              checkCSP: false },
  { name: 'Stay and Play',        url: '/stay-and-play/',                      mustContain: 'stay',               checkCSP: false },
  { name: 'Golf Packages',        url: '/golf-packages/',                      mustContain: 'packages',           checkCSP: false },
  { name: 'Group Golf',           url: '/group-golf/',                         mustContain: 'group',              checkCSP: false },
  { name: 'About Us',             url: '/about-us/',                           mustContain: 'Mike',               checkCSP: false },
  { name: 'All Courses',          url: '/all-golf-courses/',                   mustContain: 'courses',            checkCSP: false },
  { name: 'Lodging index',        url: '/lodging/',                            mustContain: 'lodging',            checkCSP: false },
  { name: 'Dining index',         url: '/dining/',                             mustContain: 'dining',             checkCSP: false },
  { name: 'Sitemap',              url: '/sitemap.xml',                         mustContain: '<url>',              checkCSP: false },

  // --- Course pages ---
  { name: 'Course: Grizzly Ranch',    url: '/portfolio/grizzly-ranch-golf-packages/',      mustContain: 'Grizzly Ranch',    checkCSP: true, checkFrameSrc: true },
  { name: 'Course: Graeagle Meadows', url: '/portfolio/graeagle-meadows-golf-packages/',   mustContain: 'Graeagle Meadows', checkCSP: false, checkFrameSrc: true },
  { name: 'Course: Whitehawk Ranch',  url: '/portfolio/whitehawk-ranch-golf-packages/',    mustContain: 'Whitehawk Ranch',  checkCSP: false, checkFrameSrc: true },
  { name: 'Course: Plumas Pines',     url: '/portfolio/plumas-pines-golf-packages/',       mustContain: 'Plumas Pines',     checkCSP: false, checkFrameSrc: true },
  { name: 'Course: Nakoma Dragon',    url: '/portfolio/nakoma-dragon-golf-packages/',      mustContain: 'Nakoma',           checkCSP: false, checkFrameSrc: true },

  // --- Lodging pages ---
  { name: 'Lodging: River Pines',     url: '/portfolio/river-pines-resort-graeagle-ca/',   mustContain: 'River Pines',      checkCSP: false },
  { name: 'Lodging: Chalet View',     url: '/portfolio/chalet-view-lodge-graeagle-ca/',    mustContain: 'Chalet View',      checkCSP: false },
  { name: 'Lodging: Inn at Nakoma',   url: '/portfolio/the-inn-at-nakoma-clio-ca/',        mustContain: 'Nakoma',           checkCSP: false },
  { name: 'Lodging: Townhomes',       url: '/portfolio/the-townhomes-at-plumas-pines/',    mustContain: 'Townhomes',        checkCSP: false },

  // --- Landing pages ---
  { name: 'Landing: Bachelor Party',  url: '/bachelor-party-golf-graeagle/',   mustContain: 'bachelor',           checkCSP: false },
  { name: 'Landing: Corporate',       url: '/corporate-golf-outing-graeagle/', mustContain: 'corporate',          checkCSP: false },
  { name: 'Landing: Weekend',         url: '/graeagle-golf-weekend-packages/', mustContain: 'weekend',            checkCSP: false },

  // --- APIs ---
  { name: 'API: Trips',              url: '/api/trips',                        mustContain: '"id"',               checkCSP: false },
  { name: 'API: Conditions',         url: '/api/conditions',                   mustContain: 'temp',               checkCSP: false },
];

interface CheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
}

async function runCheck(check: typeof CHECKS[0], attempt = 1): Promise<CheckResult> {
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

    if (check.mustContain && !body.toLowerCase().includes(check.mustContain.toLowerCase())) {
      return { name: check.name, url: fullUrl, ok: false, status: res.status, error: `Missing: "${check.mustContain}"` };
    }

    if (check.checkCSP) {
      const csp = res.headers.get('content-security-policy') || '';
      if (csp.includes('strict-dynamic')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP: strict-dynamic present — site will be blank' };
      }
      if (!csp.includes('unsafe-inline')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP: unsafe-inline missing — scripts blocked' };
      }
    }

    if (check.checkFrameSrc) {
      const csp = res.headers.get('content-security-policy') || '';
      if (!csp.includes('google.com')) {
        return { name: check.name, url: fullUrl, ok: false, status: res.status, error: 'CSP frame-src: google.com missing — Maps broken' };
      }
    }

    return { name: check.name, url: fullUrl, ok: true, status: res.status };

  } catch (e: any) {
    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 3000));
      return runCheck(check, 2);
    }
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
        <td style="padding:7px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${r.name}</td>
        <td style="padding:7px 12px;border-bottom:1px solid #e5e7eb;font-size:12px"><a href="${r.url}" style="color:#2563eb">${r.url.replace('https://golfgraeagle.com','')}</a></td>
        <td style="padding:7px 12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:${r.ok ? '#16a34a' : '#dc2626'};font-size:13px">${r.ok ? '✅' : '❌ FAIL'}</td>
        <td style="padding:7px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px">${r.error || ''}</td>
      </tr>`
    ).join('');

    await sendMail({
      to: [
        { name: 'Sean', email: 'sean@zoomaway.com' },
        { name: 'Mike Milligan', email: 'mike@zoomaway.com' },
        { name: 'Digital Alchemist', email: 'ifyougetlockedout@protonmail.com' },
      ],
      subject: failures.length > 0
        ? `🚨 GolfGraeagle.com — ${failures.length} check(s) failing`
        : `✅ GolfGraeagle.com — test alert (all ${results.length} checks passing)`,
      html: `
        <div style="font-family:sans-serif;max-width:780px;margin:0 auto">
          <h2 style="color:${failures.length > 0 ? '#dc2626' : '#16a34a'}">
            GolfGraeagle.com — ${failures.length > 0 ? `${failures.length} Check(s) Failing` : 'All Clear (Test)'}
          </h2>
          <p style="color:#374151;font-size:14px">
            ${failures.length > 0 ? `<strong>${failures.length} of ${results.length} checks failed</strong>` : `All ${results.length} checks passing`}
            &nbsp;·&nbsp; ${new Date().toUTCString()}
          </p>
          ${failures.length > 0 ? `
          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px 16px;margin-bottom:20px">
            <strong style="color:#dc2626">Failed:</strong>
            <ul style="margin:6px 0 0;padding-left:20px;color:#7f1d1d;font-size:13px">
              ${failures.map(f => `<li>${f.name} — ${f.error}</li>`).join('')}
            </ul>
          </div>` : ''}
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f3f4f6">
                <th style="padding:8px 12px;text-align:left;font-size:12px">Check</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px">URL</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px">Status</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px">Error</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top:20px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;padding-top:12px">
            <strong>Quick diagnosis:</strong><br>
            HTTP 500 → check Vercel deployment logs<br>
            Missing content → page blank, check CSP in middleware.ts + vercel.json<br>
            strict-dynamic in CSP → revert middleware.ts immediately (breaks all JS)<br>
            google.com missing from frame-src → Maps embed broken on course pages
          </p>
        </div>
      `,
    });
  }

  return new Response(JSON.stringify({
    ok: failures.length === 0,
    checked: results.length,
    failed: failures.length,
    failures: failures.map(f => ({ name: f.name, error: f.error })),
    timestamp: new Date().toISOString(),
  }), { headers: { 'Content-Type': 'application/json' } });
};
