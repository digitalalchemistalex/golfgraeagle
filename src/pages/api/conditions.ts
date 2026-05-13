export const prerender = false;

import type { APIRoute } from 'astro';

const API_KEY = import.meta.env.GGE_GOOGLE_MAPS_API_KEY || 'AIzaSyDI1hLFH83qpZDjxj93OYJvGghRAmtHF8U';
const LAT = 39.7662;
const LNG = -120.6185;

// Cache: serve same data for 30 min to avoid hammering APIs
let cache: { data: any; ts: number } | null = null;
const CACHE_MS = 30 * 60 * 1000;

export const GET: APIRoute = async () => {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_MS) {
    return new Response(JSON.stringify(cache.data), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=1800' }
    });
  }

  try {
    const [weatherRes, aqRes, pollenRes] = await Promise.all([
      // Weather hourly forecast — 48 hours
      fetch(`https://weather.googleapis.com/v1/forecast/hours:lookup?key=${API_KEY}&location.latitude=${LAT}&location.longitude=${LNG}&hours=48`),
      // Air quality
      fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: { latitude: LAT, longitude: LNG } }),
      }),
      // Pollen 3 days
      fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=${API_KEY}&location.latitude=${LAT}&location.longitude=${LNG}&days=3`),
    ]);

    const [weatherData, aqData, pollenData] = await Promise.all([
      weatherRes.json(),
      aqRes.json(),
      pollenRes.json(),
    ]);

    // Process weather into daily summaries
    const dailyMap: Record<string, any[]> = {};
    for (const fh of weatherData.forecastHours || []) {
      const dt = fh.displayDateTime || {};
      const day = `${dt.year}-${String(dt.month).padStart(2,'0')}-${String(dt.day).padStart(2,'0')}`;
      if (!dailyMap[day]) dailyMap[day] = [];
      dailyMap[day].push({
        hour: dt.hours,
        condition: fh.weatherCondition?.description?.text || '',
        condition_type: fh.weatherCondition?.type || '',
        icon: fh.weatherCondition?.iconBaseUri || '',
        temp_c: fh.temperature?.degrees,
        feels_c: fh.feelsLikeTemperature?.degrees,
        humidity: fh.relativeHumidity,
        uv: fh.uvIndex || 0,
        cloud_pct: fh.cloudCover || 0,
        wind_kph: fh.wind?.speed?.value || 0,
        wind_dir: fh.wind?.direction?.cardinal || '',
        is_daytime: fh.isDaytime,
      });
    }

    const days = Object.entries(dailyMap).slice(0, 5).map(([date, hours]) => {
      const temps = hours.map(h => h.temp_c).filter(t => t != null);
      const daytimeHours = hours.filter(h => h.is_daytime);
      const peakUV = Math.max(...hours.map(h => h.uv || 0));
      const maxWind = Math.max(...hours.map(h => h.wind_kph || 0));
      const avgCloud = hours.reduce((s, h) => s + (h.cloud_pct || 0), 0) / hours.length;
      const conditions = [...new Set(hours.map(h => h.condition).filter(Boolean))];
      const icons = [...new Set(hours.map(h => h.icon).filter(Boolean))];
      return {
        date,
        lo_c: temps.length ? Math.round(Math.min(...temps) * 10) / 10 : null,
        hi_c: temps.length ? Math.round(Math.max(...temps) * 10) / 10 : null,
        lo_f: temps.length ? Math.round(Math.min(...temps) * 1.8 + 32) : null,
        hi_f: temps.length ? Math.round(Math.max(...temps) * 1.8 + 32) : null,
        uv_max: peakUV,
        wind_mph: Math.round(maxWind * 0.621),
        cloud_pct: Math.round(avgCloud),
        condition: conditions[0] || '',
        icon: icons[0] || '',
        hours: hours.map(h => ({
          hour: h.hour,
          temp_c: h.temp_c,
          temp_f: h.temp_c != null ? Math.round(h.temp_c * 1.8 + 32) : null,
          condition: h.condition,
          icon: h.icon,
          wind_mph: Math.round((h.wind_kph || 0) * 0.621),
          uv: h.uv,
          cloud_pct: h.cloud_pct,
          is_daytime: h.is_daytime,
        })),
      };
    });

    // Air quality
    const aqIdx = aqData.indexes?.[0] || {};
    const aq = {
      aqi: aqIdx.aqi,
      display: aqIdx.aqiDisplay,
      category: aqIdx.category,
      pollutant: aqIdx.dominantPollutant,
      color: aqIdx.color,
    };

    // Pollen
    const pollen = (pollenData.dailyInfo || []).slice(0, 3).map((day: any) => {
      const dt = day.date || {};
      return {
        date: `2026-${String(dt.month).padStart(2,'0')}-${String(dt.day).padStart(2,'0')}`,
        types: Object.fromEntries(
          (day.pollenTypeInfo || []).map((t: any) => [
            t.displayName,
            { category: t.indexInfo?.category || '?', value: t.indexInfo?.value || 0 }
          ])
        ),
      };
    });

    // Golf condition score (0–100) based on weather
    const today = days[0];
    let golfScore = 100;
    if (today) {
      if ((today.hi_c || 25) > 35) golfScore -= 20; // too hot
      if ((today.hi_c || 25) < 10) golfScore -= 30; // too cold
      if ((today.cloud_pct || 0) > 80) golfScore -= 15;
      if ((today.wind_mph || 0) > 20) golfScore -= 20;
      if ((today.uv_max || 0) > 10) golfScore -= 10;
      golfScore = Math.max(0, Math.min(100, golfScore));
    }

    const result = {
      updated: new Date().toISOString(),
      location: 'Graeagle, CA',
      days,
      air_quality: aq,
      pollen,
      golf_score: golfScore,
      golf_conditions: golfScore >= 80 ? 'Excellent' : golfScore >= 60 ? 'Good' : golfScore >= 40 ? 'Fair' : 'Poor',
    };

    cache = { data: result, ts: now };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=1800' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
