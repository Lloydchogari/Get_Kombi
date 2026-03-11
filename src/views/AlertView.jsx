import { useState } from "react";
import { PRESET_ROUTES } from "../data/routes.js";
import { buildSignal }   from "../utils/signals.js";

// Only two alert types — ZESA removed as it's not actionable for routing
const ALERT_TYPES = [
  {
    id   : "traffic",
    label: "Heavy traffic",
    sub  : "Severe congestion near a rank or road",
    color: "#e8c547",
  },
  {
    id   : "council",
    label: "Council / ZRP activity",
    sub  : "Operations or roadblock near a rank",
    color: "#e05555",
  },
];

// All preset ranks + every unique suburb from the routes list
const PRESET_RANKS = ["Copacabana", "Machipisa", "Fourth St", "Mbare Musika"];

function getAllSuburbs() {
  const froms = PRESET_ROUTES.map(r => r.from);
  const tos   = PRESET_ROUTES.map(r => r.to).filter(t => t !== "CBD");
  return [...new Set([...PRESET_RANKS, ...froms, ...tos])].sort();
}

export function AlertView({ onSubmit, onBack, sessionId, t }) {
  const [alertType,    setAlertType]    = useState(null);
  const [location,     setLocation]     = useState(null);  // selected preset
  const [customLoc,    setCustomLoc]    = useState("");     // typed custom location
  const [showCustom,   setShowCustom]   = useState(false);  // toggle custom input
  const [locSearch,    setLocSearch]    = useState("");      // filter suburbs
  const [done,         setDone]         = useState(false);

  const allSuburbs = getAllSuburbs();
  const filtered   = allSuburbs.filter(s =>
    s.toLowerCase().includes(locSearch.toLowerCase())
  );

  const effectiveLocation = showCustom
    ? customLoc.trim()
    : location;

  const canSubmit = alertType && effectiveLocation;

  function submit() {
    if (!canSubmit) return;
    const loc       = effectiveLocation;
    const routeId   = `alert-${loc.replace(/\s+/g, "_")}`;
    const routeMeta = { id: routeId, from: loc, to: "ALERT", rank: loc };
    const sig = buildSignal({
      routeId,
      type     : "none",
      tags     : [alertType],
      sessionId,
      routeMeta,
    });
    onSubmit(sig);
    setDone(true);
    setTimeout(onBack, 2200);
  }

  // ── Success screen ──
  if (done) {
    return (
      <div style={{
        maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
        padding: "72px 24px", textAlign: "center",
        animation: "ks-fadeUp 0.5s ease both",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: t.green + "22", border: `2px solid ${t.green}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          fontFamily: "var(--ks-body)", fontSize: 22, color: t.green,
          fontWeight: 700,
        }}>
          ✓
        </div>
        <h2 style={{
          fontFamily: "var(--ks-display)", fontSize: 22, fontWeight: 800,
          color: t.fg, marginBottom: 8,
        }}>
          Alert submitted
        </h2>
        <p style={{ fontFamily: "var(--ks-body)", fontSize: 14, color: t.muted }}>
          Drivers near {effectiveLocation} have been notified
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "var(--content-max)", margin: "0 auto", width: "100%",
      padding: "20px 16px 48px",
      animation: "ks-fadeUp 0.5s ease both",
    }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--ks-body)", fontSize: 13, color: t.muted,
          padding: "0 0 22px", display: "flex", alignItems: "center", gap: 6,
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "var(--ks-display)", fontSize: "var(--fs-xl)",
          fontWeight: 800, color: t.fg, letterSpacing: "-0.02em", marginBottom: 4,
        }}>
          Report an alert
        </h1>
        <p style={{ fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)", color: t.muted }}>
          Quick report — helps drivers avoid trouble spots
        </p>
      </div>

      {/* ── Step 1: Alert type ── */}
      <p style={{
        fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700,
        color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
      }}>
        What are you reporting?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
        {ALERT_TYPES.map(a => {
          const on = alertType === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setAlertType(a.id)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "15px 16px", width: "100%", textAlign: "left",
                background: on ? a.color + "14" : t.surface,
                border: `1.5px solid ${on ? a.color : t.border2}`,
                borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {/* Colour dot — replaces icon */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: on ? a.color : t.border2,
                flexShrink: 0, transition: "background 0.2s",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)",
                  fontWeight: 700, color: t.fg,
                }}>
                  {a.label}
                </div>
                <div style={{
                  fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)",
                  color: t.muted, marginTop: 2,
                }}>
                  {a.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Step 2: Location ── */}
      <p style={{
        fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 700,
        color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
      }}>
        Where is this happening?
      </p>

      {/* Toggle: preset vs custom */}
      <div style={{
        display: "flex", background: t.surfaceB,
        border: `1px solid ${t.border2}`, borderRadius: 10,
        padding: 3, gap: 3, marginBottom: 14,
      }}>
        {[
          { key: false, label: "Select area"    },
          { key: true,  label: "Type location"  },
        ].map(({ key, label }) => (
          <button
            key={String(key)}
            onClick={() => { setShowCustom(key); setLocation(null); setCustomLoc(""); }}
            style={{
              flex: 1, padding: "8px 4px",
              background: showCustom === key ? t.fg : "none",
              border: "none", borderRadius: 8,
              color: showCustom === key ? t.bg : t.muted,
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)",
              fontWeight: showCustom === key ? 700 : 500,
              cursor: "pointer", transition: "all 0.18s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Preset suburb selector */}
      {!showCustom && (
        <div style={{ marginBottom: 24 }}>
          {/* Search filter */}
          <input
            value={locSearch}
            onChange={e => setLocSearch(e.target.value)}
            placeholder="Search suburb or rank…"
            style={{
              width: "100%", background: t.surface,
              border: `1.5px solid ${t.border2}`, borderRadius: 10,
              padding: "11px 14px", color: t.fg,
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)",
              marginBottom: 10, transition: "border-color 0.15s",
            }}
            onFocus={e  => e.currentTarget.style.borderColor = t.accent}
            onBlur={e   => e.currentTarget.style.borderColor = t.border2}
          />

          {/* Suburb grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 7, maxHeight: 240, overflowY: "auto",
          }}>
            {filtered.slice(0, 30).map(s => {
              const on = location === s;
              return (
                <button
                  key={s}
                  onClick={() => setLocation(s)}
                  style={{
                    padding: "10px 8px",
                    background: on ? t.fg : t.surface,
                    border: `1.5px solid ${on ? t.fg : t.border2}`,
                    borderRadius: 9, cursor: "pointer",
                    fontFamily: "var(--ks-body)", fontSize: "var(--fs-sm)",
                    fontWeight: on ? 700 : 400,
                    color: on ? t.bg : t.fgSub,
                    transition: "all 0.15s", textAlign: "center",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {filtered.length > 30 && (
            <p style={{
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)",
              color: t.muted, marginTop: 8, textAlign: "center",
            }}>
              {filtered.length - 30} more — type to filter
            </p>
          )}
        </div>
      )}

      {/* Custom location input */}
      {showCustom && (
        <div style={{ marginBottom: 24 }}>
          <input
            value={customLoc}
            onChange={e => setCustomLoc(e.target.value)}
            placeholder="e.g. Harare Drive near Chicken Inn…"
            style={{
              width: "100%", background: t.surface,
              border: `1.5px solid ${t.border2}`, borderRadius: 10,
              padding: "14px 16px", color: t.fg,
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-base)",
              transition: "border-color 0.15s",
            }}
            onFocus={e  => e.currentTarget.style.borderColor = t.accent}
            onBlur={e   => e.currentTarget.style.borderColor = t.border2}
          />
          <p style={{
            fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)",
            color: t.muted, marginTop: 7,
          }}>
            Be as specific as you like — street, landmark, or area name
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          width: "100%", padding: "17px",
          background: canSubmit ? t.red : t.surface,
          border: `1.5px solid ${canSubmit ? t.red : t.border2}`,
          borderRadius: 14,
          cursor: canSubmit ? "pointer" : "not-allowed",
          fontFamily: "var(--ks-body)", fontWeight: 700, fontSize: "var(--fs-md)",
          color: canSubmit ? "#ffffff" : t.muted,
          transition: "all 0.25s",
          boxShadow: canSubmit ? `0 4px 18px ${t.red}44` : "none",
        }}
      >
        Submit alert
      </button>
    </div>
  );
}