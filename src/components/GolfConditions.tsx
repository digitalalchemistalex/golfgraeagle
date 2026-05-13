import { useState, useEffect } from 'react';

interface HourData {
  hour: number;
  temp_f: number;
  condition: string;
  icon: string;
  wind_mph: number;
  uv: number;
  cloud_pct: number;
  is_daytime: boolean;
}

interface DayData {
  date: string;
  lo_f: number;
  hi_f: number;
  uv_max: number;
  wind_mph: number;
  cloud_pct: number;
  condition: string;
  icon: string;
  hours: HourData[];
}

interface ConditionsData {
  updated: string;
  location: string;
  days: DayData[];
  air_quality: { aqi: number; category: string; pollutant: string } | null;
  pollen: Array<{ date: string; types: Record<string, { category: string; value: number }> }>;
  golf_score: number;
  golf_conditions: string;
}

const UV_LABEL: Record<number, string> = {
  0:'Low',1:'Low',2:'Low',3:'Moderate',4:'Moderate',5:'Moderate',
  6:'High',7:'High',8:'Very High',9:'Very High',10:'Very High',11:'Extreme'
};
const POLLEN_COLOR: Record<string, string> = {
  'None':'#6b9e6b','Very Low':'#7dbb7d','Low':'#a3d48a',
  'Moderate':'#e8c840','High':'#e88040','Very High':'#e84040','?':'#aaa'
};
const AQI_COLOR = (aqi: number) =>
  aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffb300' : aqi <= 150 ? '#ff7043' : '#e53935';
const SCORE_COLOR = (s: number) =>
  s >= 80 ? '#3a8a48' : s >= 60 ? '#e8a850' : s >= 40 ? '#ff7043' : '#e53935';

function conditionIcon(condition: string, isDaytime: boolean = true): string {
  const c = (condition || '').toLowerCase();
  if (c.includes('sunny') || c === 'clear') return isDaytime ? '☀️' : '🌙';
  if (c.includes('partly') || c.includes('mostly sunny')) return isDaytime ? '⛅' : '🌤️';
  if (c.includes('mostly cloudy') || c.includes('overcast')) return '☁️';
  if (c.includes('cloudy')) return '🌥️';
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) return '🌧️';
  if (c.includes('thunder') || c.includes('storm')) return '⛈️';
  if (c.includes('snow') || c.includes('sleet')) return '❄️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  if (c.includes('wind')) return '💨';
  return isDaytime ? '🌤️' : '🌙';
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

// Google attribution SVG — required by Google API ToS
function GoogleLogo() {
  return (
    <svg width="44" height="15" viewBox="0 0 44 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
      <path d="M5.84 7.15c0 2.13-1.67 3.7-3.72 3.7C.08 10.85-1.5 9.28-1.5 7.15c0-2.14 1.58-3.7 3.62-3.7 1 0 1.84.37 2.49 1l-.7.7c-.42-.4-1-.63-1.79-.63-1.47 0-2.6 1.18-2.6 2.63 0 1.46 1.13 2.63 2.6 2.63.93 0 1.54-.37 1.9-.73.3-.3.49-.72.56-1.3H2.12V7.16h3.65c.04.21.07.41.07.63v-.64z" fill="#4285F4" transform="translate(2 2)"/>
      <path d="M12.3 7.5c0 1.7-1.33 2.96-2.97 2.96-1.63 0-2.96-1.26-2.96-2.96 0-1.71 1.33-2.96 2.96-2.96 1.64 0 2.97 1.25 2.97 2.96zm-1.3 0c0-1.07-.77-1.8-1.67-1.8-.9 0-1.67.73-1.67 1.8 0 1.06.77 1.8 1.67 1.8.9 0 1.67-.74 1.67-1.8z" fill="#EA4335" transform="translate(2 2)"/>
      <path d="M18.8 7.5c0 1.7-1.33 2.96-2.97 2.96-1.63 0-2.96-1.26-2.96-2.96 0-1.71 1.33-2.96 2.96-2.96 1.64 0 2.97 1.25 2.97 2.96zm-1.3 0c0-1.07-.77-1.8-1.67-1.8-.9 0-1.67.73-1.67 1.8 0 1.06.77 1.8 1.67 1.8.9 0 1.67-.74 1.67-1.8z" fill="#FBBC05" transform="translate(2 2)"/>
      <path d="M25 4.68v5.9c0 2.42-1.43 3.41-3.12 3.41-1.6 0-2.55-.67-2.92-1.23l1.13-.47c.22.34.77.74 1.79.74 1.17 0 1.9-.72 1.9-2.08v-.5h-.05c-.35.43-.97.81-1.8.81-1.7 0-3.27-1.48-3.27-3.39 0-1.92 1.57-3.42 3.27-3.42.82 0 1.44.38 1.8.8h.05v-.57H25zm-1.2 2.84c0-1.04-.7-1.8-1.58-1.8-.9 0-1.65.76-1.65 1.8 0 1.03.75 1.78 1.65 1.78.88 0 1.58-.75 1.58-1.78z" fill="#4285F4" transform="translate(2 2)"/>
      <path d="M27.5 1v9.7h-1.27V1H27.5z" fill="#34A853" transform="translate(2 2)"/>
      <path d="M32.6 9.07l1.01.67c-.33.48-1.1 1.11-2.44 1.11-1.67 0-2.91-1.28-2.91-2.96 0-1.76 1.25-2.96 2.77-2.96 1.53 0 2.28 1.22 2.52 1.88l.13.33-3.92 1.62c.3.59.77.89 1.42.89.65 0 1.1-.32 1.42-.58zm-3.07-1.05l2.62-1.09c-.14-.37-.57-.62-1.08-.62-.65 0-1.54.57-1.54 1.71z" fill="#EA4335" transform="translate(2 2)"/>
    </svg>
  );
}

