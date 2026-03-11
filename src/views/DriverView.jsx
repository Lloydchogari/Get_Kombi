import { useState } from "react";
import { TAGS, SIGNAL_TTL } from "../data/routes.js";
import { now, computeRouteStats, fmtAge } from "../utils/signals.js";
import { Dot, UrgencyBar, Chip, SectionLabel } from "../components/Atoms.jsx";

export function DriverView({ signals, routes, t }) {
  const [expanded, setExpanded] = useState(null);
  const [search,   setSearch]   = useState("");

  const allRoutes = [
    ...routes,
    ...signals.filter(s => s.routeMeta && !routes.find(r => r.id === s.routeId)).map(s => s.routeMeta),
  ];

  const allStats = computeRouteStats(signals, allRoutes);
  const stats = search.trim()
    ? allStats.filter(s =>
        s.route.from.toLowerCase().includes(search.toLowerCase()) ||
        s.route.to.toLowerCase().includes(search.toLowerCase()) ||
        s.route.rank?.toLowerCase().includes(search.toLowerCase())
      )
    : allStats;

  // ── EMPTY STATE ──────────────────────────────────────────────────────────────
  if (!allStats.length) {
    return (
      <div style={{
        maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
        padding: "48px 24px", textAlign: "center", animation: "ks-fadeUp .2s ease both",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: t.surface, border: `1px solid ${t.border2}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 28,
        }}>
          🚐
        </div>
        <h2 style={{
          fontFamily: "var(--ks-display)", fontSize: "var(--fs-lg)", fontWeight: 700,
          color: t.fg, marginBottom: 10,
        }}>
          No demand signals yet
        </h2>
        <p style={{
          fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted,
          lineHeight: 1.7, maxWidth: 300, margin: "0 auto",
        }}>
          Routes only appear here when passengers have reported no or few kombis. Routes with the highest demand appear at the top.
        </p>

        {/* How it works mini guide */}
        <div style={{
          marginTop: 32, background: t.surface, border: `1px solid ${t.border2}`,
          borderRadius: 14, padding: "18px 16px", textAlign: "left",
        }}>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
            How it works
          </p>
          {[
            ["1", "Passengers select their route and tap 'No kombis'"],
            ["2", "Their signal appears on this dashboard instantly"],
            ["3", "The waiting counter shows urgency in real time"],
            ["4", "Signals expire after 25 minutes automatically"],
          ].map(([n, text]) => (
            <div key={n} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: t.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700, color: t.accentFg,
              }}>{n}</div>
              <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.fgSub, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
      padding: "16px 16px 40px", animation: "ks-fadeUp .2s ease both",
    }}>

      {/* Header summary bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14,
      }}>
        <div>
          <h1 style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-lg)", fontWeight: 800, color: t.fg, letterSpacing: "-0.02em" }}>
            Hot routes
          </h1>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, marginTop: 1 }}>
            {allStats.length} route{allStats.length !== 1 ? "s" : ""} · {allStats.reduce((a, s) => a + s.stillWaiting, 0)} waiting
          </p>
        </div>
        {/* Top urgency badge */}
        {allStats[0]?.urgency >= 7 && (
          <div style={{
            background: t.red + "18", border: `1px solid ${t.red}44`,
            borderRadius: 99, padding: "4px 12px",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Dot color={t.red} pulse size={6} />
            <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700, color: t.red }}>
              HIGH DEMAND
            </span>
          </div>
        )}
      </div>

      {/* Search — shows when 4+ routes active */}
      {allStats.length >= 4 && (
        <div style={{ marginBottom: 12 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by suburb or rank…"
            style={{
              width: "100%", background: t.surface,
              border: `1.5px solid ${t.border2}`, borderRadius: 10,
              padding: "10px 14px", color: t.fg,
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)",
              transition: "border-color .15s",
            }}
            onFocus={e  => e.currentTarget.style.borderColor = t.accent}
            onBlur={e   => e.currentTarget.style.borderColor = t.border2}
          />
        </div>
      )}

      {search && stats.length === 0 && (
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted, padding: "12px 0" }}>
          No active routes match "{search}"
        </p>
      )}

      {/* Route cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stats.map((s, i) => {
          const urgColor  = s.urgency >= 7 ? t.red : s.urgency >= 4 ? t.accent : t.green;
          const isExp     = expanded === s.routeId;
          const isTop     = i < 3;
          const tagLabels = s.topTags.map(id => TAGS.find(tg => tg.id === id)?.label).filter(Boolean);

          return (
            <div
              key={s.routeId}
              onClick={() => setExpanded(isExp ? null : s.routeId)}
              style={{
                background: t.surface,
                border: `1.5px solid ${isTop && s.urgency >= 7 ? t.red + "88" : t.border2}`,
                borderRadius: 14, overflow: "hidden", cursor: "pointer",
                animation: `ks-fadeUp .18s ease ${i * 0.04}s both`,
                transition: "border-color .2s, transform .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ padding: "14px 16px" }}>

                {/* Rank label */}
                <div style={{ marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 600,
                    color: t.muted, letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {s.route.rank}
                  </span>
                </div>

                {/* Route + waiting number */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {isTop && <Dot color={urgColor} pulse={s.urgency >= 6} size={7} />}
                      <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-md)", fontWeight: 700, color: t.fg }}>
                        {s.route.from}
                      </span>
                      <span style={{ color: t.muted, fontSize: 11 }}>→</span>
                      <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-md)", fontWeight: 700, color: t.fg }}>
                        {s.route.to}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 3 }}>
                      Updated {fmtAge(s.latest)}
                    </p>
                  </div>

                  {/* Waiting count */}
                  <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{
                      fontFamily: "var(--ks-display)", fontSize: "var(--fs-2xl)",
                      fontWeight: 800, lineHeight: 1, color: urgColor,
                    }}>
                      {s.stillWaiting}
                    </div>
                    <div style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 2, letterSpacing: "0.05em" }}>
                      WAITING
                    </div>
                  </div>
                </div>

                <UrgencyBar value={s.urgency} t={t} />

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted }}>
                    {s.total} report{s.total !== 1 ? "s" : ""}
                  </span>
                  {tagLabels.map(l => <Chip key={l} label={l} t={t} />)}
                  {s.urgency >= 7 && <Chip label="High demand" accent={t.red} t={t} />}
                  <span style={{
                    marginLeft: "auto", fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)",
                    color: t.muted,
                  }}>
                    {isExp ? "▲ hide" : "▼ details"}
                  </span>
                </div>
              </div>

              {/* Expanded signal list */}
              {isExp && (
                <div style={{
                  borderTop: `1px solid ${t.border}`, padding: "12px 16px",
                  background: t.surfaceB, animation: "ks-fadeIn .15s ease both",
                }}>
                  <SectionLabel t={t} style={{ marginBottom: 10 }}>Recent signals</SectionLabel>
                  {signals
                    .filter(sig => sig.routeId === s.routeId && now() - sig.ts < SIGNAL_TTL)
                    .sort((a, b) => b.ts - a.ts)
                    .slice(0, 8)
                    .map((sig, idx) => (
                      <div key={sig.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 0", borderBottom: `1px solid ${t.border}`,
                        opacity: Math.max(0.38, 1 - idx * 0.09), gap: 8,
                      }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
                          <span style={{
                            fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", fontWeight: 700,
                            color: sig.type === "none" ? t.red : t.accent,
                          }}>
                            {sig.type === "none" ? "No kombis" : "Few kombis"}
                          </span>
                          {sig.tags.map(tid => {
                            const tag = TAGS.find(tg => tg.id === tid);
                            return tag
                              ? <span key={tid} style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted }}>{tag.label}</span>
                              : null;
                          })}
                        </div>
                        <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, flexShrink: 0 }}>
                          {fmtAge(sig.ts)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ad strip */}
      <div style={{
        marginTop: 24, padding: "14px 16px",
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
      }}>
        <div>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 600, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
            Sponsored
          </p>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.fg, fontWeight: 600 }}>
            Kombi Insurance — Quick cover for your vehicle
          </p>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, marginTop: 2 }}>
            Contact: 0771 000 000
          </p>
        </div>
      </div>
    </div>
  );
}