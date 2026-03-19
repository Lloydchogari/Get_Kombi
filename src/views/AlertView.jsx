// AlertView.jsx — KombiSignal alert reporting screen
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import { useState } from "react";
import { PRESET_ROUTES } from "../data/routes.js";
import { buildSignal } from "../utils/signals.js";

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;
const P  = { green: "#1DA27E", teal: "#1C8585", dark: "#074047", deep: "#15292E", pgrey: "#C8D6D8", red: "#E05252", amber: "#E8A84A" };

const ALERT_TYPES = [
  {
    id:    "traffic",
    label: "Heavy traffic",
    sub:   "Severe congestion near a rank or road",
    color: P.amber,
  },
  {
    id:    "other",
    label: "Something else",
    sub:   "Type a custom alert description",
    color: P.teal,
  },
];

const PRESET_RANKS = ["Copacabana", "Machipisa", "Fourth St", "Mbare Musika"];

function getAllSuburbs() {
  const froms = PRESET_ROUTES.map(r => r.from);
  const tos   = PRESET_ROUTES.map(r => r.to).filter(t => t !== "CBD");
  return [...new Set([...PRESET_RANKS, ...froms, ...tos])].sort();
}

export function AlertView({ onSubmit, onComplete, sessionId, t }) {
  const [alertType,    setAlertType]    = useState(null);
  const [customAlert,  setCustomAlert]  = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [done,         setDone]         = useState(false);

  const allSuburbs      = getAllSuburbs();
  const filtered        = locationInput.trim()
    ? allSuburbs.filter(s => s.toLowerCase().includes(locationInput.toLowerCase()))
    : [];
  const effectiveLocation = locationInput.trim();

  const canSubmit =
    alertType === "traffic"
      ? Boolean(effectiveLocation)
      : alertType === "other"
        ? Boolean(customAlert.trim() && effectiveLocation)
        : false;

  function submit() {
    if (!canSubmit) return;
    const routeId   = `alert-${effectiveLocation.replace(/\s+/g, "_")}`;
    const routeMeta = { id: routeId, from: effectiveLocation, to: "ALERT", rank: effectiveLocation };
    const sig = buildSignal({
      routeId, type: "none",
      tags: [alertType === "other" ? customAlert.trim() : alertType],
      sessionId, routeMeta,
    });
    onSubmit(sig);
    setDone(true);
    setTimeout(() => onComplete?.(), 1400);
  }

  // ── Success screen ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <>
        <style>{STYLES(t)}</style>
        <div className="av-root">
          <div className="av-success" style={{ animation: "avFadeUp .5s ease both" }}>

            {/* Check circle */}
            <div className="av-check-wrap">
              <div className="av-check-ring av-check-ring--outer" />
              <div className="av-check-ring av-check-ring--inner" />
              <div className="av-check-circle">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
                  stroke={P.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h2 className="av-success-title">Alert submitted</h2>
            <p className="av-success-sub">
              Drivers near <strong style={{ color: t.fg }}>{effectiveLocation}</strong> have been notified
            </p>

            <div className="av-success-pill">
              <span className="av-sdot" />
              <span className="av-success-pill-text">Broadcasting now</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES(t)}</style>
      <div className="av-root">
        <div className="av-inner">

          {/* Header */}
          <div className="av-header">
            <div className="av-eyebrow">
              <div className="av-eyebrow-line" />
              <span className="av-eyebrow-text">Quick report</span>
            </div>
            <h1 className="av-h1">Report an alert</h1>
            <p className="av-sub">Help drivers avoid trouble spots in real time</p>
          </div>

          {/* Step 1 — Alert type */}
          <p className="av-section-label">What are you reporting?</p>

          <div className="av-type-group">
            {ALERT_TYPES.map(a => {
              const on = alertType === a.id;
              return (
                <button
                  key={a.id}
                  className={`av-type-btn ${on ? "av-type-btn--on" : ""}`}
                  style={on ? {
                    background: a.color + "12",
                    borderColor: a.color + "88",
                  } : {}}
                  onClick={() => setAlertType(a.id)}
                >
                  {/* Accent bar on left when selected */}
                  <div
                    className="av-type-bar"
                    style={{ background: on ? a.color : "transparent" }}
                  />
                  <div className="av-type-content">
                    <div className="av-type-label" style={{ color: on ? t.fg : t.fg }}>
                      {a.label}
                    </div>
                    <div className="av-type-sub">{a.sub}</div>
                  </div>
                  {/* Selection indicator */}
                  <div className="av-type-indicator"
                    style={{
                      borderColor: on ? a.color : t.border,
                      background:  on ? a.color : "transparent",
                    }}
                  >
                    {on && (
                      <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
                        <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom description — only for "other" */}
          {alertType === "other" && (
            <div className="av-custom-wrap" style={{ animation: "avFadeUp .2s ease both" }}>
              <p className="av-section-label" style={{ marginTop: 0 }}>Describe the issue</p>
              <textarea
                className="av-textarea"
                value={customAlert}
                onChange={e => setCustomAlert(e.target.value)}
                placeholder="e.g. Road blocked near Fourth St rank…"
                rows={3}
              />
            </div>
          )}

          {/* Step 2 — Location */}
          <p className="av-section-label">Where is this happening?</p>

          <div className="av-location-wrap">
            <input
              className="av-input"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              placeholder="Type suburb, rank or area…"
              onFocus={e  => e.currentTarget.style.borderColor = P.teal}
              onBlur={e   => e.currentTarget.style.borderColor = t.border}
            />

            {/* Location suggestion grid */}
            {locationInput.trim() && filtered.length > 0 && (
              <div className="av-suggestions" style={{ animation: "avFadeIn .15s ease both" }}>
                {filtered.slice(0, 12).map(s => {
                  const on = locationInput === s;
                  return (
                    <button
                      key={s}
                      className={`av-sug-btn ${on ? "av-sug-btn--on" : ""}`}
                      onClick={() => setLocationInput(s)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className={`av-submit ${canSubmit ? "av-submit--active" : "av-submit--disabled"}`}
            onClick={submit}
            disabled={!canSubmit}
          >
            Submit alert
            {canSubmit && (
              <span className="av-submit-arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            )}
          </button>

        </div>
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
function STYLES(t) {
  return `
    .av-root {
      min-height: calc(100vh - 88px);
      padding: clamp(16px,5vw,24px) clamp(16px,5vw,24px) 52px;
      font-family: ${SF};
      animation: avFadeUp .22s ease both;
    }
    .av-inner { max-width: 480px; margin: 0 auto; width: 100%; }

    /* eyebrow */
    .av-eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
    .av-eyebrow-line { width:20px; height:1px; background:${P.green}; }
    .av-eyebrow-text { font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:${P.green}; }

    /* header */
    .av-header { margin-bottom:26px; }
    .av-h1  { font-size:clamp(22px,6vw,28px); font-weight:700; letter-spacing:-.025em; color:${t.fg}; line-height:1.1; margin-bottom:5px; }
    .av-sub { font-size:14px; color:${t.muted}; line-height:1.5; }

    /* section labels */
    .av-section-label {
      font-size:10px; font-weight:600; color:${t.muted};
      letter-spacing:.12em; text-transform:uppercase;
      margin-bottom:10px; margin-top:22px;
    }

    /* alert type buttons */
    .av-type-group { display:flex; flex-direction:column; gap:9px; margin-bottom:6px; }
    .av-type-btn {
      display:flex; align-items:center; gap:0;
      width:100%; text-align:left;
      background:${t.surface}; border:${t.cardBorder};
      box-shadow:${t.cardShadow};
      border-radius:14px; cursor:pointer; overflow:hidden;
      transition:all .18s; padding:0;
    }
    .av-type-btn:hover { box-shadow:0 6px 20px rgba(0,0,0,0.11); }
    .av-type-btn--on   { }

    .av-type-bar {
      width:3px; align-self:stretch; flex-shrink:0;
      transition:background .18s;
    }
    .av-type-content { flex:1; padding:14px 14px; }
    .av-type-label  { font-size:14px; font-weight:700; color:${t.fg}; letter-spacing:-.01em; margin-bottom:2px; }
    .av-type-sub    { font-size:12px; color:${t.muted}; line-height:1.4; }

    .av-type-indicator {
      width:20px; height:20px; border-radius:50%;
      border:1.5px solid; flex-shrink:0;
      margin-right:14px;
      display:flex; align-items:center; justify-content:center;
      transition:all .18s;
    }

    /* custom textarea */
    .av-custom-wrap { margin-bottom:4px; }
    .av-textarea {
      width:100%; background:${t.surface}; border:1px solid ${t.border};
      border-radius:12px; padding:13px 16px; color:${t.fg};
      font-family:${SF}; font-size:14px; resize:none; outline:none;
      transition:border-color .15s; line-height:1.5;
    }
    .av-textarea:focus { border-color:${P.teal}; }
    .av-textarea::placeholder { color:${t.muted}; }

    /* location */
    .av-location-wrap { margin-bottom:22px; }
    .av-input {
      width:100%; background:${t.surface}; border:1px solid ${t.border};
      border-radius:12px; padding:13px 16px; color:${t.fg};
      font-family:${SF}; font-size:14px; outline:none;
      transition:border-color .15s; margin-bottom:10px;
    }
    .av-input::placeholder { color:${t.muted}; }

    /* suggestion grid */
    .av-suggestions {
      display:grid; grid-template-columns:1fr 1fr;
      gap:7px; max-height:220px; overflow-y:auto;
    }
    .av-sug-btn {
      padding:10px 10px; background:${t.surface};
      border:${t.cardBorder}; box-shadow:${t.cardShadow};
      border-radius:10px;
      cursor:pointer; font-family:${SF}; font-size:13px;
      color:${t.fgSub}; text-align:left;
      transition:all .13s; font-weight:400;
    }
    .av-sug-btn:hover    { box-shadow:0 4px 14px rgba(0,0,0,0.10); color:${P.teal}; }
    .av-sug-btn--on      { background:${t.fg}; border-color:${t.fg}; color:${t.bg}; font-weight:600; }

    /* submit button */
    .av-submit {
      width:100%; padding:17px 20px;
      border:none; border-radius:999px;
      font-family:${SF}; font-weight:700; font-size:15px;
      cursor:pointer; transition:all .2s;
      display:flex; align-items:center; justify-content:center; gap:10px;
    }
    .av-submit--active {
      background:${P.red}; color:#fff;
      box-shadow:0 6px 22px rgba(224,82,82,0.38);
    }
    .av-submit--active:hover  { opacity:.88; transform:translateY(-1px); box-shadow:0 10px 28px rgba(224,82,82,0.44); }
    .av-submit--active:active { transform:scale(0.986); }
    .av-submit--disabled {
      background:${t.surface}; color:${t.muted};
      border:1px solid ${t.border}; cursor:not-allowed; opacity:.6;
    }
    .av-submit-arrow { display:flex; align-items:center; }

    /* success screen */
    .av-success {
      max-width:480px; margin:0 auto; width:100%;
      padding:72px 24px; text-align:center;
    }
    .av-check-wrap {
      position:relative; width:80px; height:80px;
      margin:0 auto 24px; display:flex;
      align-items:center; justify-content:center;
    }
    .av-check-ring {
      position:absolute; border-radius:50%;
      border:1px solid rgba(29,162,126,0.2);
    }
    .av-check-ring--outer { width:80px; height:80px; animation:avRingPop .6s ease .2s both; }
    .av-check-ring--inner { width:60px; height:60px; animation:avRingPop .5s ease .1s both; }
    .av-check-circle {
      width:48px; height:48px; border-radius:50%;
      background:rgba(29,162,126,0.12);
      border:1.5px solid ${P.green};
      display:flex; align-items:center; justify-content:center;
      animation:avCheckPop .4s cubic-bezier(0.22,1,0.36,1) both;
    }
    .av-success-title {
      font-size:22px; font-weight:700; letter-spacing:-.02em;
      color:${t.fg}; margin-bottom:8px;
    }
    .av-success-sub {
      font-size:14px; color:${t.muted}; line-height:1.6;
      margin-bottom:24px;
    }
    .av-success-pill {
      display:inline-flex; align-items:center; gap:7px;
      background:rgba(29,162,126,0.10);
      border:1px solid rgba(29,162,126,0.25);
      border-radius:99px; padding:6px 16px;
    }
    .av-sdot {
      width:6px; height:6px; border-radius:50%;
      background:${P.green}; display:inline-block;
      animation:avPulse 2s ease-in-out infinite;
    }
    .av-success-pill-text { font-size:12px; font-weight:500; color:${P.green}; letter-spacing:.06em; }

    @keyframes avFadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes avFadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes avRingPop { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:scale(1)} }
    @keyframes avCheckPop{ from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
    @keyframes avPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.38;transform:scale(.75)} }

    @media(min-width:400px) { .av-suggestions { grid-template-columns:1fr 1fr 1fr; } }
  `;
}