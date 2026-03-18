export const prerender = false;

export async function GET() {
  try {
    const res = await fetch(
      `https://golfthehighsierra.com/trips-caddie/api/api-recaps.php?t=${Date.now()}`,
      { headers: { 'Origin': 'https://tripscaddie.golfthehighsierra.com' } }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'upstream error', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5 min cache
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'fetch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
