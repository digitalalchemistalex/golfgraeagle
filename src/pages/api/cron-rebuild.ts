// Vercel cron — polls TripsCaddie, triggers rebuild only if Graeagle trip count changed
// Schedule: 0 3 * * * (3am UTC daily) — set in vercel.json
export const prerender = false;

const CADDIE_URL = 'https://golfthehighsierra.com/trips-caddie/api/api-recaps.php';
const SUPA_URL = 'https://egplpluvbfsjrqzecnjf.supabase.co/rest/v1/gg_config';
const VERCEL_PROJECT = 'prj_PH8j2XqMfaWlqstkrlDWJeC2GsLl';
const VERCEL_TEAM = 'team_DIp7IhTyWkStmeevzS9FPx20';

export async function GET({ request }: { request: Request }) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch current Graeagle trip count from TripsCaddie
    const caddieRes = await fetch(CADDIE_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const trips = await caddieRes.json();
    const currentCount = trips.filter((t: any) => t.region?.toLowerCase() === 'graeagle').length;

    // 2. Get last known count from Supabase gg_config table
    const supaKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const configRes = await fetch(`${SUPA_URL}?key=eq.caddie_trip_count`, {
      headers: {
        'apikey': supaKey,
        'Authorization': `Bearer ${supaKey}`,
      }
    });
    const config = await configRes.json();
    const lastCount = config[0]?.value ? parseInt(config[0].value) : 0;

    // 3. If count changed — update Supabase + trigger redeploy
    if (currentCount !== lastCount) {
      // Update stored count
      await fetch(`${SUPA_URL}?key=eq.caddie_trip_count`, {
        method: 'PATCH',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ value: String(currentCount) })
      });

      // Trigger Vercel redeploy via API
      const vercelToken = import.meta.env.VERCEL_TOKEN;
      const latestRes = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT}&teamId=${VERCEL_TEAM}&limit=1`,
        { headers: { 'Authorization': `Bearer ${vercelToken}` } }
      );
      const { deployments } = await latestRes.json();
      const latestUid = deployments[0]?.uid;

      await fetch(`https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM}&forceNew=1`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentId: latestUid, name: 'golfgraeagle', target: 'production' })
      });

      return new Response(JSON.stringify({
        ok: true, action: 'rebuilt', previousCount: lastCount, currentCount
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      ok: true, action: 'skipped', count: currentCount
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}
