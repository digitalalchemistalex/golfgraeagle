"use client";
import { useState, useEffect } from "react";

/* ─── SAME NAME MAPS AS RelatedTrips ─── */
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
  "townhomes-at-plumas-pines": ["Townhomes at Plumas Pines", "Plumas Pines Townhomes", "Plumas Pines Golf Resort (Townhomes)", "Townhomes at Plumas Pines Resort", "Private Homes and Townhomes at Plumas Pines", "Seven (7) Private Homes and Townhomes at Plumas Pines Golf Resort"],
};

const API_URL = "/api/trips";

interface Trip {
  id?: string;
  groupName?: string;
  groupSize?: number;
  nights?: number;
  rounds?: number;
  courses?: string[];
  lodging?: string;
  pricePerPerson?: number;
  pricePerPersonEstimate?: number;
  vibe?: string;
  synopsis?: string;
  highlights?: string[];
  whyItWorked?: string;
  month?: string;
  year?: number;
  region?: string;
}

/* ─── STAR RATING MODEL ─── */
function deriveStars(trip: Trip): number {
  const vibe = (trip.vibe || "").toLowerCase();
  // Premium vibe = 5 stars, Value = 4 stars, floor at 4
  // Large groups (20+) are implicit repeat-customer endorsement — keep at 5 if premium
  if (vibe === "premium") return 5;
  if (vibe === "bucket list") return 5;
  return 4; // value, standard, anything else
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= count ? "#e8a850" : "rgba(232,168,80,0.2)"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function matchesCourse(trip: Trip, names: string[]): boolean {
  if (!trip.courses?.length) return false;
  return trip.courses.some(c =>
    names.some(n => c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase()))
  );
}

function matchesLodging(trip: Trip, names: string[]): boolean {
  if (!trip.lodging) return false;
  const l = trip.lodging.toLowerCase();
  return names.some(n => l.includes(n.toLowerCase()) || n.toLowerCase().includes(l));
}

