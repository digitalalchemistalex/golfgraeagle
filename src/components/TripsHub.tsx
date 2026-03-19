"use client";
import { useState, useEffect } from "react";

const API_URL = "/api/trips";
const CADDIE_URL = "https://tripscaddie.golfthehighsierra.com";

// Real course hero images — no external/unsplash dependencies
const STOCK = [
  "/wp-images/grizzly-ranch-hero.webp",
  "/wp-images/whitehawk-hero.webp",
  "/wp-images/graeagle-meadows-hero.webp",
  "/wp-images/plumas-pines-hero.webp",
];
const COURSE_HERO_MAP: Record<string, string> = {
  "Grizzly Ranch":     "/wp-images/grizzly-ranch-hero.webp",
  "Whitehawk":         "/wp-images/whitehawk-hero.webp",
  "Plumas Pines":      "/wp-images/plumas-pines-hero.webp",
  "Nakoma":            "/wp-images/nakoma-dragon-feather-river.webp",
  "Graeagle Meadows":  "/wp-images/graeagle-meadows-hero.webp",
  "Old Greenwood":     "/wp-images/grizzly-ranch-img0666.webp",
  "Gray's Crossing":   "/wp-images/grizzly-ranch--1024x682.webp",
  "Edgewood":          "/wp-images/graeagle-meadows-aerial.jpg",
};

// Portfolio URL map — Graeagle courses + lodging
const PORTFOLIO_URLS: Record<string, string> = {
  "grizzly ranch": "/portfolio/grizzly-ranch-golf-packages/",
  "grizzly ranch golf club": "/portfolio/grizzly-ranch-golf-packages/",
  "whitehawk ranch": "/portfolio/whitehawk-ranch-golf-packages/",
  "whitehawk ranch golf club": "/portfolio/whitehawk-ranch-golf-packages/",
  "whitehawk ranch golf course": "/portfolio/whitehawk-ranch-golf-packages/",
  "plumas pines": "/portfolio/plumas-pines-golf-packages/",
  "plumas pines golf resort": "/portfolio/plumas-pines-golf-packages/",
  "graeagle meadows": "/portfolio/graeagle-meadows-golf-packages/",
  "graeagle meadows golf course": "/portfolio/graeagle-meadows-golf-packages/",
  "the dragon": "/portfolio/nakoma-dragon-golf-packages/",
  "nakoma": "/portfolio/nakoma-dragon-golf-packages/",
  "dragon": "/portfolio/nakoma-dragon-golf-packages/",
  "river pines": "/portfolio/river-pines-resort-graeagle-ca/",
  "river pines resort": "/portfolio/river-pines-resort-graeagle-ca/",
  "chalet view": "/portfolio/chalet-view-lodge-graeagle-ca/",
  "chalet view lodge": "/portfolio/chalet-view-lodge-graeagle-ca/",
  "inn at nakoma": "/portfolio/the-inn-at-nakoma-clio-ca/",
  "townhomes at plumas pines": "/portfolio/the-townhomes-at-plumas-pines/",
};

function findUrl(name: string): string | null {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(PORTFOLIO_URLS)) {
    if (n.includes(key) || key.includes(n)) return url;
  }
  return null;
}

interface DayItem { day?: number; date?: string; time?: string; activity?: string; location?: string; notes?: string; }
interface Trip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; whyItWorked?: string; highlights?: string[];
  dailyItinerary?: DayItem[]; region?: string; imageUrl?: string; month?: string; year?: number;
}

function pickImage(trip: Trip, idx: number): string {
  const url = trip.imageUrl?.trim() || "";
  if (url && !url.startsWith("data:") && url.startsWith("http")) return url;
  // Pick by first matching course name for relevance
  const courses = trip.courses || [];
  for (const [key, hero] of Object.entries(COURSE_HERO_MAP)) {
    if (courses.some((c: string) => c.includes(key))) return hero;
  }
  const hash = (trip.id || trip.groupName || "").split("").reduce((a, c) => a + c.charCodeAt(0), idx);
  return STOCK[hash % STOCK.length];
}

