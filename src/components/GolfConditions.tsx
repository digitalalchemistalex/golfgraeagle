import { useState, useEffect } from 'react';

interface ConditionsData {
  updatedAt: string;
  weather: {
    condition: string;
    conditionType: string;
    iconUri: string;
    tempF: number;
    feelsF: number;
    humidity: number;
    uvIndex: number;
    windMph: number;
    windDir: string;
    isDaytime: boolean;
  } | null;
  hourly: Array<{
    tempF: number;
    condition: string;
    conditionType: string;
    rainPct: number;
    windMph: number;
    hour: any;
  }>;
  airQuality: { aqi: number; category: string; pollutant: string } | null;
  pollen: Array<{ name: string; category: string; value: number }>;
  driveTimes: Record<string, { display: string; miles: number; mins: number } | null>;
}

const UV_LABEL: Record<number, string> = { 0:'Low',1:'Low',2:'Low',3:'Moderate',4:'Moderate',5:'Moderate',6:'High',7:'High',8:'Very High',9:'Very High',10:'Very High',11:'Extreme' };
const POLLEN_COLOR: Record<string, string> = { 'None':'#6b9e6b','Very Low':'#7dbb7d','Low':'#a3d48a','Moderate':'#e8c840','High':'#e88040','Very High':'#e84040' };
const AQI_COLOR = (aqi: number) => aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffb300' : aqi <= 150 ? '#ff7043' : '#e53935';

function conditionIcon(type: string, isDaytime: boolean): string {
  const t = type?.toLowerCase() ?? '';
  if (t.includes('sunny') || t === 'clear') return isDaytime ? '☀️' : '🌙';
  if (t.includes('mostly_sunny') || t.includes('partly_cloudy')) return isDaytime ? '⛅' : '🌤️';
  if (t.includes('mostly_cloudy') || t.includes('cloudy') || t.includes('overcast')) return '☁️';
  if (t.includes('rain') || t.includes('drizzle') || t.includes('shower')) return '🌧️';
  if (t.includes('thunder') || t.includes('storm')) return '⛈️';
  if (t.includes('snow') || t.includes('sleet') || t.includes('hail')) return '❄️';
  if (t.includes('fog') || t.includes('mist') || t.includes('haze')) return '🌫️';
  if (t.includes('wind')) return '💨';
  return isDaytime ? '🌤️' : '🌙';
}

function formatHour(h: any): string {
  if (!h || typeof h !== 'object') return '';
  try {
    const d = new Date(h.year, (h.month || 1) - 1, h.day || 1, h.hours || 0);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } catch { return ''; }
}

