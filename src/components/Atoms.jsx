// ─── ATOM COMPONENTS ─────────────────────────────────────────────────────────
// Small, stateless building blocks used across views.
// All receive the active theme object as prop `t`.

// Pulsing live indicator dot
export function Dot({ color, pulse, size = 7 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display    : "inline-block",
        width      : size,
        height     : size,
        borderRadius: "50%",
        background : color,
        flexShrink : 0,
        animation  : pulse ? "ks-pulse 1.8s ease-in-out infinite" : "none",
      }}
    />
  );
}

// Horizontal progress bar showing urgency level
export function UrgencyBar({ value, max = 10, t }) {
  const pct   = Math.min(100, (value / max) * 100);
  const color = value >= 7 ? t.red : value >= 4 ? t.accent : t.green;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        height      : 3,
        background  : t.border2,
        borderRadius: 2,
        overflow    : "hidden",
      }}
    >
      <div
        style={{
          height      : "100%",
          width       : `${pct}%`,
          background  : color,
          borderRadius: 2,
          transition  : "width .4s ease",
        }}
      />
    </div>
  );
}

// Small pill badge — used for tags and status labels
export function Chip({ label, accent, t }) {
  return (
    <span
      style={{
        fontFamily  : "var(--ks-body)",
        fontSize    : "var(--fs-xs)",
        color       : accent || t.muted,
        border      : `1px solid ${accent || t.border2}`,
        borderRadius: 99,
        padding     : "3px 10px",
        whiteSpace  : "nowrap",
        lineHeight  : 1.4,
      }}
    >
      {label}
    </span>
  );
}

// Uppercase section label
export function SectionLabel({ children, t, style = {} }) {
  return (
    <div
      style={{
        fontFamily   : "var(--ks-body)",
        fontSize     : "var(--fs-xs)",
        fontWeight   : 600,
        color        : t.muted,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        marginBottom : 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Full-width button with consistent hover behaviour
export function Button({ children, onClick, variant = "primary", disabled, t, style = {} }) {
  const base = {
    width       : "100%",
    padding     : "16px",
    border      : "none",
    borderRadius: 12,
    fontFamily  : "var(--ks-body)",
    fontWeight  : 700,
    fontSize    : "var(--fs-md)",
    cursor      : disabled ? "not-allowed" : "pointer",
    transition  : "opacity .15s, background .15s",
    lineHeight  : 1.3,
    ...style,
  };

  const variants = {
    primary: {
      background: t.red,
      color      : "#fff",
      opacity    : disabled ? 0.45 : 1,
    },
    secondary: {
      background: t.surface,
      border     : `1.5px solid ${t.border2}`,
      color      : t.fg,
      opacity    : disabled ? 0.45 : 1,
    },
    accent: {
      background: disabled ? t.surfaceB : t.accent,
      border     : `1.5px solid ${disabled ? t.border2 : t.accent}`,
      color      : disabled ? t.muted : t.accentFg,
      opacity    : 1,
    },
    ghost: {
      background: "none",
      border     : `1.5px solid ${t.border2}`,
      color      : t.fgSub,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.82"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

// Labelled text input with autocomplete dropdown support
export function SearchInput({
  label, value, onChange, onFocus, onBlur,
  placeholder, children, t,
}) {
  return (
    <div style={{ position: "relative" }}>
      {label && (
        <label
          style={{
            display      : "block",
            fontFamily   : "var(--ks-body)",
            fontSize     : "var(--fs-xs)",
            fontWeight   : 600,
            color        : t.muted,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom : 6,
          }}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          width       : "100%",
          background  : t.surface,
          border      : `1.5px solid ${t.border2}`,
          borderRadius: 10,
          padding     : "14px 16px",
          color       : t.fg,
          fontFamily  : "var(--ks-body)",
          fontSize    : "var(--fs-base)",
          transition  : "border-color .15s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = t.accent; onFocus?.(); }}
        onBlur={e  => { e.currentTarget.style.borderColor = t.border2; setTimeout(() => onBlur?.(), 160); }}
      />
      {/* Dropdown slot */}
      {children}
    </div>
  );
}

// Dropdown list rendered below an input
export function Dropdown({ items, onSelect, addLabel, t }) {
  if (!items.length && !addLabel) return null;
  return (
    <div
      style={{
        position  : "absolute",
        top       : "calc(100% + 3px)",
        left      : 0,
        right     : 0,
        zIndex    : 300,
        background: t.surface,
        border    : `1px solid ${t.border2}`,
        borderRadius: 10,
        overflow  : "hidden",
        boxShadow : "0 8px 28px rgba(0,0,0,.22)",
        animation : "ks-scaleIn .15s ease both",
        transformOrigin: "top center",
      }}
    >
      {items.map(item => (
        <div
          key={item}
          onMouseDown={() => onSelect(item)}
          style={{
            padding    : "13px 16px",
            fontFamily : "var(--ks-body)",
            fontSize   : "var(--fs-base)",
            color      : t.fg,
            cursor     : "pointer",
            borderBottom: `1px solid ${t.border}`,
            transition : "background .12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = t.surfaceB}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {item}
        </div>
      ))}
      {addLabel && (
        <div
          onMouseDown={() => onSelect(addLabel, true)}
          style={{
            padding    : "13px 16px",
            fontFamily : "var(--ks-body)",
            fontSize   : "var(--fs-base)",
            color      : t.accent,
            fontWeight : 600,
            cursor     : "pointer",
            transition : "background .12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = t.surfaceB}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          + Use "{addLabel}"
        </div>
      )}
    </div>
  );
}