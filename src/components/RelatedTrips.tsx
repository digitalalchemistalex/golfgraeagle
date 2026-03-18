"use client";
import { useState, useEffect } from "react";

/* ─── SLUG → NAME MAPS (Graeagle courses + lodging only) ─── */
const COURSE_NAMES: Record<string, string[]> = {
  "graeagle-meadows":  ["Graeagle Meadows", "Graeagle Meadows Golf Course"],
  "whitehawk-ranch":   ["Whitehawk Ranch", "Whitehawk Ranch Golf Course", "Whitehawk Ranch Golf Club"],
  "plumas-pines":      ["Plumas Pines", "Plumas Pines Golf Resort"],
  "grizzly-ranch":     ["Grizzly Ranch", "Grizzly Ranch Golf Club"],
  "nakoma-dragon":     ["The Dragon at Nakoma", "Nakoma", "Dragon", "Nakoma Dragon", "The Dragon"],
};

const LODGING_NAMES: Record<string, string[]> = {
  "river-pines-resort":        ["River Pines Resort", "River Pines"],
  "chalet-view-lodge":         ["Chalet View Lodge", "Chalet View"],
  "inn-at-nakoma":             ["The Inn at Nakoma", "Inn at Nakoma", "Nakoma Resort"],
  "townhomes-at-plumas-pines": ["Townhomes at Plumas Pines", "Plumas Pines Townhomes", "Plumas Pines Golf Resort (Townhomes)", "Townhomes at Plumas Pines Resort", "Private Homes and Townhomes at Plumas Pines"],
};

/* ─── PORTFOLIO URL MAPS ─── */
const COURSE_PORTFOLIO: Record<string, string> = {
  "graeagle-meadows":  "/portfolio/graeagle-meadows-golf-packages/",
  "whitehawk-ranch":   "/portfolio/whitehawk-ranch-golf-packages/",
  "plumas-pines":      "/portfolio/plumas-pines-golf-packages/",
  "grizzly-ranch":     "/portfolio/grizzly-ranch-golf-packages/",
  "nakoma-dragon":     "/portfolio/nakoma-dragon-golf-packages/",
};
const LODGING_PORTFOLIO: Record<string, string> = {
  "river-pines-resort":       "/portfolio/river-pines-resort-graeagle-ca/",
  "chalet-view-lodge":        "/portfolio/chalet-view-lodge-graeagle-ca/",
  "inn-at-nakoma":            "/portfolio/the-inn-at-nakoma-clio-ca/",
  "townhomes-at-plumas-pines":"/portfolio/the-townhomes-at-plumas-pines/",
};

const API_URL  = "/api/trips";
const CADDIE_URL = "https://tripscaddie.golfthehighsierra.com";

/* Build reverse lookup: name → portfolio URL */
function buildLookup(namesMap: Record<string, string[]>, urlMap: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [slug, names] of Object.entries(namesMap)) {
    for (const n of names) out[n.toLowerCase()] = urlMap[slug] || "";
  }
  return out;
}
const ALL_URLS = {
  ...buildLookup(COURSE_NAMES, COURSE_PORTFOLIO),
  ...buildLookup(LODGING_NAMES, LODGING_PORTFOLIO),
};
function findPortfolioUrl(name: string): string | null {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(ALL_URLS)) {
    if (n.includes(key) || key.includes(n)) return url || null;
  }
  return null;
}

/* ─── TYPES ─── */
interface DayItem { day?: number; date?: string; time?: string; activity?: string; location?: string; notes?: string; }
interface Trip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; whyItWorked?: string; highlights?: string[];
  dailyItinerary?: DayItem[]; region?: string; imageUrl?: string;
  month?: string; year?: number;
}

