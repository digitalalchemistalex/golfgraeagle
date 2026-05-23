// CSP middleware v2 — nonce-based, no-store
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Generate a cryptographically random nonce per request
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const nonce = btoa(String.fromCharCode(...array));

  // Expose nonce to pages/layouts via Astro.locals
  context.locals.cspNonce = nonce;

  const response = await next();

  // Only apply CSP to HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://cdn.jsdelivr.net https://js.hs-scripts.com https://js.hubspot.com https://js.hsforms.net https://www.clarity.ms https://c.bing.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://egplpluvbfsjrqzecnjf.supabase.co https://*.algolia.net https://*.algolianet.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://golfthehighsierra.com https://www.clarity.ms https://c.bing.com",
      "frame-src 'self' https://www.googletagmanager.com https://forms.hsforms.com https://js.hsforms.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://forms.hsforms.com https://api.hsforms.com",
      "upgrade-insecure-requests",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    // Prevent edge caching of HTML so nonce is always fresh
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
});
