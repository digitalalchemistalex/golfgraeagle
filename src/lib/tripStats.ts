/**
 * tripStats.ts — shared build-time fetch for TripsCaddie pricing data.
 * Single fetch — returns both stats and raw trips array.
 * Called from trips.astro and all landing pages during `astro build`.
 */

const API = 'https://golfthehighsierra.com/trips-caddie/api/api-recaps.php';

const GRAEAGLE_COURSES = [
  'grizzly', 'nakoma', 'whitehawk', 'plumas pines', 'graeagle meadows', 'graeagle',
];

function isGraeagle(t: any): boolean {
  if ((t.region || '').toLowerCase().includes('graeagle')) return true;
  const courses = (t.courses || []).join(' ').toLowerCase();
  return GRAEAGLE_COURSES.some(k => courses.includes(k));
}

export interface TripStats {
  minPrice: number;
  maxPrice: number;
  tripCount: number;
  totalGolfers: number;
  trips: any[];
}

export async function fetchTripStats(): Promise<TripStats> {
  try {
    const res = await fetch(`${API}?t=${Date.now()}`);
    const all: any[] = await res.json();
    const trips = all.filter(isGraeagle);
    const prices = trips
      .map((t: any) => t.pricePerPerson || t.pricePerPersonEstimate || 0)
      .filter(Boolean);
    return {
      minPrice: prices.length ? Math.min(...prices) : 379,
      maxPrice: prices.length ? Math.max(...prices) : 1705,
      tripCount: trips.length,
      totalGolfers: trips.reduce((s: number, t: any) => s + (t.groupSize || 0), 0),
      trips,
    };
  } catch {
    // Fallback to last known values — update after each major trips batch
    return { minPrice: 379, maxPrice: 1705, tripCount: 22, totalGolfers: 358, trips: [] };
  }
}