/* ─── HELPERS ─── */
const STOCK = [
  "/wp-images/unsplash-golf-fairway.jpg",
  "/wp-images/unsplash-golf-sunset.jpg",
  "/wp-images/unsplash-golf-course.jpg",
];
function pickImage(trip: Trip): string {
  const url = trip.imageUrl?.trim() || "";
  // Reject base64 data URIs — use stock fallback
  if (url && !url.startsWith("data:") && url.startsWith("http")) return url;
  const idx = (trip.id || trip.groupName || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return STOCK[idx % STOCK.length];
}
function matchesCourse(trip: Trip, names: string[]): boolean {
  if (!trip.courses?.length) return false;
  return trip.courses.some(c => names.some(n =>
    c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase())
  ));
}
function matchesLodging(trip: Trip, names: string[]): boolean {
  if (!trip.lodging) return false;
  const l = trip.lodging.toLowerCase();
  return names.some(n => l.includes(n.toLowerCase()) || n.toLowerCase().includes(l));
}

/* ─── TRIP CARD ─── */
function TripCard({ trip }: { trip: Trip }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const imgSrc = pickImage(trip);
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
  const nights = trip.nights && trip.nights > 0 ? trip.nights : ((trip.dailyItinerary?.length || 1) - 1);

  const quoteParams = new URLSearchParams({
    ref: "trips-caddie",
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
      borderRadius: 16,
      border: "1px solid rgba(28,18,8,0.08)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.3s",
    }}
    onMouseOver={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)")}
    onMouseOut={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)")}
    >
      {/* Image */}
      <div style={{ height: 160, background: "#1a1a1a", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {!imgLoaded && <div style={{ position: "absolute", inset: 0, background: "#2a2a2a" }} />}
        <img
          src={imgSrc} alt={trip.groupName || "Golf trip"} loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = STOCK[0]; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 0.88 : 0, transition: "opacity 0.6s" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,15,9,0.85) 0%, transparent 60%)" }} />
        {trip.vibe && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span style={{
              background: "rgba(232,168,80,0.92)", color: "#1c1208",
              fontSize: 9, fontWeight: 700, padding: "4px 10px",
              borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.08em",
            }}>{trip.vibe}</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, color: "#fff" }}>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
            {trip.groupName || "Golf Group Trip"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {trip.month} {trip.year}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "20px 20px 0" }}>
        {/* Stats — 2x2 grid works on all screen sizes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 18 }}>
          {[
            ["Pax", trip.groupSize || "—"],
            ["From", price ? `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}` : "—"],
            ["Nights", nights || "—"],
            ["Rounds", trip.rounds || trip.courses?.length || "—"],
          ].map(([label, val]) => (
            <div key={label as string} style={{
              background: label === "From" ? "rgba(28,168,80,0.05)" : "rgba(28,18,8,0.03)",
              border: `1px solid ${label === "From" ? "rgba(28,168,80,0.12)" : "rgba(28,18,8,0.06)"}`,
              borderRadius: 10, padding: "8px 4px", textAlign: "center",
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(28,18,8,0.35)", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: label === "From" ? "#1a7a40" : "#1c1208", lineHeight: 1 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Synopsis */}
        {trip.synopsis && (
          <p style={{ fontSize: 13, color: "rgba(28,18,8,0.55)", lineHeight: 1.65, borderLeft: "3px solid #e8a850", paddingLeft: 12, marginBottom: 16, fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            &ldquo;{trip.synopsis}&rdquo;
          </p>
        )}

        {/* Courses */}
        {trip.courses && trip.courses.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.3)", marginBottom: 8 }}>⛳ Courses Played</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {trip.courses.map((c, i) => {
                const url = findPortfolioUrl(c);
                return url ? (
                  <a key={i} href={url} style={{
                    background: "#fff", border: "1px solid rgba(28,18,8,0.1)",
                    borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600,
                    color: "rgba(28,18,8,0.7)", textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#e8a850"; e.currentTarget.style.color = "#b8780a"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(28,18,8,0.1)"; e.currentTarget.style.color = "rgba(28,18,8,0.7)"; }}
                  >{c}</a>
                ) : (
                  <span key={i} style={{ background: "rgba(28,18,8,0.04)", border: "1px solid rgba(28,18,8,0.06)", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "rgba(28,18,8,0.5)" }}>{c}</span>
                );
              })}
            </div>
          </div>
        )}

        {/* Lodging */}
        {trip.lodging && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.3)", marginBottom: 8 }}>🏨 Stayed</div>
            {(() => {
              const url = findPortfolioUrl(trip.lodging);
              return url ? (
                <a href={url} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "rgba(232,168,80,0.08)", border: "1px solid rgba(232,168,80,0.25)",
                  borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600,
                  color: "#8a5c00", textDecoration: "none",
                }}>{trip.lodging} →</a>
              ) : (
                <span style={{ background: "rgba(232,168,80,0.06)", border: "1px solid rgba(232,168,80,0.15)", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#8a5c00" }}>{trip.lodging}</span>
              );
            })()}
          </div>
        )}

        {/* Highlights */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(28,18,8,0.3)", marginBottom: 8 }}>⭐ Highlights</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {trip.highlights.slice(0, 3).map((h, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(28,18,8,0.6)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "#e8a850", flexShrink: 0, marginTop: 2 }}>✓</span>{h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Why It Worked */}
        {trip.whyItWorked && (
          <div style={{
            background: "rgba(232,168,80,0.05)", border: "1px solid rgba(232,168,80,0.15)",
            borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b8780a", marginBottom: 6 }}>💡 Pro Tip</div>
            <p style={{ fontSize: 12, color: "rgba(28,18,8,0.6)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>&ldquo;{trip.whyItWorked}&rdquo;</p>
          </div>
        )}

        {/* Itinerary toggle */}
        {trip.dailyItinerary && trip.dailyItinerary.length > 0 && (
          <button
            onClick={() => setShowItinerary(!showItinerary)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: "#e8a850", padding: "8px 0",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}
          >
            {showItinerary ? "▲ Hide Itinerary" : "▼ View Day-by-Day Itinerary"}
          </button>
        )}

        {/* Itinerary expanded */}
        {showItinerary && trip.dailyItinerary && (
          <div style={{ borderTop: "1px solid rgba(28,18,8,0.06)", paddingTop: 16, marginTop: 4, paddingBottom: 4 }}>
            {trip.dailyItinerary.map((day, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(232,168,80,0.12)", border: "2px solid #e8a850",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#b8780a",
                }}>{day.day || i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1208", marginBottom: 2 }}>
                    {day.activity}
                    {day.time && <span style={{ fontSize: 10, color: "#e8a850", marginLeft: 8, fontWeight: 700 }}>{day.time}</span>}
                  </div>
                  {day.location && <div style={{ fontSize: 11, color: "rgba(28,18,8,0.4)", marginBottom: 2 }}>{day.location}</div>}
                  {day.notes && <div style={{ fontSize: 11, color: "rgba(28,18,8,0.45)", fontStyle: "italic", borderLeft: "2px solid rgba(232,168,80,0.3)", paddingLeft: 8 }}>{day.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(28,18,8,0.06)", display: "flex", gap: 8, marginTop: 8 }}>
        <a
          href={`/request-a-quote/?${quoteParams}`}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#2d7a3a", color: "#fff", fontWeight: 700, fontSize: 12,
            padding: "12px 16px", borderRadius: 100, textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.05em",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "#245f2d"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#2d7a3a"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          🏌️ Get This Trip
        </a>
        <a
          href="tel:+18885861157"
          style={{
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff", border: "1px solid rgba(28,18,8,0.1)", borderRadius: 100,
            fontSize: 16, textDecoration: "none", flexShrink: 0,
            transition: "border-color 0.2s",
          }}
          title="Call to book"
          onMouseOver={e => { e.currentTarget.style.borderColor = "#e8a850"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(28,18,8,0.1)"; }}
        >📞</a>
      </div>
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function RelatedTrips({ slug, type, showAll = false, max = 6 }: { slug: string; type: "course" | "lodging" | "dining"; showAll?: boolean; max?: number }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        let filtered: Trip[];
        if (showAll || type === "dining") {
          // Blog post mode + dining — show top trips from any Graeagle venue
          filtered = data
            .filter(t => (t.region || "").toLowerCase().includes("graeagle") || 
                        (t.courses || []).some(c => 
                          Object.values(COURSE_NAMES).flat().some(n => 
                            c.toLowerCase().includes(n.toLowerCase().split(" ")[0])
                          )
                        ))
            .sort((a, b) => {
              const aScore = (a.vibe?.toLowerCase() === "premium" ? 1000 : 0) + (a.groupSize || 0);
              const bScore = (b.vibe?.toLowerCase() === "premium" ? 1000 : 0) + (b.groupSize || 0);
              return bScore - aScore;
            })
            .slice(0, max);
        } else {
          const namesMap = type === "course" ? COURSE_NAMES : LODGING_NAMES;
          const names = namesMap[slug];
          if (!names) { setLoading(false); return; }
          filtered = data.filter(t =>
            type === "course" ? matchesCourse(t, names) : matchesLodging(t, names)
          ).slice(0, max);
        }
        setTrips(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, type, showAll, max]);

  if (loading || trips.length === 0) return null;

  const isCarousel = trips.length > 3;

  return (
    <section style={{ padding: "64px 0", background: "var(--page-bg, #f0ece3)", overflow: "hidden" }}>
      {/* Header — always constrained */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5%,60px)", marginBottom: 40 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#e8a850", marginBottom: 10 }}>
            {showAll || type === "dining" ? "Real Graeagle Golf Trips" : `Real Trips Featuring This ${type === "course" ? "Course" : "Property"}`}
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,38px)",
            fontWeight: 500, color: "#1c1208", margin: "0 0 12px", lineHeight: 1.2,
          }}>
            {trips.length} Group{trips.length !== 1 ? "s" : ""} <em style={{ fontStyle: "italic", color: "rgba(28,18,8,0.4)" }}>Played Here</em>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(28,18,8,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
            Real itineraries from past groups — courses played, where they stayed, day-by-day logistics, and pricing. Use any trip as a starting point for yours.
          </p>
        </div>
      </div>

      {/* Grid (≤3) or Carousel (>3) */}
      {isCarousel ? (
        /* Carousel: full-width, scrolls edge-to-edge, no parent padding clipping it */
        <div style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingLeft: "clamp(20px,5%,60px)",
          paddingRight: "clamp(20px,5%,60px)",
          paddingBottom: 12,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxSizing: "border-box",
          width: "100%",
        }}
          className="rt-carousel"
        >
          {trips.map((trip, i) => (
            <div key={trip.id || i} style={{
              flex: "0 0 300px",
              maxWidth: 340,
              scrollSnapAlign: "start",
              minWidth: 0,
            }}>
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        /* Grid: constrained, responsive columns via CSS class */
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5%,60px)" }}>
          <div className="rt-grid" style={{ display: "grid", gap: 20 }}>
            {trips.map((trip, i) => (
              <TripCard key={trip.id || i} trip={trip} />
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA — always constrained */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5%,60px)" }}>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href={CADDIE_URL} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#1c1208", color: "#e8a850", fontWeight: 700,
              fontSize: 13, padding: "14px 28px", borderRadius: 100,
              textDecoration: "none", transition: "background 0.2s",
              letterSpacing: "0.04em",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#2d7a3a"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#1c1208"; e.currentTarget.style.color = "#e8a850"; }}
          >
            🏌️ Browse All Trips in Trips Caddie →
          </a>
          <p style={{ fontSize: 11, color: "rgba(28,18,8,0.35)", marginTop: 10 }}>
            Pick any trip · customize it · free quote within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
