import { Dot } from "./Atoms.jsx";

export function TopBar({ theme, onToggleTheme, mode, onSetMode, activeCount, t }) {
  return (
    <header
      style={{
        position      : "sticky",
        top           : 0,
        zIndex        : 200,
        background    : t.topBarBg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow     : t.shadow,
      }}
    >
      <div
        className="ks-page"
        style={{
          display       : "flex",
          justifyContent: "space-between",
          alignItems    : "center",
          padding       : "12px var(--space-md)",
          gap           : 10,
        }}
      >
        {/* ── Wordmark + live badge ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span
            style={{
              fontFamily  : "var(--ks-display)",
              fontSize    : "var(--fs-lg)",
              fontWeight  : 800,
              letterSpacing: "-0.02em",
              color       : t.fg,
              whiteSpace  : "nowrap",
            }}
          >
            KombiSignal
          </span>

          <div
            style={{
              display    : "flex",
              alignItems : "center",
              gap        : 5,
              background : t.surfaceB,
              border     : `1px solid ${t.border2}`,
              borderRadius: 99,
              padding    : "3px 9px",
              flexShrink : 0,
            }}
          >
            <Dot
              color={activeCount > 0 ? t.accent : t.muted}
              pulse={activeCount > 0}
              size={6}
            />
            <span
              style={{
                fontFamily : "var(--ks-body)",
                fontSize   : "var(--fs-xs)",
                fontWeight : 600,
                color      : activeCount > 0 ? t.accent : t.muted,
              }}
            >
              {activeCount} live
            </span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background  : t.surfaceB,
              border      : `1px solid ${t.border2}`,
              borderRadius: 8,
              padding     : "8px 11px",
              color       : t.fgSub,
              fontSize    : 14,
              cursor      : "pointer",
              transition  : "all .15s",
              lineHeight  : 1,
            }}
          >
            {theme === "dark" ? "☀" : "◑"}
          </button>

          {/* Mode toggle pill */}
          <div
            style={{
              display    : "flex",
              background : t.surfaceB,
              border     : `1px solid ${t.border2}`,
              borderRadius: 10,
              padding    : 3,
              gap        : 3,
            }}
          >
            {[["passenger", "Passenger"], ["driver", "Driver"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => onSetMode(key)}
                aria-pressed={mode === key}
                style={{
                  padding     : "7px 13px",
                  background  : mode === key ? t.fg : "none",
                  border      : "none",
                  borderRadius: 8,
                  color       : mode === key ? t.bg : t.muted,
                  fontFamily  : "var(--ks-body)",
                  fontSize    : "var(--fs-sm)",
                  fontWeight  : mode === key ? 700 : 500,
                  cursor      : "pointer",
                  transition  : "all .15s",
                  whiteSpace  : "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}