const VIBE_COLORS: Record<string, { bg: string; color: string }> = {
  "budget":        { bg: "rgba(59,130,246,0.12)",  color: "#1d4ed8" },
  "value":         { bg: "rgba(16,185,129,0.12)",  color: "#065f46" },
  "premium":       { bg: "rgba(232,168,80,0.15)",  color: "#92400e" },
  "bucket list":   { bg: "rgba(139,92,246,0.12)",  color: "#4c1d95" },
  "bachelor party":{ bg: "rgba(244,63,94,0.12)",   color: "#9f1239" },
  "corporate":     { bg: "rgba(71,85,105,0.12)",   color: "#1e293b" },
};

type Filter = "all" | "value" | "standard" | "premium";

function TripCard({ trip, idx }: { trip: Trip; idx: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const imgSrc = pickImage(trip, idx);
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
  const nights = trip.nights && trip.nights > 0 ? trip.nights : ((trip.dailyItinerary?.length || 1) - 1);
  const vibeStyle = VIBE_COLORS[(trip.vibe || "").toLowerCase()] || { bg: "rgba(232,168,80,0.1)", color: "#92400e" };

  const quoteParams = new URLSearchParams({
    ref: "trips-page",
    trip: trip.groupName || "",
    ...(trip.groupSize ? { partySize: String(trip.groupSize) } : {}),
    ...(price ? { budget: String(price) } : {}),
    ...(trip.nights && trip.nights > 0 ? { nights: String(trip.nights) } : {}),
    ...(trip.rounds ? { rounds: String(trip.rounds) } : {}),
    ...(trip.lodging ? { lodging: trip.lodging } : {}),
    ...(trip.vibe ? { vibe: trip.vibe } : {}),
    ...(trip.courses?.length ? { courses: trip.courses.join(",") } : {}),
  }).toString();

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      border: "1px solid rgba(28,18,8,0.07)",
      boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.3s, transform 0.2s",
    }}
    id={trip.id ? `trip-${trip.id}` : undefined}
    onMouseOver={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseOut={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ height: 200, background: "#1a1a1a", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {!imgLoaded && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a2e1a 0%, #0d1a0e 100%)" }} />}
        <img
          src={imgSrc} alt={trip.groupName || "Graeagle Golf Trip"} loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={e => { (e.target as HTMLImageElement).src = STOCK[0]; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 0.85 : 0, transition: "opacity 0.6s, transform 6s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,15,9,0.9) 0%, rgba(9,15,9,0.4) 50%, transparent 100%)" }} />

        {/* Vibe + Price badges */}
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {trip.vibe && (
            <span style={{
              background: vibeStyle.bg, color: vibeStyle.color,
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              fontSize: 9, fontWeight: 700, padding: "5px 11px",
              borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.09em",
              border: `1px solid ${vibeStyle.color}22`,
            }}>{trip.vibe}</span>
          )}
          {price && (
            <div style={{
              background: "rgba(9,15,9,0.75)", backdropFilter: "blur(8px)",
              borderRadius: 10, padding: "6px 12px", textAlign: "center",
              border: "1px solid rgba(232,168,80,0.2)",
            }}>
              <div style={{ fontSize: 9, color: "rgba(232,168,80,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>from</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>
                ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>per person</div>
            </div>
          )}
        </div>

        {/* Group name overlay */}
        <div style={{ position: "absolute", bottom: 16, left: 18, right: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", lineHeight: 1.25, marginBottom: 5, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            {trip.groupName || "Graeagle Golf Group"}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "rgba(232,168,80,0.85)", fontWeight: 600 }}>📅 {trip.month} {trip.year}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>👥 {trip.groupSize} golfers</span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid rgba(28,18,8,0.06)" }}>
        {[
          ["🌙 Nights", nights || "—"],
          ["⛳ Rounds", trip.rounds || trip.courses?.length || "—"],
          ["👥 Group", `${trip.groupSize || "—"} pax`],
        ].map(([label, val]) => (
          <div key={label as string} style={{ padding: "12px 8px", textAlign: "center", borderRight: "1px solid rgba(28,18,8,0.05)" }}>
            <div style={{ fontSize: 10, color: "rgba(28,18,8,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1208" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "20px 22px 0" }}>

        {/* Synopsis */}
        {trip.synopsis && (
          <p style={{ fontSize: 13, color: "rgba(28,18,8,0.6)", lineHeight: 1.7, borderLeft: "3px solid #e8a850", paddingLeft: 12, marginBottom: 18, fontStyle: "italic" }}>
            &ldquo;{trip.synopsis}&rdquo;
          </p>
        )}

        {/* Courses */}
        {trip.courses && trip.courses.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.28)", marginBottom: 8 }}>⛳ Courses Played</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {trip.courses.map((c, i) => {
                const url = findUrl(c);
                return url ? (
                  <a key={i} href={url}
                    style={{ background: "rgba(28,18,8,0.03)", border: "1px solid rgba(28,18,8,0.09)", borderRadius: 8, padding: "5px 11px", fontSize: 11, fontWeight: 600, color: "rgba(28,18,8,0.65)", textDecoration: "none", transition: "all 0.15s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#e8a850"; e.currentTarget.style.color = "#b8780a"; e.currentTarget.style.background = "rgba(232,168,80,0.06)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(28,18,8,0.09)"; e.currentTarget.style.color = "rgba(28,18,8,0.65)"; e.currentTarget.style.background = "rgba(28,18,8,0.03)"; }}
                  >{c}</a>
                ) : (
                  <span key={i} style={{ background: "rgba(28,18,8,0.02)", border: "1px solid rgba(28,18,8,0.06)", borderRadius: 8, padding: "5px 11px", fontSize: 11, color: "rgba(28,18,8,0.45)" }}>{c}</span>
                );
              })}
            </div>
          </div>
        )}

        {/* Lodging */}
        {trip.lodging && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.28)", marginBottom: 8 }}>🏨 Lodging</div>
            {(() => {
              const url = findUrl(trip.lodging);
              return url ? (
                <a href={url} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(232,168,80,0.07)", border: "1px solid rgba(232,168,80,0.2)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#8a5c00", textDecoration: "none" }}>
                  {trip.lodging} →
                </a>
              ) : (
                <span style={{ background: "rgba(232,168,80,0.05)", border: "1px solid rgba(232,168,80,0.15)", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#8a5c00", display: "inline-block" }}>{trip.lodging}</span>
              );
            })()}
          </div>
        )}

        {/* Highlights */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.28)", marginBottom: 8 }}>⭐ What's Included</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {trip.highlights.slice(0, 4).map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#2d7a3a", flexShrink: 0, fontWeight: 700, fontSize: 12, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: "rgba(28,18,8,0.6)", lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why it worked */}
        {trip.whyItWorked && (
          <div style={{ background: "rgba(45,122,58,0.04)", border: "1px solid rgba(45,122,58,0.12)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2d7a3a", marginBottom: 5 }}>💡 Pro Tip</div>
            <p style={{ fontSize: 12, color: "rgba(28,18,8,0.6)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>&ldquo;{trip.whyItWorked}&rdquo;</p>
          </div>
        )}

        {/* Itinerary toggle */}
        {trip.dailyItinerary && trip.dailyItinerary.length > 0 && (
          <button
            onClick={() => setShowItinerary(!showItinerary)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "rgba(28,18,8,0.35)", padding: "8px 0", textTransform: "uppercase", letterSpacing: "0.08em", transition: "color 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.color = "#e8a850"; }}
            onMouseOut={e => { e.currentTarget.style.color = "rgba(28,18,8,0.35)"; }}
          >
            {showItinerary ? "▲ Hide Day-by-Day" : "▼ View Day-by-Day Itinerary"}
          </button>
        )}

        {/* Itinerary expanded */}
        {showItinerary && trip.dailyItinerary && (
          <div style={{ borderTop: "1px solid rgba(28,18,8,0.06)", paddingTop: 16, marginTop: 4 }}>
            {trip.dailyItinerary.map((day, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "rgba(45,122,58,0.08)", border: "2px solid rgba(45,122,58,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#2d7a3a" }}>
                  {day.day || i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1208", marginBottom: 2 }}>
                    {day.activity}
                    {day.time && day.time !== "N/A" && <span style={{ fontSize: 10, color: "#e8a850", marginLeft: 8, fontWeight: 700 }}>{day.time}</span>}
                  </div>
                  {day.location && <div style={{ fontSize: 11, color: "rgba(28,18,8,0.38)", marginBottom: 2 }}>📍 {day.location}</div>}
                  {day.notes && <div style={{ fontSize: 11, color: "rgba(28,18,8,0.45)", fontStyle: "italic", borderLeft: "2px solid rgba(232,168,80,0.3)", paddingLeft: 8, marginTop: 4 }}>{day.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div style={{ padding: "16px 22px 20px", display: "flex", gap: 8, marginTop: 12 }}>
        <a
          href={`/request-a-quote/?${quoteParams}`}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#2d7a3a", color: "#fff", fontWeight: 700, fontSize: 12, padding: "13px 16px", borderRadius: 100, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em", transition: "background 0.2s" }}
          onMouseOver={e => { e.currentTarget.style.background = "#245f2d"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#2d7a3a"; }}
        >
          🏌️ Get This Trip
        </a>
        <a
          href="tel:+18885861157"
          style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid rgba(28,18,8,0.1)", borderRadius: 100, fontSize: 17, textDecoration: "none", flexShrink: 0, transition: "border-color 0.2s" }}
          title="Call +1-888-586-1157"
          onMouseOver={e => { e.currentTarget.style.borderColor = "#e8a850"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(28,18,8,0.1)"; }}
        >📞</a>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function TripsHub() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<"price" | "nights">("price");

  // Read highlight param once at mount — stable ref, no re-renders
  const highlightId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("highlight")
    : null;

  useEffect(() => {
    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        const GRAEAGLE_COURSES = ["grizzly", "nakoma", "whitehawk", "plumas pines", "graeagle meadows", "graeagle"];
        const graeagle = data.filter(t => {
          if ((t.region || "").toLowerCase().includes("graeagle")) return true;
          const courses = (t.courses || []).join(" ").toLowerCase();
          return GRAEAGLE_COURSES.some(k => courses.includes(k));
        });
        graeagle.sort((a, b) => (a.pricePerPerson || 9999) - (b.pricePerPerson || 9999));
        // If a highlight trip exists, ensure filter=all so it's visible
        if (highlightId) setFilter("all");
        setAllTrips(graeagle);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Scroll+highlight: use MutationObserver — fires the instant the target card
  // enters the DOM, no polling, no arbitrary timeouts
  useEffect(() => {
    if (!highlightId || !allTrips.length) return;
    const targetId = `trip-${highlightId}`;

    const doHighlight = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.transition = "box-shadow 0.4s, outline 0.4s";
      el.style.outline = "2px solid #e8a850";
      el.style.boxShadow = "0 0 0 4px rgba(232,168,80,0.25)";
      setTimeout(() => {
        el.style.outline = "";
        el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
      }, 2500);
    };

    // Already rendered (fast connection / cached)
    const existing = document.getElementById(targetId);
    if (existing) { doHighlight(existing); return; }

    // Watch for it to appear — disconnect immediately after first match
    const observer = new MutationObserver(() => {
      const el = document.getElementById(targetId);
      if (el) { observer.disconnect(); doHighlight(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [allTrips]);

  const filtered = allTrips.filter(t => {
    const price = t.pricePerPerson || t.pricePerPersonEstimate || 0;
    if (filter === "value")    return price < 750;
    if (filter === "standard") return price >= 750 && price < 1000;
    if (filter === "premium")  return price >= 1000;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price") return (a.pricePerPerson || 9999) - (b.pricePerPerson || 9999);
    return (b.nights || 0) - (a.nights || 0);
  });

  if (loading) return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5%,60px) 80px" }}>
      <div style={{ display: "grid", gap: 20 }} className="rt-grid">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(28,18,8,0.07)" }}>
            <div style={{ height: 200, background: "linear-gradient(90deg,#ede8e0 25%,#f5f1eb 50%,#ede8e0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s ease infinite" }} />
            <div style={{ padding: 20 }}>
              <div style={{ height: 12, width: "60%", background: "#ede8e0", borderRadius: 6, marginBottom: 16 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[1,2,3,4].map(j => <div key={j} style={{ height: 48, background: "#f5f1eb", borderRadius: 8 }} />)}
              </div>
              <div style={{ height: 10, background: "#ede8e0", borderRadius: 6, marginBottom: 8 }} />
              <div style={{ height: 10, width: "80%", background: "#ede8e0", borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (allTrips.length === 0) return null;

  const prices = allTrips.map(t => t.pricePerPerson || 0).filter(Boolean);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: "all",      label: `All Trips`,      count: allTrips.length },
    { key: "value",    label: `Under $750`,     count: allTrips.filter(t => (t.pricePerPerson || 0) < 750).length },
    { key: "standard", label: `$750–$1,000`,    count: allTrips.filter(t => { const p = t.pricePerPerson || 0; return p >= 750 && p < 1000; }).length },
    { key: "premium",  label: `$1,000+`,        count: allTrips.filter(t => (t.pricePerPerson || 0) >= 1000).length },
  ];

  return (
    <div style={{ background: "#f7f3ec", padding: "56px 0 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5%,60px)" }}>

        {/* Filter + sort bar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? "#1c1208" : "#ffffff",
                  color: filter === f.key ? "#e8a850" : "rgba(28,18,8,0.5)",
                  border: `1px solid ${filter === f.key ? "#1c1208" : "rgba(28,18,8,0.1)"}`,
                  borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}
              >
                {f.label} <span style={{ opacity: 0.5, marginLeft: 4 }}>({f.count})</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(28,18,8,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Sort:</span>
            {[["price","Price ↑"],["nights","Nights ↓"]].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val as "price" | "nights")}
                style={{ background: sortBy === val ? "rgba(232,168,80,0.12)" : "none", border: `1px solid ${sortBy === val ? "rgba(232,168,80,0.3)" : "rgba(28,18,8,0.08)"}`, color: sortBy === val ? "#8a5c00" : "rgba(28,18,8,0.4)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        <div style={{ fontSize: 12, color: "rgba(28,18,8,0.3)", marginBottom: 24, fontWeight: 500 }}>
          {filtered.length} trip{filtered.length !== 1 ? "s" : ""} found
          {filter === "all" && prices.length > 0 && ` · $${minPrice}–$${maxPrice}/person`}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
            gap: 24,
          }}>
            {filtered.map((trip, i) => (
              <TripCard key={trip.id || i} trip={trip} idx={i} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(28,18,8,0.35)", fontSize: 14 }}>
            No trips in this price range yet. <a href="/request-a-quote/?ref=trips-empty" style={{ color: "#e8a850" }}>Request a custom quote →</a>
          </div>
        )}

        {/* Browse all in Caddie */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href={CADDIE_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1c1208", color: "#e8a850", fontWeight: 700, fontSize: 13, padding: "14px 28px", borderRadius: 100, textDecoration: "none", letterSpacing: "0.04em", transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.background = "#2d7a3a"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#1c1208"; e.currentTarget.style.color = "#e8a850"; }}
          >🏌️ Browse Full Trip Archive in TripsCaddie →</a>
          <p style={{ fontSize: 11, color: "rgba(28,18,8,0.3)", marginTop: 10 }}>All 76 trips across Reno · Tahoe · Graeagle · Monterey · International</p>
        </div>
      </div>
    </div>
  );
}
