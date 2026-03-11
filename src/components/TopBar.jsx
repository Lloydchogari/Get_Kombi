import { Dot } from "./Atoms.jsx";

export function TopBar({ theme, onToggleTheme, mode, onSetMode, activeCount, t, onHome }) {
  return (
    <header
      style={{
        position           : "sticky",
        top                : 0,
        zIndex             : 200,
        background         : t.topBarBg,
        backdropFilter     : "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow          : t.shadow,
      }}
    >
      {/* Row 1: logo + wordmark + live badge + theme toggle */}
      <div
        style={{
          display        : "flex",
          justifyContent : "space-between",
          alignItems     : "center",
          padding        : "10px 16px 6px",
          maxWidth       : "var(--content-max)",
          margin         : "0 auto",
        }}
      >
        {/* Logo + wordmark — tapping goes back to home screen */}
        <button
          onClick={onHome}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, padding: 0,
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="14" width="36" height="20" rx="4" fill={t.accentFg} opacity="0.9"/>
              <circle cx="10" cy="34" r="4" fill={t.accent} stroke={t.accentFg} strokeWidth="2"/>
              <circle cx="30" cy="34" r="4" fill={t.accent} stroke={t.accentFg} strokeWidth="2"/>
              <rect x="6"  y="17" width="12" height="7" rx="1" fill={t.accent} opacity="0.7"/>
              <rect x="21" y="17" width="10" height="7" rx="1" fill={t.accent} opacity="0.5"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "var(--ks-display)", fontSize: "var(--fs-lg)", fontWeight: 800,
            letterSpacing: "-0.02em", color: t.fg,
          }}>
            KombiSignal
          </span>
        </button>

        {/* Right side: live badge + theme toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: t.surfaceB, border: `1px solid ${t.border2}`,
            borderRadius: 99, padding: "3px 8px",
          }}>
            <Dot color={activeCount > 0 ? t.accent : t.muted} pulse={activeCount > 0} size={6} />
            <span style={{
              fontFamily: "var(--ks-body)", fontSize: "var(--fs-xs)", fontWeight: 600,
              color: activeCount > 0 ? t.accent : t.muted,
            }}>
              {activeCount} live
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: t.surfaceB, border: `1px solid ${t.border2}`,
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: t.fgSub, fontSize: 14, cursor: "pointer", transition: "all .15s",
            }}
          >
            {theme === "dark" ? "☀" : "◑"}
          </button>
        </div>
      </div>

      {/* Row 2: underline tab switcher */}
      <div style={{
        display: "flex", maxWidth: "var(--content-max)",
        margin: "0 auto", padding: "0 16px",
      }}>
        {[
          { key: "passenger", label: "Passenger"     },
          { key: "driver",    label: "Driver / Owner" },
        ].map(({ key, label }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              onClick={() => onSetMode(key)}
              aria-pressed={active}
              style={{
                flex        : 1,
                padding     : "8px 4px 10px",
                background  : "none",
                border      : "none",
                borderBottom: active ? `2.5px solid ${t.accent}` : "2.5px solid transparent",
                color       : active ? t.accent : t.muted,
                fontFamily  : "var(--ks-body)",
                fontSize    : "var(--fs-sm)",
                fontWeight  : active ? 700 : 500,
                cursor      : "pointer",
                transition  : "all .18s",
                whiteSpace  : "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </header>
  );
}