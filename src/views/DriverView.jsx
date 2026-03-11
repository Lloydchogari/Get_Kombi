import { useState } from "react";
import { TAGS, SIGNAL_TTL } from "../data/routes.js";
import { now, computeRouteStats, fmtAge } from "../utils/signals.js";
import { Dot, UrgencyBar, Chip, SectionLabel } from "../components/Atoms.jsx";

// ─── DRIVER VIEW ─────────────────────────────────────────────────────────────

export function DriverView({ signals, routes, t }) {
  const [expanded, setExpanded] = useState(null);
  const [search,   setSearch]   = useState("");

  // Merge preset routes with any user-created route metas on signals
  const allRoutes = [
    ...routes,
    ...signals
      .filter(s => s.routeMeta && !routes.find(r => r.id === s.routeId))
      .map(s => s.routeMeta),
  ];

  const allStats = computeRouteStats(signals, allRoutes);

  // Optional search filter
  const stats = search.trim()
    ? allStats.filter(s =>
        s.route.from.toLowerCase().includes(search.toLowerCase()) ||
        s.route.to.toLowerCase().includes(search.toLowerCase()) ||
        s.route.rank?.toLowerCase().includes(search.toLowerCase())
      )
    : allStats;

  // ── Empty state ──
  if (!allStats.length) {
    return (
      <main
        className="ks-page"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-xl)", textAlign: "center", animation: "ks-fadeUp .2s ease both" }}
      >
        <div
          style={{
            width       : 56,
            height      : 56,
            borderRadius: "50%",
            background  : t.surfaceB,
            border      : `1px solid ${t.border2}`,
            display     : "flex",
            alignItems  : "center",
            justifyContent: "center",
            margin      : "0 auto 20px",
            fontSize    : 24,
          }}
        >
          —
        </div>
        <h2 style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-lg)", fontWeight: 700, color: t.muted, marginBottom: 10 }}>
          No demand signals yet
        </h2>
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted, lineHeight: 1.7, maxWidth: 320, margin: "0 auto" }}>
          Routes only appear here once passengers have reported no or few kombis. Check back in a few minutes.
        </p>
      </main>
    );
  }

  return (
    <main
      className="ks-page"
      style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-xl)", animation: "ks-fadeUp .2s ease both" }}
    >
      {/* Heading */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-xl)", fontWeight: 800, color: t.fg, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Hot routes
        </h1>
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted }}>
          {allStats.length} route{allStats.length !== 1 ? "s" : ""} with active passenger demand
        </p>
      </div>

      {/* Route search */}
      {allStats.length >= 4 && (
        <div style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by suburb or rank…"
            style={{
              width       : "100%",
              background  : t.surface,
              border      : `1.5px solid ${t.border2}`,
              borderRadius: 10,
              padding     : "12px 16px",
              color       : t.fg,
              fontFamily  : "var(--ks-body)",
              fontSize    : "var(--fs-base)",
              transition  : "border-color .15s",
            }}
            onFocus={e  => e.currentTarget.style.borderColor = t.accent}
            onBlur={e   => e.currentTarget.style.borderColor = t.border2}
          />
        </div>
      )}

      {/* No search results */}
      {stats.length === 0 && search && (
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted, marginTop: 16 }}>
          No active routes match "{search}"
        </p>
      )}

      {/* Route cards */}
      <div className="ks-driver-grid">
        {stats.map((s, i) => {
          const urgColor  = s.urgency >= 7 ? t.red : s.urgency >= 4 ? t.accent : t.green;
          const isExp     = expanded === s.routeId;
          const isTop     = i < 3;
          const tagLabels = s.topTags
            .map(id => TAGS.find(tg => tg.id === id)?.label)
            .filter(Boolean);

          return (
            <div
              key={s.routeId}
              onClick={() => setExpanded(isExp ? null : s.routeId)}
              style={{
                background  : t.surface,
                border      : `1.5px solid ${isTop && s.urgency >= 7 ? t.red : t.border2}`,
                borderRadius: 14,
                overflow    : "hidden",
                cursor      : "pointer",
                animation   : `ks-fadeUp .2s ease ${i * 0.05}s both`,
                transition  : "border-color .2s",
              }}
            >
              {/* ── Card body ── */}
              <div style={{ padding: "16px 18px" }}>
                {/* Route name + waiting number */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                      {isTop && (
                        <Dot color={urgColor} pulse={s.urgency >= 6} size={8} />
                      )}
                      <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-md)", fontWeight: 700, color: t.fg }}>
                        {s.route.from}
                      </span>
                      <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted }}>→</span>
                      <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-md)", fontWeight: 700, color: t.fg }}>
                        {s.route.to}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
                      {s.route.rank} · updated {fmtAge(s.latest)}
                    </p>
                  </div>

                  {/* Big waiting count */}
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-2xl)", fontWeight: 800, lineHeight: 1, color: urgColor }}>
                      {s.stillWaiting}
                    </div>
                    <div style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 2, letterSpacing: "0.05em" }}>
                      WAITING
                    </div>
                  </div>
                </div>

                {/* Urgency bar */}
                <UrgencyBar value={s.urgency} t={t} />

                {/* Tags row */}
                <div className="ks-tags" style={{ marginTop: 10 }}>
                  <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
                    {s.total} report{s.total !== 1 ? "s" : ""}
                  </span>
                  {tagLabels.map(l => <Chip key={l} label={l} t={t} />)}
                  {s.urgency >= 7 && <Chip label="High demand" accent={t.red} t={t} />}
                </div>
              </div>

              {/* ── Expanded signal list ── */}
              {isExp && (
                <div
                  style={{
                    borderTop : `1px solid ${t.border}`,
                    padding   : "14px 18px",
                    background: t.surfaceB,
                    animation : "ks-fadeIn .15s ease both",
                  }}
                >
                  <SectionLabel t={t} style={{ marginBottom: 10 }}>Recent signals</SectionLabel>
                  {signals
                    .filter(sig => sig.routeId === s.routeId && now() - sig.ts < SIGNAL_TTL)
                    .sort((a, b) => b.ts - a.ts)
                    .slice(0, 8)
                    .map((sig, idx) => (
                      <div
                        key={sig.id}
                        style={{
                          display        : "flex",
                          justifyContent : "space-between",
                          alignItems     : "center",
                          padding        : "9px 0",
                          borderBottom   : `1px solid ${t.border}`,
                          opacity        : Math.max(0.38, 1 - idx * 0.09),
                          gap            : 8,
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
                          <span
                            style={{
                              fontFamily: "var(--ks-body)",
                              fontSize  : "var(--fs-base)",
                              fontWeight: 700,
                              color     : sig.type === "none" ? t.red : t.accent,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {sig.type === "none" ? "No kombis" : "Few kombis"}
                          </span>
                          {sig.tags.map(tid => {
                            const tag = TAGS.find(tg => tg.id === tid);
                            return tag ? (
                              <span key={tid} style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
                                {tag.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                        <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, flexShrink: 0 }}>
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

      {/* Sponsored ad strip */}
      <div
        style={{
          marginTop   : 28,
          padding     : "14px 16px",
          background  : t.surface,
          border      : `1px solid ${t.border}`,
          borderRadius: 12,
          display     : "flex",
          justifyContent: "space-between",
          alignItems  : "center",
          gap         : 12,
        }}
      >
        <div>
          <SectionLabel t={t} style={{ marginBottom: 3 }}>Sponsored</SectionLabel>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.fg, fontWeight: 600 }}>
            Kombi Insurance — Quick cover for your vehicle
          </p>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, marginTop: 2 }}>
            Contact: 0771 000 000
          </p>
        </div>
      </div>
    </main>
  );
}