export default function GolfConditions({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<ConditionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'now'|'hourly'|'travel'>('now');

  useEffect(() => {
    fetch('/api/golf-conditions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={S.wrap}>
      <div style={S.loadingBar}><div style={S.loadingShimmer}/></div>
    </div>
  );
  if (!data?.weather) return null;

  const { weather, hourly, airQuality, pollen, driveTimes } = data;
  const icon = conditionIcon(weather.conditionType, weather.isDaytime);
  const grassPollen = pollen.find(p => p.name === 'Grass');
  const treePollen = pollen.find(p => p.name === 'Tree');

  return (
    <div style={S.wrap}>
      {/* Tab bar */}
      <div style={S.tabs}>
        {(['now','hourly','travel'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...S.tab, ...(tab===t ? S.tabActive : {})}}>
            {t === 'now' ? '⛳ Conditions' : t === 'hourly' ? '🕐 Today' : '🚗 Drive Times'}
          </button>
        ))}
      </div>

      {/* NOW */}
      {tab === 'now' && (
        <div style={S.panel}>
          {/* Main weather */}
          <div style={S.mainRow}>
            <span style={S.bigIcon}>{icon}</span>
            <div>
              <div style={S.bigTemp}>{weather.tempF}°F</div>
              <div style={S.condText}>{weather.condition}</div>
              <div style={S.subText}>Feels {weather.feelsF}°F · {weather.windMph}mph {weather.windDir}</div>
            </div>
            <div style={S.sideStats}>
              <div style={S.stat}><span style={S.statLabel}>Humidity</span><span style={S.statVal}>{weather.humidity}%</span></div>
              <div style={S.stat}><span style={S.statLabel}>UV Index</span><span style={S.statVal}>{weather.uvIndex} · {UV_LABEL[weather.uvIndex] || 'Low'}</span></div>
              <div style={S.stat}><span style={S.statLabel}>Wind</span><span style={S.statVal}>{weather.windMph}mph {weather.windDir}</span></div>
            </div>
          </div>

          {/* AQI + Pollen */}
          <div style={S.pillRow}>
            {airQuality && (
              <div style={{...S.pill, borderColor: AQI_COLOR(airQuality.aqi)}}>
                <span style={{...S.pillDot, background: AQI_COLOR(airQuality.aqi)}}/>
                <span style={S.pillText}>AQI {airQuality.aqi} — {airQuality.category}</span>
              </div>
            )}
            {treePollen && (
              <div style={{...S.pill, borderColor: POLLEN_COLOR[treePollen.category] || '#888'}}>
                <span style={{...S.pillDot, background: POLLEN_COLOR[treePollen.category] || '#888'}}/>
                <span style={S.pillText}>Tree pollen: {treePollen.category}</span>
              </div>
            )}
            {grassPollen && (
              <div style={{...S.pill, borderColor: POLLEN_COLOR[grassPollen.category] || '#888'}}>
                <span style={{...S.pillDot, background: POLLEN_COLOR[grassPollen.category] || '#888'}}/>
                <span style={S.pillText}>Grass: {grassPollen.category}</span>
              </div>
            )}
          </div>
          <div style={S.updateNote}>Graeagle, CA · Updated {new Date(data.updatedAt).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</div>
        </div>
      )}

      {/* HOURLY */}
      {tab === 'hourly' && (
        <div style={S.panel}>
          <div style={S.hourlyGrid}>
            {hourly.map((h, i) => (
              <div key={i} style={S.hourCard}>
                <div style={S.hourTime}>{formatHour(h.hour)}</div>
                <div style={S.hourIcon}>{conditionIcon(h.conditionType, true)}</div>
                <div style={S.hourTemp}>{h.tempF}°</div>
                {h.rainPct > 0 && <div style={S.hourRain}>💧{h.rainPct}%</div>}
                <div style={S.hourWind}>{h.windMph}mph</div>
              </div>
            ))}
          </div>
          <div style={S.updateNote}>Graeagle, CA — 6-hour forecast</div>
        </div>
      )}

      {/* DRIVE TIMES */}
      {tab === 'travel' && (
        <div style={S.panel}>
          <div style={S.driveGrid}>
            {Object.entries(driveTimes).filter(([,v]) => v).map(([city, dt]) => (
              <div key={city} style={S.driveRow}>
                <div style={S.driveCity}>📍 {city}</div>
                <div style={S.driveTime}>{dt!.display}</div>
                <div style={S.driveMiles}>{dt!.miles} mi</div>
              </div>
            ))}
          </div>
          <div style={S.updateNote}>Drive times via Google Routes API · no traffic</div>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'rgba(28,18,8,0.8)', background: '#fff', border: '1px solid rgba(28,18,8,0.1)', borderRadius: 14, overflow: 'hidden' },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(28,18,8,0.08)', background: '#f8f5f0' },
  tab: { flex: 1, padding: '10px 6px', fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(28,18,8,0.45)', transition: 'color .2s', letterSpacing: '0.01em' },
  tabActive: { color: '#1c1208', borderBottom: '2px solid #e8a850', marginBottom: -1 },
  panel: { padding: '16px 18px 14px' },
  mainRow: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  bigIcon: { fontSize: 40, lineHeight: 1 },
  bigTemp: { fontSize: 32, fontWeight: 700, color: '#1c1208', lineHeight: 1 },
  condText: { fontSize: 14, color: 'rgba(28,18,8,0.65)', marginTop: 3 },
  subText: { fontSize: 12, color: 'rgba(28,18,8,0.4)', marginTop: 3 },
  sideStats: { marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' },
  stat: { display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' },
  statLabel: { fontSize: 11, color: 'rgba(28,18,8,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statVal: { fontSize: 12, fontWeight: 600, color: 'rgba(28,18,8,0.7)' },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid', borderRadius: 100, padding: '4px 10px' },
  pillDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  pillText: { fontSize: 12, color: 'rgba(28,18,8,0.65)', fontWeight: 500 },
  updateNote: { fontSize: 11, color: 'rgba(28,18,8,0.3)', marginTop: 4 },
  loadingBar: { height: 80, background: '#f5f0e8', borderRadius: 14, overflow: 'hidden', position: 'relative' },
  loadingShimmer: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)', animation: 'shimmer 1.5s infinite' },
  hourlyGrid: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 },
  hourCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 4px', background: '#f8f5f0', borderRadius: 10 },
  hourTime: { fontSize: 11, color: 'rgba(28,18,8,0.4)', fontWeight: 600 },
  hourIcon: { fontSize: 20 },
  hourTemp: { fontSize: 14, fontWeight: 700, color: '#1c1208' },
  hourRain: { fontSize: 11, color: '#3a8a48' },
  hourWind: { fontSize: 11, color: 'rgba(28,18,8,0.35)' },
  driveGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  driveRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#f8f5f0', borderRadius: 10 },
  driveCity: { flex: 1, fontSize: 13, fontWeight: 600, color: '#1c1208' },
  driveTime: { fontSize: 14, fontWeight: 700, color: '#3a8a48' },
  driveMiles: { fontSize: 12, color: 'rgba(28,18,8,0.4)', minWidth: 45, textAlign: 'right' },
};
