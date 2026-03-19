import { useState, useEffect, useRef } from 'react';

interface Hit {
  objectID: string;
  name: string;
  url: string;
  type: 'course' | 'lodging' | 'dining' | 'page';
  hero?: string;
  description?: string;
  accolade?: string;
  cuisine?: string;
}

const TYPE_LABEL: Record<string, string> = {
  course: '⛳ Course',
  lodging: '🏨 Lodging',
  dining: '🍴 Dining',
  page: '📄 Page',
};
const TYPE_COLOR: Record<string, string> = {
  course: '#1a7a40',
  lodging: '#2563eb',
  dining: '#e8a850',
  page: 'rgba(28,18,8,0.4)',
};

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Keyboard shortcut: / or Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !open) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); setHits([]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery(''); setHits([]);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const search = async (q: string) => {
    if (q.length < 2) { setHits([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(data.hits || []);
      setActive(-1);
    } catch { setHits([]); }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 220);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    if (e.key === 'Enter' && active >= 0 && hits[active]) {
      window.location.href = hits[active].url;
    }
  };

  const close = () => { setOpen(false); setQuery(''); setHits([]); setActive(-1); };

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Search courses, lodging, dining"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
          transition: 'all 0.2s',
        }}
        onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
        onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ display: 'none', whiteSpace: 'nowrap' }} className="search-label">Search</span>
        <kbd style={{ fontSize: 10, opacity: 0.5, background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: 4, fontFamily: 'inherit' }}>/</kbd>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 'min(420px, 92vw)', background: '#fff',
          borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          border: '1px solid rgba(28,18,8,0.08)', zIndex: 9999, overflow: 'hidden',
        }}>
          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(28,18,8,0.07)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(28,18,8,0.35)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="Search courses, lodging, dining…"
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 15,
                color: '#1c1208', background: 'transparent',
              }}
            />
            {loading && (
              <div style={{ width: 14, height: 14, border: '2px solid #e8a850', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            )}
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(28,18,8,0.35)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
          </div>

          {/* Results */}
          {hits.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', maxHeight: 360, overflowY: 'auto' }}>
              {hits.map((h, i) => (
                <li key={h.objectID}>
                  <a
                    href={h.url}
                    onClick={close}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                      textDecoration: 'none', background: active === i ? 'rgba(232,168,80,0.07)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(-1)}
                  >
                    {h.hero && (
                      <img
                        src={h.hero} alt={h.name} loading="lazy"
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#f0ece3' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1208', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: TYPE_COLOR[h.type] || '#888' }}>
                          {TYPE_LABEL[h.type] || h.type}
                        </span>
                        {h.accolade && (
                          <span style={{ fontSize: 10, color: 'rgba(28,18,8,0.35)' }}>· {h.accolade}</span>
                        )}
                        {h.cuisine && (
                          <span style={{ fontSize: 10, color: 'rgba(28,18,8,0.35)' }}>· {h.cuisine}</span>
                        )}
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(28,18,8,0.2)" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Empty state */}
          {!loading && query.length >= 2 && hits.length === 0 && (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(28,18,8,0.4)', fontSize: 14 }}>
              No results for &ldquo;{query}&rdquo;
              <div style={{ marginTop: 8, fontSize: 13 }}>
                <a href="/all-golf-courses/" style={{ color: '#e8a850', textDecoration: 'none', fontWeight: 600 }}>Browse all courses →</a>
              </div>
            </div>
          )}

          {/* Quick links when no query */}
          {!query && (
            <div style={{ padding: '12px 16px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(28,18,8,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Quick links</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  ['⛳ All Courses', '/all-golf-courses/'],
                  ['🏨 Lodging', '/lodging/'],
                  ['🍴 Dining', '/dining/'],
                  ['📦 Packages', '/golf-packages/'],
                  ['💬 Quote', '/request-a-quote/'],
                ].map(([label, href]) => (
                  <a key={href} href={href} onClick={close} style={{
                    fontSize: 12, fontWeight: 600, color: '#1c1208', textDecoration: 'none',
                    padding: '5px 12px', background: 'rgba(28,18,8,0.04)',
                    border: '1px solid rgba(28,18,8,0.07)', borderRadius: 100,
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { (e.target as HTMLElement).style.borderColor = '#e8a850'; }}
                  onMouseOut={e => { (e.target as HTMLElement).style.borderColor = 'rgba(28,18,8,0.07)'; }}
                  >{label}</a>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(28,18,8,0.06)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'rgba(28,18,8,0.3)' }}>↑↓ navigate · Enter select · Esc close</span>
            <span style={{ fontSize: 10, color: 'rgba(28,18,8,0.25)' }}>Search by Algolia</span>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media(min-width:640px){ .search-label { display: inline !important; } }`}</style>
    </div>
  );
}
