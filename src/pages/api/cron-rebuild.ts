// Vercel cron endpoint — triggers nightly rebuild to refresh TripsCaddie data
// Called by vercel.json crons config at 3am UTC daily
export const prerender = false;

export async function GET({ request }: { request: Request }) {
  // Verify it's from Vercel cron (basic auth check)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Trigger deploy hook
    const hookUrl = 'https://api.vercel.com/v1/integrations/deploy/prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl/viCqqjbQPw';
    const res = await fetch(hookUrl, { method: 'POST' });
    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, job: data.job?.id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
