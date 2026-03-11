import { useState, useEffect } from "react";
import { TAGS, SIGNAL_TTL, BUMP_INTERVAL } from "../data/routes.js";
import { now, computeRouteStats, buildSignal } from "../utils/signals.js";
import { Dot, UrgencyBar, Button, SearchInput, Dropdown } from "../components/Atoms.jsx";

export function PassengerView({ routes, signals, onSignal, onBump, sessionId, t }) {
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch,   setToSearch]   = useState("");
  const [showFrom,   setShowFrom]   = useState(false);
  const [showTo,     setShowTo]     = useState(false);
  const [selRoute,   setSelRoute]   = useState(null);
  const [selTags,    setSelTags]    = useState([]);
  const [step,       setStep]       = useState("route");
  const [mySignal,   setMySignal]   = useState(null);
  const [canBump,    setCanBump]    = useState(false);

  const fromOptions = [...new Set(routes.map(r => r.from))].sort();
  const toOptions   = [...new Set(routes.map(r => r.to))].sort();
  const filtFrom = fromOptions.filter(f => f.toLowerCase().includes(fromSearch.toLowerCase())).slice(0, 7);
  const filtTo   = toOptions.filter(f => f.toLowerCase().includes(toSearch.toLowerCase())).slice(0, 7);
  const canProceed = fromSearch.trim().length > 1 && toSearch.trim().length > 1;

  useEffect(() => {
    if (!mySignal) return;
    const check = () => setCanBump(now() - mySignal.lastBump >= BUMP_INTERVAL);
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, [mySignal]);

  function pickFrom(val) {
    setFromSearch(val); setShowFrom(false); setSelRoute(null);
    const match = routes.find(r => r.from === val && (!toSearch || r.to === toSearch));
    if (match) { setSelRoute(match); }
    else if (!toSearch) {
      const first = routes.find(r => r.from === val);
      if (first) { setToSearch(first.to); setSelRoute(first); }
    }
  }

  function pickTo(val) {
    setToSearch(val); setShowTo(false);
    setSelRoute(routes.find(r => r.from === fromSearch && r.to === val) || null);
  }

  function submit(type) {
    const routeId = selRoute?.id || `u-${fromSearch.trim()}-${toSearch.trim()}`.replace(/\s+/g, "_");
    const routeMeta = selRoute || { id: routeId, from: fromSearch.trim(), to: toSearch.trim(), rank: "New route" };
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
    setStep("route"); setFromSearch(""); setToSearch("");
    setSelRoute(null); setSelTags([]); setMySignal(null); setCanBump(false);
  }

  const allRoutes = [...routes, ...(mySignal?.routeMeta && !routes.find(r => r.id === mySignal?.routeId) ? [mySignal.routeMeta] : [])];
  const statsList   = computeRouteStats(signals, allRoutes);
  const previewStats = selRoute ? statsList.find(s => s.routeId === selRoute.id) : null;
  const currentStats = mySignal  ? statsList.find(s => s.routeId === mySignal.routeId) : null;

  // ── DONE SCREEN ──────────────────────────────────────────────────────────────
  if (step === "done" && mySignal) {
    const total    = currentStats?.total        ?? 1;
    const waiting  = currentStats?.stillWaiting ?? 1;
    const urgency  = currentStats?.urgency      ?? 1;
    const minsLeft = Math.max(0, Math.round((SIGNAL_TTL - (now() - mySignal.ts)) / 60000));
    const bumpWait = Math.max(0, Math.ceil((BUMP_INTERVAL - (now() - mySignal.lastBump)) / 60000));

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 90px)" }}>
        <div
          style={{
            maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
            padding: "20px 16px 32px", flex: 1,
            animation: "ks-fadeUp .25s ease both",
          }}
        >
          {/* Status pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: t.accent + "18", border: `1px solid ${t.accent}44`,
              borderRadius: 99, padding: "5px 14px",
            }}>
              <Dot color={t.accent} pulse size={7} />
              <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700, color: t.accent, letterSpacing: "0.06em" }}>
                SIGNAL ACTIVE
              </span>
            </div>
          </div>

          {/* Route chip */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.surface, border: `1px solid ${t.border2}`,
              borderRadius: 10, padding: "8px 16px",
            }}>
              <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", fontWeight: 700, color: t.fg }}>
                {mySignal.routeMeta?.from}
              </span>
              <span style={{ color: t.muted, fontSize: 12 }}>→</span>
              <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", fontWeight: 700, color: t.fg }}>
                {mySignal.routeMeta?.to}
              </span>
            </div>
          </div>

          {/* Big counters */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border2}`,
            borderRadius: 16, overflow: "hidden", marginBottom: 12,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {[
                { num: total,   label: "Reported",    sub: "no/few kombis", color: t.fg     },
                { num: waiting, label: "Still waiting", sub: "right now",   color: t.accent },
              ].map(({ num, label, sub, color }) => (
                <div key={label} style={{
                  padding: "22px 12px 18px", textAlign: "center",
                  borderRight: `1px solid ${t.border}`,
                }}>
                  <div style={{
                    fontFamily: "var(--ks-display)", fontSize: "var(--fs-3xl)",
                    fontWeight: 800, color, lineHeight: 1, animation: "ks-scaleIn .3s ease",
                  }}>
                    {num}
                  </div>
                  <div style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", fontWeight: 600, color: t.fgSub, marginTop: 5 }}>{label}</div>
                  <div style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 16px 14px" }}>
              <UrgencyBar value={urgency} t={t} />
              <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted, marginTop: 6, textAlign: "right" }}>
                Signal expires in ~{minsLeft} min
              </p>
            </div>
          </div>

          {/* Kombis arrived button */}
          <button
            onClick={reset}
            style={{
              width: "100%", padding: "13px", marginBottom: 10,
              background: t.green + "18", border: `1.5px solid ${t.green}55`,
              borderRadius: 12, color: t.green,
              fontFamily: "var(--ks-body)", fontWeight: 700, fontSize: "var(--fs-base)",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            Kombis arrived — done!
          </button>

          {/* Still waiting */}
          <Button variant="accent" onClick={bump} disabled={!canBump} t={t}>
            {canBump ? "Still waiting — tap to update" : `Still waiting  (available in ${bumpWait}m)`}
          </Button>

          <p style={{
            fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", color: t.muted,
            lineHeight: 1.7, marginTop: 16, textAlign: "center",
          }}>
            Tap <strong style={{ color: t.fgSub }}>Still waiting</strong> every few minutes so drivers see real demand. Tap <strong style={{ color: t.green }}>Kombis arrived</strong> when you board — this removes false signals.
          </p>
        </div>
      </div>
    );
  }

  // ── ROUTE SELECTION SCREEN ────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 90px)" }}>
      <div
        style={{
          maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
          padding: "20px 16px 40px", flex: 1,
          animation: "ks-fadeUp .2s ease both",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: "var(--ks-display)", fontSize: "var(--fs-xl)", fontWeight: 800,
            color: t.fg, letterSpacing: "-0.02em", marginBottom: 3,
          }}>
            Signal your route
          </h1>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted, lineHeight: 1.5 }}>
            Tell drivers where kombis are needed right now
          </p>
        </div>

        {/* Route card */}
        <div style={{
          background: t.surface, border: `1px solid ${t.border2}`,
          borderRadius: 16, padding: "16px", marginBottom: 16,
        }}>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 600, color: t.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            Your route
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* FROM */}
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
                  addLabel={fromSearch.trim().length > 1 && !fromOptions.includes(fromSearch.trim()) ? fromSearch.trim() : null}
                  t={t}
                />
              )}
            </SearchInput>

            {/* Arrow connector */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 2px" }}>
              <div style={{ flex: 1, height: 1, background: t.border }} />
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: t.surfaceB, border: `1px solid ${t.border2}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: t.muted, flexShrink: 0,
              }}>↓</div>
              <div style={{ flex: 1, height: 1, background: t.border }} />
            </div>

            {/* TO */}
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
                  addLabel={toSearch.trim().length > 1 && !toOptions.includes(toSearch.trim()) ? toSearch.trim() : null}
                  t={t}
                />
              )}
            </SearchInput>
          </div>
        </div>

        {/* Live preview for this route */}
        {previewStats && (
          <div style={{
            background: t.accent + "10", border: `1px solid ${t.accent}33`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            animation: "ks-fadeIn .2s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Dot color={t.accent} pulse size={7} />
              <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.fg, fontWeight: 600 }}>
                {previewStats.stillWaiting} already waiting
              </span>
            </div>
            <span style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
              {previewStats.total} report{previewStats.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Context tags */}
        {canProceed && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 600,
              color: t.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10,
            }}>
              Add context <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TAGS.map(tag => {
                const on = selTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => setSelTags(s => on ? s.filter(x => x !== tag.id) : [...s, tag.id])}
                    style={{
                      padding: "8px 14px",
                      background: on ? t.accent : t.surface,
                      border: `1.5px solid ${on ? t.accent : t.border2}`,
                      borderRadius: 99, color: on ? t.accentFg : t.fgSub,
                      fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)",
                      cursor: "pointer", fontWeight: on ? 700 : 400, transition: "all .15s",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => submit("none")}
              style={{
                padding: "17px", background: t.red, border: "none", borderRadius: 14,
                color: "#fff", fontFamily: "var(--ks-body)", fontWeight: 700,
                fontSize: "var(--fs-md)", cursor: "pointer", transition: "opacity .15s",
                boxShadow: `0 4px 16px ${t.red}44`,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = ".87"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              No kombis at rank
            </button>
            <button
              onClick={() => submit("few")}
              style={{
                padding: "17px", background: t.surface,
                border: `1.5px solid ${t.border2}`, borderRadius: 14,
                color: t.fg, fontFamily: "var(--ks-body)", fontWeight: 700,
                fontSize: "var(--fs-md)", cursor: "pointer", transition: "opacity .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = ".7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Few kombis — long wait
            </button>
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "20px 16px",
            background: t.surface, border: `1px dashed ${t.border2}`,
            borderRadius: 14,
          }}>
            <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)", color: t.muted }}>
              Select your FROM and TO suburb above to signal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}