export default function GolfConditions({ courseName = 'Graeagle' }: { courseName?: string }) {
  const [data, setData] = useState<ConditionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'now' | 'forecast' | 'details'>('now');

  useEffect(() => {
    fetch('/api/conditions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={S.wrap}>
      <div style={S.shimmerWrap}>
        <div style={S.shimmerLine} />
        <div style={{ ...S.shimmerLine, width: '60%', marginTop: 8 }} />
      </div>
    </div>
  );

  if (!data?.days?.length) return null;

  const today = data.days[0];
  const nowHours = today.hours.slice(0, 6);
  const pollen0 = data.pollen?.[0]?.types || {};
  const grass = pollen0['Grass'];
  const tree = pollen0['Tree'];
  const aq = data.air_quality;
  const score = data.golf_score;
  const updatedTime = new Date(data.updated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.locationLabel}>⛳ {courseName} · Live Conditions</span>
          <span style={S.updateTime}>Updated {updatedTime}</span>
        </div>
        <div style={S.headerRight}>
          <div style={{ ...S.scoreBadge, background: SCORE_COLOR(score) + '18', border: `1px solid ${SCORE_COLOR(score)}40`, color: SCORE_COLOR(score) }}>
            <span style={S.scoreNum}>{score}</span>
            <span style={S.scoreLabel}>{data.golf_conditions}</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={S.tabs}>
        {(['now', 'forecast', 'details'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}>
            {t === 'now' ? '🌡 Now' : t === 'forecast' ? '📅 5 Days' : '🌿 Details'}
          </button>
        ))}
      </div>

      {/* NOW */}
      {tab === 'now' && (
        <div style={S.panel}>
          <div style={S.mainRow}>
            <span style={S.bigIcon}>{conditionIcon(today.condition, true)}</span>
            <div style={{ flex: 1 }}>
              <div style={S.tempRange}>
                <span style={S.hiTemp}>{today.hi_f}°</span>
                <span style={S.loTemp}> / {today.lo_f}°F</span>
              </div>
              <div style={S.condLabel}>{today.condition}</div>
            </div>
            <div style={S.quickStats}>
              <div style={S.qs}><span style={S.qsL}>Wind</span><span style={S.qsV}>{today.wind_mph} mph</span></div>
              <div style={S.qs}><span style={S.qsL}>UV Max</span><span style={S.qsV}>{today.uv_max} · {UV_LABEL[today.uv_max] || 'Low'}</span></div>
              <div style={S.qs}><span style={S.qsL}>Cloud</span><span style={S.qsV}>{today.cloud_pct}%</span></div>
            </div>
          </div>

          {nowHours.length > 0 && (
            <div style={S.hourlyStrip}>
              {nowHours.map((h, i) => (
                <div key={i} style={{ ...S.hourCell, background: h.is_daytime ? '#f8f5f0' : '#ede8e0' }}>
                  <div style={S.hourTime}>{formatHour(h.hour)}</div>
                  <div style={S.hourEmoji}>{conditionIcon(h.condition, h.is_daytime)}</div>
                  <div style={S.hourTemp}>{h.temp_f}°</div>
                  <div style={S.hourWind}>{h.wind_mph}mph</div>
                </div>
              ))}
            </div>
          )}

          <div style={S.attribution}>
            <GoogleLogo />
            <span style={S.attrText}>Weather · Graeagle, CA · {updatedTime}</span>
          </div>
        </div>
      )}

      {/* 5-DAY FORECAST */}
      {tab === 'forecast' && (
        <div style={S.panel}>
          {data.days.slice(0, 5).map((day, i) => (
            <div key={day.date} style={{ ...S.forecastRow, ...(i === 0 ? S.forecastRowFirst : {}) }}>
              <div style={S.forecastDay}>{i === 0 ? 'Today' : formatDate(day.date)}</div>
              <span style={S.forecastIcon}>{conditionIcon(day.condition, true)}</span>
              <div style={S.forecastCond}>{day.condition}</div>
              <div style={S.forecastTemps}>
                <span style={S.forecastHi}>{day.hi_f}°</span>
                <span style={S.forecastLo}> / {day.lo_f}°</span>
              </div>
              <div style={S.forecastMeta}>💨 {day.wind_mph}mph · ☀️ UV {day.uv_max}</div>
            </div>
          ))}
          <div style={S.attribution}>
            <GoogleLogo />
            <span style={S.attrText}>Weather · Graeagle, CA 4,400 ft · Updated {updatedTime}</span>
          </div>
        </div>
      )}

      {/* DETAILS */}
      {tab === 'details' && (
        <div style={S.panel}>
          {aq && (
            <div style={S.detailBlock}>
              <div style={S.detailHeading}>🌬 Air Quality</div>
              <div style={S.aqRow}>
                <div style={{ ...S.aqBadge, background: AQI_COLOR(aq.aqi) + '20', border: `1px solid ${AQI_COLOR(aq.aqi)}50`, color: AQI_COLOR(aq.aqi) }}>
                  <span style={{ fontSize: 22, fontWeight: 700 }}>{aq.aqi}</span>
                  <span style={{ fontSize: 11 }}>AQI</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1208' }}>{aq.category}</div>
                  <div style={{ fontSize: 12, color: 'rgba(28,18,8,0.4)', marginTop: 2 }}>Dominant: {aq.pollutant?.toUpperCase()}</div>
                </div>
              </div>
            </div>
          )}

          <div style={S.detailBlock}>
            <div style={S.detailHeading}>🌸 Pollen Today</div>
            <div style={S.pollenRow}>
              {[['Tree', tree], ['Grass', grass]].map(([name, val]: any) => val && (
                <div key={name as string} style={{ ...S.pollenPill, background: (POLLEN_COLOR[val.category] || '#888') + '18', borderColor: (POLLEN_COLOR[val.category] || '#888') + '60' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: POLLEN_COLOR[val.category] || '#888', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1c1208' }}>{name as string}</span>
                  <span style={{ fontSize: 12, color: 'rgba(28,18,8,0.5)' }}>{val.category}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(28,18,8,0.3)', marginTop: 8 }}>
              Sierra Nevada: Tree pollen peaks May–June. Grass peaks June–July.
            </div>
          </div>

          <div style={S.golfTip}>
            <span style={{ fontSize: 16 }}>⛳</span>
            <div>
              <div style={{ fontWeight: 700, color: '#1c1208', fontSize: 13 }}>Golf Condition Score: {score}/100</div>
              <div style={{ fontSize: 12, color: 'rgba(28,18,8,0.5)', marginTop: 2 }}>
                {score >= 80 ? 'Excellent conditions — get out there.' : score >= 60 ? 'Good conditions for golf.' : score >= 40 ? 'Playable but suboptimal.' : 'Consider rescheduling.'}
              </div>
            </div>
          </div>

          <div style={S.attribution}>
            <GoogleLogo />
            <span style={S.attrText}>Weather · Air Quality · Pollen · Updated {updatedTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: '#fff',
    border: '1px solid rgba(28,18,8,0.1)',
    borderRadius: 14,
    overflow: 'hidden',
    fontSize: 14,
  },
  shimmerWrap: { padding: '20px 18px' },
  shimmerLine: {
    height: 14, width: '80%', borderRadius: 8,
    background: 'linear-gradient(90deg, #f5f0e8 25%, #ede8e0 50%, #f5f0e8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px 10px',
    borderBottom: '1px solid rgba(28,18,8,0.07)',
    background: '#f8f5f0',
  },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: 2 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  locationLabel: { fontSize: 12, fontWeight: 700, color: '#1c1208', letterSpacing: '0.01em' },
  updateTime: { fontSize: 11, color: 'rgba(28,18,8,0.35)' },
  scoreBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '5px 12px', borderRadius: 10,
  },
  scoreNum: { fontSize: 20, fontWeight: 800, lineHeight: 1 },
  scoreLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 1 },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(28,18,8,0.08)' },
  tab: {
    flex: 1, padding: '9px 6px', fontSize: 12, fontWeight: 600,
    border: 'none', background: 'none', cursor: 'pointer',
    color: 'rgba(28,18,8,0.4)', transition: 'color .2s',
  },
  tabActive: { color: '#1c1208', borderBottom: '2px solid #e8a850', marginBottom: -1 },
  panel: { padding: '14px 16px' },
  mainRow: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  bigIcon: { fontSize: 38, lineHeight: 1, flexShrink: 0 },
  tempRange: { lineHeight: 1.1 },
  hiTemp: { fontSize: 28, fontWeight: 800, color: '#1c1208' },
  loTemp: { fontSize: 16, fontWeight: 500, color: 'rgba(28,18,8,0.4)' },
  condLabel: { fontSize: 13, color: 'rgba(28,18,8,0.6)', marginTop: 4 },
  quickStats: { display: 'flex', flexDirection: 'column', gap: 3, marginLeft: 'auto', textAlign: 'right' },
  qs: { display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' },
  qsL: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(28,18,8,0.3)' },
  qsV: { fontSize: 12, fontWeight: 600, color: 'rgba(28,18,8,0.7)' },
  hourlyStrip: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 5, marginBottom: 12 },
  hourCell: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 2px', borderRadius: 8 },
  hourTime: { fontSize: 10, fontWeight: 600, color: 'rgba(28,18,8,0.4)' },
  hourEmoji: { fontSize: 18 },
  hourTemp: { fontSize: 13, fontWeight: 700, color: '#1c1208' },
  hourWind: { fontSize: 10, color: 'rgba(28,18,8,0.35)' },
  forecastRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 0', borderBottom: '1px solid rgba(28,18,8,0.06)',
    flexWrap: 'wrap',
  },
  forecastRowFirst: { paddingTop: 0 },
  forecastDay: { width: 70, fontSize: 13, fontWeight: 700, color: '#1c1208', flexShrink: 0 },
  forecastIcon: { fontSize: 22, flexShrink: 0 },
  forecastCond: { flex: 1, fontSize: 12, color: 'rgba(28,18,8,0.55)', minWidth: 80 },
  forecastTemps: { fontSize: 14, flexShrink: 0 },
  forecastHi: { fontWeight: 700, color: '#1c1208' },
  forecastLo: { color: 'rgba(28,18,8,0.4)' },
  forecastMeta: { width: '100%', fontSize: 11, color: 'rgba(28,18,8,0.3)', paddingLeft: 80 },
  detailBlock: { marginBottom: 18 },
  detailHeading: { fontSize: 12, fontWeight: 700, color: 'rgba(28,18,8,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  aqRow: { display: 'flex', alignItems: 'center', gap: 14 },
  aqBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 14px', borderRadius: 10, gap: 1 },
  pollenRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pollenPill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: '1px solid', borderRadius: 100, padding: '5px 12px',
  },
  golfTip: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '12px 14px', background: 'rgba(58,138,72,0.05)',
    border: '1px solid rgba(58,138,72,0.15)', borderRadius: 10,
    marginBottom: 14,
  },
  attribution: {
    display: 'flex', alignItems: 'center', gap: 6,
    paddingTop: 10,
    borderTop: '1px solid rgba(28,18,8,0.06)',
    marginTop: 4,
  },
  attrText: { fontSize: 11, color: 'rgba(28,18,8,0.3)' },
};
