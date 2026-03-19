// DriverView.jsx — KombiSignal driver demand dashboard
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import { useState } from "react";
import { TAGS, SIGNAL_TTL } from "../data/routes.js";
import { now, computeRouteStats, fmtAge } from "../utils/signals.js";

// ── Palette mapped to urgency ─────────────────────────────────────────────────
const P = {
  deep:  "#15292E",
  dark:  "#074047",
  teal:  "#1C8585",
  green: "#1DA27E",
  pgrey: "#C8D6D8",
  red:   "#E05252",
  amber: "#E8A84A",
};

function urgencyColor(urgency) {
  if (urgency >= 7) return P.red;
  if (urgency >= 4) return P.amber;
  return P.green;
}

// ── Inline style helpers ──────────────────────────────────────────────────────
const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;

// ── Sub-components ────────────────────────────────────────────────────────────

function LiveDot({ color, pulse }) {
  return (
    <span style={{
      display: "inline-block",
      width: 7, height: 7,
      borderRadius: "50%",
      background: color,
      flexShrink: 0,
      animation: pulse ? "ksDotPulse 1.8s ease-in-out infinite" : "none",
    }} />
  );
}

function UrgBar({ value, max = 10, t }) {
  const pct   = Math.min(100, (value / max) * 100);
  const color = urgencyColor(value);
  return (
    <div style={{ height: 3, background: t.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: color, borderRadius: 2,
        transition: "width .4s ease",
      }} />
    </div>
  );
}

function ZoneLabel({ label, dotColor, t }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      margin: "16px 0 8px",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: dotColor, flexShrink: 0,
        display: "inline-block",
      }} />
      <span style={{
        fontFamily: SF, fontSize: 10, fontWeight: 600,
        color: t.muted, letterSpacing: "0.12em", textTransform: "uppercase",
      }}>{label}</span>
      <div style={{ flex: 1, height: "0.5px", background: t.border }} />
    </div>
  );
}

