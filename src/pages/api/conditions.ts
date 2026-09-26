export const prerender = false;

import type { APIRoute } from 'astro';

const LAT = 39.7662;
const LNG = -120.6185;

// Cache 30 min — free Open-Meteo API, no key needed
let cache: { data: unknown; ts: number } | null = null;
const CACHE_MS = 30 * 60 * 1000;

const WMO: Record<number, string> = {
  0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',
  80:'Rain showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',
  96:'Thunderstorm with hail',99:'Thunderstorm with heavy hail',
};

function aqCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
}

export const GET: APIRoute = async () => {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_MS) {
    return new Response(JSON.stringify(cache.data), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=1800' },
    });
  }

  try {
    const [weatherRes, aqRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&hourly=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,uv_index,cloud_cover,relative_humidity_2m,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max,wind_speed_10m_max&timezone=America%2FLos_Angeles&forecast_days=5`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LNG}&hourly=us_aqi,pm2_5&timezone=America%2FLos_Angeles&forecast_days=1`),
    ]);

    const [weather, aq] = await Promise.all([weatherRes.json(), aqRes.json()]);

    const h = weather.hourly;
    const d = weather.daily;
    const timeToC = (t: number) => Math.round(t * 10) / 10;
    const toF = (c: number) => Math.round(c * 1.8 + 32);

    // Build daily summaries
    const days = (d.time as string[]).map((date: string, i: number) => {
      const hi_c = timeToC(d.temperature_2m_max[i]);
      const lo_c = timeToC(d.temperature_2m_min[i]);
      const code = d.weather_code[i] as number;
      // Hourly hours belonging to this date
      const prefix = date + 'T';
      const hourIdxs = (h.time as string[]).map((t: string, j: number) => t.startsWith(prefix) ? j : -1).filter((j: number) => j >= 0);
      const hours = hourIdxs.map((j: number) => ({
        hour: parseInt((h.time[j] as string).slice(11, 13)),
        temp_c: timeToC(h.temperature_2m[j]),
        temp_f: toF(h.temperature_2m[j]),
        feels_f: toF(h.apparent_temperature[j]),
        condition: WMO[h.weather_code[j]] || 'Unknown',
        wind_mph: Math.round(h.wind_speed_10m[j] * 0.621),
        uv: h.uv_index[j] || 0,
        cloud_pct: h.cloud_cover[j] || 0,
        humidity: h.relative_humidity_2m[j] || 0,
        precip_mm: h.precipitation[j] || 0,
        is_daytime: (h.is_day[j] as number) === 1,
      }));
      return {
        date,
        lo_c, hi_c,
        lo_f: toF(lo_c),
        hi_f: toF(hi_c),
        temp: toF(hi_c), // health-check field
        uv_max: d.uv_index_max[i] || 0,
        wind_mph: Math.round(d.wind_speed_10m_max[i] * 0.621),
        condition: WMO[code] || 'Unknown',
        hours,
      };
    });

    // Air quality (first valid AQI reading)
    const aqiValues = (aq.hourly?.us_aqi as (number|null)[]) || [];
    const aqi = aqiValues.find((v: number | null) => v != null) ?? 0;
    const air_quality = {
      aqi,
      display: String(aqi),
      category: aqCategory(aqi),
    };

    // Golf score
    const today = days[0];
    let golfScore = 100;
    if (today) {
      if (today.hi_c > 35) golfScore -= 20;
      if (today.hi_c < 10) golfScore -= 30;
      if (today.cloud_pct > 80) golfScore -= 15;
      if (today.wind_mph > 20) golfScore -= 20;
      if (today.uv_max > 10) golfScore -= 10;
      golfScore = Math.max(0, Math.min(100, golfScore));
    }

    const result = {
      updated: new Date().toISOString(),
      location: 'Graeagle, CA',
      temp: today?.hi_f ?? null, // top-level convenience + health-check field
      days,
      air_quality,
      pollen: [],
      golf_score: golfScore,
      golf_conditions: golfScore >= 80 ? 'Excellent' : golfScore >= 60 ? 'Good' : golfScore >= 40 ? 'Fair' : 'Poor',
    };

    cache = { data: result, ts: now };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=1800' },
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
