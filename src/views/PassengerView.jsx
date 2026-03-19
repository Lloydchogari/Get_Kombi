// PassengerView.jsx — KombiSignal passenger signal screen
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import { useState, useEffect } from "react";
import { TAGS, SIGNAL_TTL, BUMP_INTERVAL } from "../data/routes.js";
import { now, computeRouteStats, buildSignal } from "../utils/signals.js";

const SF  = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;
const P   = { green: "#1DA27E", teal: "#1C8585", dark: "#074047", deep: "#15292E", pgrey: "#C8D6D8", red: "#E05252", amber: "#E8A84A" };

// ── Local Dropdown ─────────────────────────────────────────────────────────────
function KsDropdown({ items, onSelect, addLabel, t }) {
  if (!items.length && !addLabel) return null;
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
      zIndex: 300, background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12, overflow: "hidden",
      boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
      animation: "pvScaleIn .15s ease both",
      transformOrigin: "top center",
    }}>
      {items.map(item => (
        <div key={item} onMouseDown={() => onSelect(item)} style={{
          padding: "13px 16px", fontFamily: SF, fontSize: 14,
          color: t.fg, cursor: "pointer",
          borderBottom: `1px solid ${t.border}`,
          transition: "background .1s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = t.surfaceB}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >{item}</div>
      ))}
      {addLabel && (
        <div onMouseDown={() => onSelect(addLabel, true)} style={{
          padding: "13px 16px", fontFamily: SF, fontSize: 14,
          color: P.green, fontWeight: 600, cursor: "pointer",
          transition: "background .1s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = t.surfaceB}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >+ Use "{addLabel}"</div>
      )}
    </div>
  );
}

// ── Urgency bar ────────────────────────────────────────────────────────────────
function UrgBar({ value, t }) {
  const pct = Math.min(100, (value / 10) * 100);
  const color = value >= 7 ? P.red : value >= 4 ? P.amber : P.green;
  return (
    <div style={{ height: 3, background: t.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width .4s ease" }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PassengerView({ routes, signals, onSignal, onBump, sessionId, onDone, t }) {
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
  const filtFrom    = fromOptions.filter(f => f.toLowerCase().includes(fromSearch.toLowerCase())).slice(0, 7);
  const filtTo      = toOptions.filter(f => f.toLowerCase().includes(toSearch.toLowerCase())).slice(0, 7);
  const canProceed  = fromSearch.trim().length > 1 && toSearch.trim().length > 1;

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
    if (match) setSelRoute(match);
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
    const routeId   = selRoute?.id || `u-${fromSearch.trim()}-${toSearch.trim()}`.replace(/\s+/g, "_");
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

  const allRoutes    = [...routes, ...(mySignal?.routeMeta && !routes.find(r => r.id === mySignal?.routeId) ? [mySignal.routeMeta] : [])];
  const statsList    = computeRouteStats(signals, allRoutes);
  const previewStats = selRoute  ? statsList.find(s => s.routeId === selRoute.id)    : null;
  const currentStats = mySignal  ? statsList.find(s => s.routeId === mySignal.routeId) : null;

  // ─────────────────────────────────────────────────────────────────────────────
  // DONE SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === "done" && mySignal) {
    const total    = currentStats?.total        ?? 1;
    const waiting  = currentStats?.stillWaiting ?? 1;
    const urgency  = currentStats?.urgency      ?? 1;
    const minsLeft = Math.max(0, Math.round((SIGNAL_TTL - (now() - mySignal.ts)) / 60000));
    const bumpWait = Math.max(0, Math.ceil((BUMP_INTERVAL - (now() - mySignal.lastBump)) / 60000));

    return (
      <>
        <style>{STYLES(t)}</style>
        <div className="pv-root">
          <div className="pv-inner" style={{ animation: "pvFadeUp .25s ease both" }}>

            {/* Signal active pill */}
            <div className="pv-center" style={{ marginBottom: 22 }}>
              <div className="pv-active-pill">
                <span className="pv-live-dot" />
                <span className="pv-active-text">Signal active</span>
              </div>
            </div>

            {/* Route pill */}
            <div className="pv-center" style={{ marginBottom: 24 }}>
              <div className="pv-route-pill">
                <span className="pv-route-name">{mySignal.routeMeta?.from}</span>
                <span className="pv-route-arrow">→</span>
                <span className="pv-route-name">{mySignal.routeMeta?.to}</span>
              </div>
            </div>

            {/* Counter card */}
            <div className="pv-counter-card">
              <div className="pv-counter-grid">
                <div className="pv-counter-cell" style={{ borderRight: `1px solid ${t.border}` }}>
                  <div className="pv-counter-num" style={{ color: t.fg }}>{total}</div>
                  <div className="pv-counter-label">Reported</div>
                  <div className="pv-counter-sub">no/few kombis</div>
                </div>
                <div className="pv-counter-cell">
                  <div className="pv-counter-num" style={{ color: P.green }}>{waiting}</div>
                  <div className="pv-counter-label">Still waiting</div>
                  <div className="pv-counter-sub">right now</div>
                </div>
              </div>
              <div style={{ padding: "0 16px 14px" }}>
                <UrgBar value={urgency} t={t} />
                <p className="pv-expires">Signal expires in ~{minsLeft} min</p>
              </div>
            </div>

            {/* Kombis arrived */}
            <button
              className="pv-btn-arrived"
              onClick={() => { reset(); onDone?.(); }}
            >
              Kombis arrived — done!
            </button>

            {/* Still waiting bump */}
            <button
              className={`pv-btn-bump ${canBump ? "pv-btn-bump--active" : "pv-btn-bump--disabled"}`}
              onClick={bump}
              disabled={!canBump}
            >
              {canBump
                ? "Still waiting — tap to update"
                : `Still waiting  (available in ${bumpWait}m)`}
            </button>

            <p className="pv-hint">
              Tap <strong>Still waiting</strong> every few minutes so drivers see real demand.
              Tap <strong>Kombis arrived</strong> when you board to remove false signals.
            </p>

          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ROUTE SELECTION SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES(t)}</style>
      <div className="pv-root">
        <div className="pv-inner" style={{ animation: "pvFadeUp .2s ease both" }}>

          {/* Header */}
          <div className="pv-header">
            <h1 className="pv-h1">Signal your route</h1>
            <p className="pv-sub">Tell drivers where kombis are needed right now</p>
          </div>

          {/* Route card */}
          <div className="pv-card" style={{ marginBottom: 14 }}>
            <p className="pv-card-label">Your route</p>

            {/* FROM input */}
            <div style={{ position: "relative", marginBottom: 0 }}>
              <label className="pv-input-label">From</label>
              <input
                className="pv-input"
                value={fromSearch}
                onChange={e => { setFromSearch(e.target.value); setShowFrom(true); setSelRoute(null); }}
                onFocus={() => setShowFrom(true)}
                onBlur={() => setTimeout(() => setShowFrom(false), 160)}
                placeholder="e.g. Southlands"
              />
              {showFrom && fromSearch.length > 0 && (
                <KsDropdown
                  items={filtFrom}
                  onSelect={pickFrom}
                  addLabel={fromSearch.trim().length > 1 && !fromOptions.includes(fromSearch.trim()) ? fromSearch.trim() : null}
                  t={t}
                />
              )}
            </div>

            {/* Arrow connector */}
            <div className="pv-connector">
              <div className="pv-connector-line" />
              <div className="pv-connector-dot">↓</div>
              <div className="pv-connector-line" />
            </div>

            {/* TO input */}
            <div style={{ position: "relative" }}>
              <label className="pv-input-label">To</label>
              <input
                className="pv-input"
                value={toSearch}
                onChange={e => { setToSearch(e.target.value); setShowTo(true); setSelRoute(null); }}
                onFocus={() => setShowTo(true)}
                onBlur={() => setTimeout(() => setShowTo(false), 160)}
                placeholder="e.g. CBD"
              />
              {showTo && toSearch.length > 0 && (
                <KsDropdown
                  items={filtTo}
                  onSelect={pickTo}
                  addLabel={toSearch.trim().length > 1 && !toOptions.includes(toSearch.trim()) ? toSearch.trim() : null}
                  t={t}
                />
              )}
            </div>
          </div>

          {/* Live preview strip */}
          {previewStats && (
            <div className="pv-preview-strip" style={{ animation: "pvFadeIn .2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="pv-live-dot" />
                <span className="pv-preview-count">{previewStats.stillWaiting} already waiting</span>
              </div>
              <span className="pv-preview-reports">
                {previewStats.total} report{previewStats.total !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Context tags */}
          {canProceed && (
            <div style={{ marginBottom: 20 }}>
              <p className="pv-section-label">
                Add context <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TAGS.map(tag => {
                  const on = selTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setSelTags(s => on ? s.filter(x => x !== tag.id) : [...s, tag.id])}
                      className={`pv-tag ${on ? "pv-tag--on" : ""}`}
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
              <button className="pv-btn-signal-none" onClick={() => submit("none")}>
                No kombis at rank
              </button>
              <button className="pv-btn-signal-few" onClick={() => submit("few")}>
                Few kombis — long wait
              </button>
            </div>
          ) : (
            <div className="pv-placeholder">
              <p className="pv-placeholder-text">
                Select your From and To suburb above to signal
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
function STYLES(t) {
  return `
    .pv-root {
      display: flex; flex-direction: column;
      min-height: calc(100vh - 90px);
      padding: 14px 16px;
      font-family: ${SF};
    }
    .pv-inner {
      max-width: 480px; margin: 0 auto; width: 100%;
      padding: 16px 0 48px; flex: 1;
    }

    /* header */
    .pv-header { margin-bottom: 20px; }
    .pv-h1 {
      font-size: clamp(20px,5.5vw,24px); font-weight: 700;
      color: ${t.fg}; letter-spacing: -0.025em; margin-bottom: 4px; line-height: 1.1;
    }
    .pv-sub { font-size: 14px; color: ${t.muted}; line-height: 1.5; }

    /* card */
    .pv-card {
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 18px; padding: 16px;
    }
    .pv-card-label {
      font-size: 10px; font-weight: 600; color: ${t.muted};
      letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px;
    }

    /* inputs */
    .pv-input-label {
      display: block; font-size: 11px; font-weight: 600;
      color: ${t.muted}; letter-spacing: 0.07em;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .pv-input {
      width: 100%; background: ${t.surfaceB};
      border: 1px solid ${t.border};
      border-radius: 12px; padding: 13px 16px;
      color: ${t.fg}; font-family: ${SF}; font-size: 14px;
      outline: none; transition: border-color .15s;
    }
    .pv-input:focus { border-color: ${P.teal}; }

    /* connector */
    .pv-connector {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 2px;
    }
    .pv-connector-line { flex: 1; height: 1px; background: ${t.border}; }
    .pv-connector-dot {
      width: 28px; height: 28px; border-radius: 50%;
      background: ${t.surfaceB}; border: 1px solid ${t.border};
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; color: ${t.muted}; flex-shrink: 0;
    }

    /* live preview strip */
    .pv-preview-strip {
      background: rgba(29,162,126,0.09);
      border: 1px solid rgba(29,162,126,0.22);
      border-radius: 12px; padding: 10px 14px;
      margin-bottom: 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .pv-live-dot {
      display: inline-block; width: 7px; height: 7px;
      border-radius: 50%; background: ${P.green};
      flex-shrink: 0; animation: pvPulse 1.8s ease-in-out infinite;
    }
    .pv-preview-count { font-size: 14px; font-weight: 600; color: ${t.fg}; }
    .pv-preview-reports { font-size: 12px; color: ${t.muted}; }

    /* section label */
    .pv-section-label {
      font-size: 10px; font-weight: 600; color: ${t.muted};
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;
    }

    /* tags */
    .pv-tag {
      padding: 8px 14px;
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 99px; color: ${t.fgSub};
      font-family: ${SF}; font-size: 13px;
      cursor: pointer; font-weight: 400;
      transition: all .15s;
    }
    .pv-tag--on {
      background: ${P.teal};
      border-color: ${P.teal};
      color: #fff; font-weight: 600;
    }
    .pv-tag:hover:not(.pv-tag--on) { border-color: ${P.teal}; color: ${P.teal}; }

    /* signal buttons */
    .pv-btn-signal-none {
      width: 100%; padding: 17px;
      background: ${P.red}; border: none; border-radius: 999px;
      color: #fff; font-family: ${SF}; font-weight: 700;
      font-size: 15px; cursor: pointer; transition: opacity .15s, transform .15s;
      box-shadow: 0 6px 22px rgba(224,82,82,0.38);
    }
    .pv-btn-signal-none:hover  { opacity: .88; transform: translateY(-1px); }
    .pv-btn-signal-none:active { transform: scale(0.986); }

    .pv-btn-signal-few {
      width: 100%; padding: 17px;
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 999px;
      color: ${t.fg}; font-family: ${SF}; font-weight: 600;
      font-size: 15px; cursor: pointer; transition: all .15s;
    }
    .pv-btn-signal-few:hover  { border-color: ${P.teal}; color: ${P.teal}; transform: translateY(-1px); }
    .pv-btn-signal-few:active { transform: scale(0.986); }

    /* placeholder */
    .pv-placeholder {
      text-align: center; padding: 22px 16px;
      background: ${t.surface};
      border: 1px dashed ${t.border};
      border-radius: 16px;
    }
    .pv-placeholder-text { font-size: 13px; color: ${t.muted}; }

    /* done screen */
    .pv-center { display: flex; justify-content: center; }

    .pv-active-pill {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(29,162,126,0.12);
      border: 1px solid rgba(29,162,126,0.28);
      border-radius: 99px; padding: 6px 16px;
    }
    .pv-active-text {
      font-size: 12px; font-weight: 600;
      color: ${P.green}; letter-spacing: 0.06em;
    }

    .pv-route-pill {
      display: inline-flex; align-items: center; gap: 8px;
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 999px; padding: 10px 20px;
    }
    .pv-route-name { font-size: 15px; font-weight: 700; color: ${t.fg}; letter-spacing: -0.01em; }
    .pv-route-arrow { color: ${t.muted}; font-size: 12px; }

    .pv-counter-card {
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 18px; overflow: hidden;
      margin-bottom: 12px;
    }
    .pv-counter-grid { display: grid; grid-template-columns: 1fr 1fr; }
    .pv-counter-cell { padding: 22px 12px 18px; text-align: center; }
    .pv-counter-num {
      font-size: 40px; font-weight: 700;
      line-height: 1; letter-spacing: -0.03em;
      animation: pvScaleIn .3s ease;
    }
    .pv-counter-label { font-size: 13px; font-weight: 600; color: ${t.fgSub}; margin-top: 6px; }
    .pv-counter-sub   { font-size: 11px; color: ${t.muted}; margin-top: 2px; }
    .pv-expires {
      font-size: 11px; color: ${t.muted};
      margin-top: 6px; text-align: right;
    }

    .pv-btn-arrived {
      width: 100%; padding: 15px; margin-bottom: 10px;
      background: rgba(29,162,126,0.12);
      border: 1.5px solid rgba(29,162,126,0.3);
      border-radius: 999px; color: ${P.green};
      font-family: ${SF}; font-weight: 700; font-size: 15px;
      cursor: pointer; transition: all .15s;
    }
    .pv-btn-arrived:hover { background: rgba(29,162,126,0.20); transform: translateY(-1px); }
    .pv-btn-arrived:active { transform: scale(0.986); }

    .pv-btn-bump {
      width: 100%; padding: 15px;
      border-radius: 999px;
      font-family: ${SF}; font-weight: 600; font-size: 14px;
      cursor: pointer; transition: all .15s; border: 1px solid;
    }
    .pv-btn-bump--active {
      background: ${P.teal}; border-color: ${P.teal}; color: #fff;
      box-shadow: 0 4px 16px rgba(28,133,133,0.32);
    }
    .pv-btn-bump--active:hover { opacity: .88; transform: translateY(-1px); }
    .pv-btn-bump--disabled {
      background: ${t.surface}; border-color: ${t.border};
      color: ${t.muted}; cursor: not-allowed; opacity: 0.6;
    }

    .pv-hint {
      font-size: 12px; color: ${t.muted};
      line-height: 1.7; margin-top: 18px; text-align: center;
    }
    .pv-hint strong { color: ${t.fgSub}; font-weight: 600; }

    @keyframes pvFadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pvFadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes pvScaleIn   { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
    @keyframes pvScaleIn   { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes pvPulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.38;transform:scale(.75)} }
  `;
}