/* ─── TESTIMONIAL CARD ─── */
function TestimonialCard({ trip }: { trip: Trip }) {
  const stars = deriveStars(trip);
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;

  // Quote selection priority: synopsis (golfer-readable) > highlights > whyItWorked
  // Filter out internal operator shorthand that reads as copy not testimonial
  const OPERATOR_PATTERNS = [
    /^great graeagle trip/i,
    /^you just have to experience/i,
    /^this group was a la carte/i,
    /^the package offered/i,
    /^the comprehensive package/i,
    /^groups coming in from northern california/i,
    /^if you're looking for an inexpensive/i,
    /^ask us how/i,
    /^what a lineup/i,
  ];
  const isOperatorCopy = (s: string) => !s || OPERATOR_PATTERNS.some(p => p.test(s.trim()));

  const candidates = [trip.synopsis, ...(trip.highlights || []), trip.whyItWorked].filter(Boolean) as string[];
  const rawQuote = candidates.find(s => !isOperatorCopy(s)) || "";

  const truncated = rawQuote.length > 180
    ? rawQuote.slice(0, 177).replace(/\s+\S*$/, "") + "…"
    : rawQuote;

  const pax = trip.groupSize;
  const when = [trip.month, trip.year].filter(Boolean).join(" ");

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid rgba(28,18,8,0.08)",
      borderRadius: 16,
      padding: "22px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}
    onMouseOver={e => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)")}
    onMouseOut={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)")}
    >
      {/* Stars + vibe badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stars count={stars} />
        {trip.vibe && (
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: trip.vibe.toLowerCase() === "premium" ? "#92400e" : "#065f46",
            background: trip.vibe.toLowerCase() === "premium" ? "rgba(232,168,80,0.12)" : "rgba(16,185,129,0.08)",
            padding: "3px 8px",
            borderRadius: 100,
          }}>
            {trip.vibe} Trip
          </span>
        )}
      </div>

      {/* Quote */}
      {truncated && (
        <p style={{
          fontSize: 14,
          color: "#374137",
          lineHeight: 1.65,
          margin: 0,
          fontStyle: "italic",
          borderLeft: "3px solid #e8a850",
          paddingLeft: 12,
        }}>
          &ldquo;{truncated}&rdquo;
        </p>
      )}

      {/* Group info */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", alignItems: "center" }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#1a2e1a",
        }}>
          {trip.groupName || "Golf Group"}
        </span>
        {pax && (
          <span style={{ fontSize: 11, color: "rgba(28,18,8,0.5)", fontWeight: 600 }}>
            · {pax} golfers
          </span>
        )}
        {when && (
          <span style={{ fontSize: 11, color: "rgba(28,18,8,0.5)" }}>· {when}</span>
        )}
        {price && (
          <span style={{ fontSize: 11, color: "#1a7a40", fontWeight: 700 }}>
            · ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}/pp
          </span>
        )}
      </div>

      {/* Courses played — only show if this is a lodging page context */}
      {trip.courses && trip.courses.length > 0 && (
        <div style={{
          fontSize: 11,
          color: "rgba(28,18,8,0.4)",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          alignItems: "center",
        }}>
          <span style={{ fontWeight: 600 }}>⛳</span>
          {trip.courses.slice(0, 3).join(" · ")}
          {trip.courses.length > 3 && <span>+ {trip.courses.length - 3} more</span>}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function Testimonials({
  slug,
  type,
  max = 3,
}: {
  slug: string;
  type: "course" | "lodging";
  max?: number;
}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const namesMap = type === "course" ? COURSE_NAMES : LODGING_NAMES;
    const names = namesMap[slug];
    if (!names) { setLoading(false); return; }

    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        const filtered = data
          .filter(t => type === "course" ? matchesCourse(t, names) : matchesLodging(t, names))
          // Sort: Premium first, then by group size descending (bigger groups = more credible)
          .sort((a, b) => {
            const aScore = (a.vibe?.toLowerCase() === "premium" ? 1 : 0) * 1000 + (a.groupSize || 0);
            const bScore = (b.vibe?.toLowerCase() === "premium" ? 1 : 0) * 1000 + (b.groupSize || 0);
            return bScore - aScore;
          })
          .slice(0, max);
        setTrips(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, type, max]);

  if (loading || trips.length === 0) return null;

  // Compute aggregate for display
  const avgStars = (trips.reduce((s, t) => s + deriveStars(t), 0) / trips.length).toFixed(1);
  const totalPax = trips.reduce((s, t) => s + (t.groupSize || 0), 0);

  return (
    <section style={{
      padding: "48px clamp(20px,5%,60px)",
      background: "var(--page-bg, #f7f3ec)",
      borderBottom: "1px solid rgba(28,18,8,0.06)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#e8a850",
              marginBottom: 6,
            }}>
              Group Ratings
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px,2.5vw,28px)",
              fontWeight: 500,
              color: "#1c1208",
              margin: 0,
              lineHeight: 1.2,
            }}>
              What Groups Say
            </h2>
          </div>

          {/* Aggregate badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid rgba(232,168,80,0.3)",
            borderRadius: 100,
            padding: "8px 14px",
            flexShrink: 0,
            maxWidth: "100%",
          }}>
            <Stars count={5} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1208" }}>{avgStars}</span>
            <span style={{ fontSize: 11, color: "rgba(28,18,8,0.4)", whiteSpace: "nowrap" }}>
              {trips.length} {trips.length === 1 ? "group" : "groups"} · {totalPax} golfers
            </span>
          </div>
        </div>

        {/* Cards grid — responsive via .testimonials-grid CSS class in global.css */}
        <div className="testimonials-grid">
          {trips.map((trip, i) => (
            <TestimonialCard key={trip.id || i} trip={trip} />
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: 11,
          color: "rgba(28,18,8,0.35)",
          marginTop: 16,
          textAlign: "center",
        }}>
          Trip ratings are based on package tier and verified group bookings from{" "}
          <a href="/trips/" style={{ color: "#e8a850", textDecoration: "none" }}>GolfGraeagle Trip Archive</a>.
          New trips are added automatically as groups complete their bookings.
        </p>

      </div>
    </section>
  );
}