function TagChip({ label, accent, t }) {
  return (
    <span style={{
      fontFamily: SF, fontSize: 11,
      color: accent || t.muted,
      border: `1px solid ${accent ? accent + "55" : t.border}`,
      borderRadius: 99, padding: "3px 10px",
      whiteSpace: "nowrap", lineHeight: 1.4,
    }}>
      {label}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function DriverView({ signals, routes, t }) {
  const [expanded, setExpanded] = useState(null);
  const [search,   setSearch]   = useState("");

  const allRoutes = [
    ...routes,
    ...signals
      .filter(s => s.routeMeta && !routes.find(r => r.id === s.routeId))
      .map(s => s.routeMeta),
  ];

  const allStats = computeRouteStats(signals, allRoutes);
  const stats = search.trim()
    ? allStats.filter(s =>
        s.route.from.toLowerCase().includes(search.toLowerCase()) ||
        s.route.to.toLowerCase().includes(search.toLowerCase()) ||
        s.route.rank?.toLowerCase().includes(search.toLowerCase())
      )
    : allStats;

  // group into urgency zones
  const critical = stats.filter(s => s.urgency >= 7);
  const moderate = stats.filter(s => s.urgency >= 4 && s.urgency < 7);
  const low      = stats.filter(s => s.urgency < 4);

  const totalWaiting = allStats.reduce((a, s) => a + s.stillWaiting, 0);

  // ── EMPTY STATE ──────────────────────────────────────────────────────────────
  if (!allStats.length) {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <div style={{
          maxWidth: 480, margin: "0 auto", width: "100%",
          padding: "52px 24px", textAlign: "center",
          animation: "ksFadeUp .25s ease both",
          fontFamily: SF,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: t.surface,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            border: t.cardBorder,
            boxShadow: t.cardShadow,
          }}>
            <span style={{ fontSize: 26 }}>🚐</span>
          </div>

          <h2 style={{
            fontSize: 20, fontWeight: 700, color: t.fg,
            letterSpacing: "-0.02em", marginBottom: 10,
          }}>
            No demand signals yet
          </h2>
          <p style={{
            fontSize: 14, color: t.muted,
            lineHeight: 1.7, maxWidth: 300, margin: "0 auto",
          }}>
            Routes appear here when passengers report no or few kombis. Highest demand routes show first.
          </p>

          {/* How it works */}
          <div style={{
            marginTop: 32, background: t.surface,
            borderRadius: 16, padding: "18px 16px", textAlign: "left",
            border: t.cardBorder, boxShadow: t.cardShadow,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, color: t.muted,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
            }}>
              How it works
            </p>
            {[
              ["1", "Passengers select their route and tap 'No kombis'"],
              ["2", "Their signal appears on this dashboard instantly"],
              ["3", "The waiting counter shows urgency in real time"],
              ["4", "Signals expire after 25 minutes automatically"],
            ].map(([n, text]) => (
              <div key={n} style={{
                display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: P.teal,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff",
                }}>{n}</div>
                <p style={{ fontSize: 13, color: t.fgSub, lineHeight: 1.55, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        maxWidth: 480, margin: "0 auto", width: "100%",
        padding: "16px 16px 48px",
        animation: "ksFadeUp .22s ease both",
        fontFamily: SF,
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 16,
        }}>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 700,
              color: t.fg, letterSpacing: "-0.025em", lineHeight: 1,
            }}>
              Hot routes
            </h1>
            <p style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
              {allStats.length} route{allStats.length !== 1 ? "s" : ""} · {totalWaiting} waiting
            </p>
          </div>

          {allStats[0]?.urgency >= 7 && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: P.red + "14",
              border: `1px solid ${P.red}44`,
              borderRadius: 99, padding: "5px 12px",
            }}>
              <LiveDot color={P.red} pulse />
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: P.red, letterSpacing: "0.08em",
              }}>
                HIGH DEMAND
              </span>
            </div>
          )}
        </div>

        {/* ── Search ── */}
        {allStats.length >= 4 && (
          <div style={{ marginBottom: 14 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by suburb or rank…"
              style={{
                width: "100%", background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "11px 14px",
                color: t.fg, fontFamily: SF, fontSize: 14,
                transition: "border-color .15s", outline: "none",
              }}
              onFocus={e  => e.currentTarget.style.borderColor = P.teal}
              onBlur={e   => e.currentTarget.style.borderColor = t.border}
            />
          </div>
        )}

        {search && stats.length === 0 && (
          <p style={{ fontSize: 14, color: t.muted, padding: "10px 0" }}>
            No active routes match "{search}"
          </p>
        )}

        {/* ── Zone sections ── */}
        {[
          { label: "Critical",  dot: P.red,   items: critical },
          { label: "Moderate",  dot: P.amber,  items: moderate },
          { label: "Low",       dot: P.green,  items: low      },
        ].map(zone => zone.items.length === 0 ? null : (
          <div key={zone.label}>
            {stats.length > 1 && (
              <ZoneLabel label={zone.label} dotColor={zone.dot} t={t} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {zone.items.map((s, i) => (
                <RouteCard
                  key={s.routeId}
                  s={s} i={i}
                  signals={signals}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}

        {/* ── Ad strip ── */}
        <div style={{
          marginTop: 24, padding: "14px 16px",
          background: t.surface,
          border: t.cardBorder,
          boxShadow: t.cardShadow,
          borderRadius: 14,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 12,
        }}>
          <div>
            <p style={{
              fontSize: 10, fontWeight: 600, color: t.muted,
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3,
            }}>
              Sponsored
            </p>
            <p style={{ fontSize: 14, color: t.fg, fontWeight: 600, lineHeight: 1.3 }}>
              Kombi Insurance — Quick cover for your vehicle
            </p>
            <p style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
              Contact: 0771 000 000
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Route card ─────────────────────────────────────────────────────────────────
function RouteCard({ s, i, signals, expanded, setExpanded, t }) {
  const isExp    = expanded === s.routeId;
  const urgColor = urgencyColor(s.urgency);
  const isTop    = i < 3;
  const tagLabels = s.topTags
    .map(id => TAGS.find(tg => tg.id === id)?.label)
    .filter(Boolean);

  return (
    <div
      onClick={() => setExpanded(isExp ? null : s.routeId)}
      style={{
        background: t.surface,
        border: t.cardBorder,
        boxShadow: t.cardShadow,
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        animation: `ksFadeUp .18s ease ${i * 0.04}s both`,
        transition: "transform .15s, box-shadow .15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.13)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = t.cardShadow;
      }}
    >
      {/* Urgency accent line at top */}
      <div style={{ height: 2, background: urgColor, opacity: 0.7 }} />

      <div style={{ padding: "13px 15px" }}>

        {/* Rank */}
        <div style={{
          fontSize: 10, fontWeight: 600,
          color: t.muted, letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 7,
        }}>
          {s.route.rank}
        </div>

        {/* Route name + waiting count */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center",
              gap: 6, flexWrap: "wrap",
            }}>
              {isTop && <LiveDot color={urgColor} pulse={s.urgency >= 6} />}
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: t.fg, letterSpacing: "-0.01em",
              }}>
                {s.route.from}
              </span>
              <span style={{ color: t.muted, fontSize: 11, fontWeight: 300 }}>→</span>
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: t.fg, letterSpacing: "-0.01em",
              }}>
                {s.route.to}
              </span>
            </div>
            <p style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>
              Updated {fmtAge(s.latest)}
            </p>
          </div>

          {/* Count */}
          <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 12 }}>
            <div style={{
              fontSize: 30, fontWeight: 700,
              lineHeight: 1, color: urgColor,
              letterSpacing: "-0.03em",
            }}>
              {s.stillWaiting}
            </div>
            <div style={{
              fontSize: 9, color: t.muted,
              marginTop: 2, letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              WAITING
            </div>
          </div>
        </div>

        {/* Urgency bar */}
        <UrgBar value={s.urgency} t={t} />

        {/* Tags row */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 5, marginTop: 10, alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: t.muted }}>
            {s.total} report{s.total !== 1 ? "s" : ""}
          </span>
          {tagLabels.map(l => <TagChip key={l} label={l} t={t} />)}
          {s.urgency >= 7 && <TagChip label="High demand" accent={P.red} t={t} />}
          <span style={{
            marginLeft: "auto", fontSize: 11, color: t.muted,
            letterSpacing: "0.02em",
          }}>
            {isExp ? "▲ hide" : "▼ details"}
          </span>
        </div>
      </div>

      {/* Expanded signal list */}
      {isExp && (
        <div style={{
          borderTop: `1px solid ${t.border}`,
          padding: "12px 15px",
          background: t.surfaceB,
          animation: "ksFadeIn .15s ease both",
        }}>
          <p style={{
            fontSize: 10, fontWeight: 600, color: t.muted,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
          }}>
            Recent signals
          </p>
          {signals
            .filter(sig => sig.routeId === s.routeId && now() - sig.ts < SIGNAL_TTL)
            .sort((a, b) => b.ts - a.ts)
            .slice(0, 8)
            .map((sig, idx) => (
              <div key={sig.id} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "7px 0",
                borderBottom: `1px solid ${t.border}`,
                opacity: Math.max(0.35, 1 - idx * 0.09), gap: 8,
              }}>
                <div style={{
                  display: "flex", gap: 8, alignItems: "center",
                  flexWrap: "wrap", minWidth: 0,
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: sig.type === "none" ? P.red : P.amber,
                  }}>
                    {sig.type === "none" ? "No kombis" : "Few kombis"}
                  </span>
                  {sig.tags.map(tid => {
                    const tag = TAGS.find(tg => tg.id === tid);
                    return tag
                      ? <span key={tid} style={{ fontSize: 11, color: t.muted }}>{tag.label}</span>
                      : null;
                  })}
                </div>
                <span style={{ fontSize: 11, color: t.muted, flexShrink: 0 }}>
                  {fmtAge(sig.ts)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ksFadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ksFadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes ksDotPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.4; transform:scale(0.78); }
  }
`;