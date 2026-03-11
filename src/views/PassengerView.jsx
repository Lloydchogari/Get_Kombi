import { useState, useEffect } from "react";
import { TAGS, SIGNAL_TTL, BUMP_INTERVAL } from "../data/routes.js";
import { now, computeRouteStats, buildSignal } from "../utils/signals.js";
import {
  Dot, UrgencyBar, SectionLabel,
  Button, SearchInput, Dropdown,
} from "../components/Atoms.jsx";

// ─── PASSENGER VIEW ──────────────────────────────────────────────────────────

export function PassengerView({ routes, signals, onSignal, onBump, sessionId, t }) {
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch,   setToSearch]   = useState("");
  const [showFrom,   setShowFrom]   = useState(false);
  const [showTo,     setShowTo]     = useState(false);
  const [selRoute,   setSelRoute]   = useState(null);
  const [selTags,    setSelTags]    = useState([]);
  const [step,       setStep]       = useState("route"); // "route" | "done"
  const [mySignal,   setMySignal]   = useState(null);
  const [canBump,    setCanBump]    = useState(false);

  // Unique from/to values for autocomplete
  const fromOptions = [...new Set(routes.map(r => r.from))].sort();
  const toOptions   = [...new Set(routes.map(r => r.to))].sort();

  const filtFrom = fromOptions
    .filter(f => f.toLowerCase().includes(fromSearch.toLowerCase()))
    .slice(0, 7);

  const filtTo = toOptions
    .filter(f => f.toLowerCase().includes(toSearch.toLowerCase()))
    .slice(0, 7);

  // Can show signal buttons when both fields have content
  const canProceed = fromSearch.trim().length > 1 && toSearch.trim().length > 1;

  // Poll bump eligibility every 15s
  useEffect(() => {
    if (!mySignal) return;
    const check = () => setCanBump(now() - mySignal.lastBump >= BUMP_INTERVAL);
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, [mySignal]);

  // ── Route selection helpers ──
  function pickFrom(val) {
    setFromSearch(val);
    setShowFrom(false);
    const match = routes.find(r => r.from === val && (!toSearch || r.to === toSearch));
    setSelRoute(match || null);
    if (!toSearch) {
      const first = routes.find(r => r.from === val);
      if (first) { setToSearch(first.to); setSelRoute(first); }
    }
  }

  function pickTo(val) {
    setToSearch(val);
    setShowTo(false);
    setSelRoute(routes.find(r => r.from === fromSearch && r.to === val) || null);
  }

  // ── Signal submission ──
  function submit(type) {
    const routeId = selRoute?.id
      || `u-${fromSearch.trim()}-${toSearch.trim()}`.replace(/\s+/g, "_");
    const routeMeta = selRoute || {
      id   : routeId,
      from : fromSearch.trim(),
      to   : toSearch.trim(),
      rank : "New route",
    };
    const sig = buildSignal({ routeId, type, tags: selTags, sessionId, routeMeta });
    onSignal(sig);
    setMySignal(sig);
    setStep("done");
  }

  function bump() {
    if (!mySignal || !canBump) return;
    onBump(mySignal.id);
    setMySignal(s => s ? { ...s, lastBump: now() } : s);
    setCanBump(false);
  }

  function reset() {
    setStep("route");
    setFromSearch(""); setToSearch("");
    setSelRoute(null); setSelTags([]);
    setMySignal(null); setCanBump(false);
  }

  // Live stats for current route (used in both screens)
  const allRoutes = [
    ...routes,
    ...(mySignal?.routeMeta && !routes.find(r => r.id === mySignal.routeId)
      ? [mySignal.routeMeta] : []),
  ];
  const routeStatsList = computeRouteStats(signals, allRoutes);
  const previewStats   = selRoute
    ? routeStatsList.find(s => s.routeId === selRoute.id)
    : null;
  const currentStats   = mySignal
    ? routeStatsList.find(s => s.routeId === mySignal.routeId)
    : null;

  // ────────────────────────────────────────────────────────
  // DONE SCREEN
  // ────────────────────────────────────────────────────────
  if (step === "done" && mySignal) {
    const total    = currentStats?.total       ?? 1;
    const waiting  = currentStats?.stillWaiting ?? 1;
    const urgency  = currentStats?.urgency      ?? 1;
    const minsLeft = Math.max(0, Math.round((SIGNAL_TTL - (now() - mySignal.ts)) / 60000));
    const bumpWait = Math.max(0, Math.ceil((BUMP_INTERVAL - (now() - mySignal.lastBump)) / 60000));

    return (
      <main
        className="ks-page"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-xl)", animation: "ks-fadeUp .25s ease both" }}
      >
        {/* Heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-xl)", fontWeight: 800, color: t.fg, letterSpacing: "-0.02em", marginBottom: 4 }}>
            Signal active
          </h1>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted }}>
            {mySignal.routeMeta?.from} → {mySignal.routeMeta?.to}
          </p>
        </div>

        {/* Live counters */}
        <div
          style={{
            background  : t.surface,
            border      : `1px solid ${t.border2}`,
            borderRadius: 16,
            overflow    : "hidden",
            marginBottom: 14,
          }}
        >
          <div className="ks-counter-grid">
            {[
              { label: "Reported no/few kombis", value: total,   color: t.fg     },
              { label: "Still waiting now",       value: waiting, color: t.accent },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  padding   : "20px 16px 16px",
                  textAlign : "center",
                  borderRight: `1px solid ${t.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily  : "var(--ks-display)",
                    fontSize    : "var(--fs-3xl)",
                    fontWeight  : 800,
                    color,
                    lineHeight  : 1,
                    animation   : "ks-scaleIn .3s ease",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, marginTop: 6, lineHeight: 1.3 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "0 16px 14px" }}>
            <UrgencyBar value={urgency} t={t} />
            <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 8, textAlign: "right" }}>
              Signal expires in ~{minsLeft} min
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <Button
            variant="accent"
            onClick={bump}
            disabled={!canBump}
            t={t}
            style={{ flex: 1 }}
          >
            {canBump ? "Still waiting" : `Still waiting (${bumpWait}m)`}
          </Button>
          <Button
            variant="ghost"
            onClick={reset}
            t={t}
            style={{ width: "auto", padding: "16px 22px", flex: "none" }}
          >
            Done
          </Button>
        </div>

        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted, lineHeight: 1.7 }}>
          Tap <strong style={{ color: t.fgSub }}>Still waiting</strong> every few minutes so drivers see accurate demand. When kombis arrive, tap Done or just leave — your signal fades automatically.
        </p>
      </main>
    );
  }

  // ────────────────────────────────────────────────────────
  // ROUTE SELECTION SCREEN
  // ────────────────────────────────────────────────────────
  return (
    <main
      className="ks-page"
      style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-xl)", animation: "ks-fadeUp .2s ease both" }}
    >
      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--ks-display)", fontSize: "var(--fs-xl)", fontWeight: 800, color: t.fg, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Where are you going?
        </h1>
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted }}>
          Pick your route, then signal demand in one tap
        </p>
      </div>

      {/* FROM input */}
      <div style={{ marginBottom: 12 }}>
        <SearchInput
          label="From"
          value={fromSearch}
          onChange={e => { setFromSearch(e.target.value); setShowFrom(true); setSelRoute(null); }}
          onFocus={() => setShowFrom(true)}
          onBlur={() => setShowFrom(false)}
          placeholder="e.g. Southlands"
          t={t}
        >
          {showFrom && fromSearch.length > 0 && (
            <Dropdown
              items={filtFrom}
              onSelect={pickFrom}
              addLabel={
                fromSearch.trim().length > 1 && !fromOptions.includes(fromSearch.trim())
                  ? fromSearch.trim()
                  : null
              }
              t={t}
            />
          )}
        </SearchInput>
      </div>

      {/* TO input */}
      <div style={{ marginBottom: 20 }}>
        <SearchInput
          label="To"
          value={toSearch}
          onChange={e => { setToSearch(e.target.value); setShowTo(true); setSelRoute(null); }}
          onFocus={() => setShowTo(true)}
          onBlur={() => setShowTo(false)}
          placeholder="e.g. CBD"
          t={t}
        >
          {showTo && toSearch.length > 0 && (
            <Dropdown
              items={filtTo}
              onSelect={pickTo}
              addLabel={
                toSearch.trim().length > 1 && !toOptions.includes(toSearch.trim())
                  ? toSearch.trim()
                  : null
              }
              t={t}
            />
          )}
        </SearchInput>
      </div>

      {/* Live signal preview for this route */}
      {previewStats && (
        <div
          style={{
            background  : t.surface,
            border      : `1px solid ${t.border2}`,
            borderRadius: 12,
            padding     : "12px 16px",
            marginBottom: 20,
            display     : "flex",
            alignItems  : "center",
            justifyContent: "space-between",
            animation   : "ks-fadeIn .2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Dot color={t.accent} pulse size={8} />
            <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.fg, fontWeight: 600 }}>
              {previewStats.stillWaiting} still waiting
            </span>
          </div>
          <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
            {previewStats.total} report{previewStats.total !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Context tags */}
      {canProceed && (
        <div style={{ marginBottom: 22 }}>
          <SectionLabel t={t}>
            Add context <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "var(--fs-xs)" }}>(optional)</span>
          </SectionLabel>
          <div className="ks-tags">
            {TAGS.map(tag => {
              const on = selTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => setSelTags(s => on ? s.filter(x => x !== tag.id) : [...s, tag.id])}
                  style={{
                    padding     : "9px 16px",
                    background  : on ? t.accent : "none",
                    border      : `1.5px solid ${on ? t.accent : t.border2}`,
                    borderRadius: 99,
                    color       : on ? t.accentFg : t.fgSub,
                    fontFamily  : "var(--ks-body)",
                    fontSize    : "var(--fs-base)",
                    cursor      : "pointer",
                    fontWeight  : on ? 600 : 400,
                    transition  : "all .15s",
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Signal buttons */}
      {canProceed ? (
        <div className="ks-signal-btns">
          <Button variant="primary" onClick={() => submit("none")} t={t}>
            No kombis
          </Button>
          <Button variant="secondary" onClick={() => submit("few")} t={t}>
            Few kombis
          </Button>
        </div>
      ) : (
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.dim, marginTop: 8 }}>
          Select From and To to continue
        </p>
      )}
    </main>
  );
}