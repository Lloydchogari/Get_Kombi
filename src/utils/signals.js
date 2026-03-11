import { SIGNAL_TTL, BUMP_INTERVAL, TAGS } from "../data/routes.js";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function uid()  { return Math.random().toString(36).slice(2, 10); }
export function now()  { return Date.now(); }

export function fmtAge(ts) {
  const m = Math.round((now() - ts) / 60000);
  if (m < 1)  return "just now";
  if (m === 1) return "1 min ago";
  if (m < 60)  return `${m} min ago`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m ago` : `${h}h ago`;
}

// ─── ROUTE STATS COMPUTATION ─────────────────────────────────────────────────
// Takes the full signals array + routes array.
// Returns sorted array of route summaries — only routes that have active signals.
// A signal is "active" if it was posted within SIGNAL_TTL.
// "stillWaiting" counts signals bumped within the last BUMP_INTERVAL * 1.5.

export function computeRouteStats(signals, routes) {
  const active = signals.filter(s => now() - s.ts < SIGNAL_TTL);

  // Group by route
  const byRoute = {};
  active.forEach(s => {
    if (!byRoute[s.routeId]) byRoute[s.routeId] = [];
    byRoute[s.routeId].push(s);
  });

  return Object.entries(byRoute)
    .map(([routeId, sigs]) => {
      // Find route definition — prefer preset, fall back to routeMeta on signal
      const route = routes.find(r => r.id === routeId) || sigs[0]?.routeMeta;
      if (!route) return null;

      const stillWaiting = sigs.filter(
        s => now() - s.lastBump < BUMP_INTERVAL * 1.5
      ).length;

      // Count tags and take top 2
      const tagCounts = {};
      sigs.flatMap(s => s.tags).forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([id]) => id);

      // Urgency 0–10: weighted by still-waiting + total reports
      const urgency = Math.min(
        10,
        Math.floor(stillWaiting * 1.5 + sigs.length * 0.5)
      );

      return {
        routeId,
        route,
        total       : sigs.length,
        stillWaiting,
        topTags,
        urgency,
        latest      : Math.max(...sigs.map(s => s.ts)),
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => b.urgency - a.urgency || b.stillWaiting - a.stillWaiting
    );
}

// ─── BUILD A SIGNAL OBJECT ───────────────────────────────────────────────────
export function buildSignal({ routeId, type, tags, sessionId, routeMeta }) {
  return {
    id       : uid(),
    routeId,
    type,        // "none" | "few"
    tags,        // string[]
    ts       : now(),
    lastBump : now(),
    sessionId,
    routeMeta,   // full route object — used if routeId not in preset list
  };
}