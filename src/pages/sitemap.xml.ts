export const prerender = true;

const SITE = 'https://golfgraeagle.com';
const TODAY = new Date().toISOString().split('T')[0];

const courses = [
  'graeagle-meadows',
  'whitehawk-ranch',
  'plumas-pines',
  'grizzly-ranch',
  'nakoma-dragon',
];

function url(loc: string, priority: string, changefreq: string, lastmod = TODAY) {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url('/', '1.0', 'weekly')}
${url('/quote', '1.0', 'monthly')}
${url('/courses', '0.9', 'monthly')}
${courses.map(s => url(`/courses/${s}`, '0.9', 'monthly')).join('\n')}
${url('/lodging', '0.8', 'monthly')}
${url('/dining', '0.8', 'monthly')}
${url('/privacy-policy', '0.3', 'yearly')}
${url('/terms-and-conditions', '0.3', 'yearly')}
${url('/cancellation-policy', '0.3', 'yearly')}
${url('/disclaimer', '0.3', 'yearly')}
</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
