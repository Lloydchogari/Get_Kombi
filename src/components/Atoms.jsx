// ─── ATOM COMPONENTS ─────────────────────────────────────────────────────────
// Small, stateless building blocks used across all views.
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;
const P  = { green: "#1DA27E", teal: "#1C8585", dark: "#074047", deep: "#15292E", pgrey: "#C8D6D8", red: "#E05252", amber: "#E8A84A" };

// ── Keyframes injected once ───────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ksPulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.72)} }
  @keyframes ksScaleIn  { from{opacity:0;transform:scale(0.93) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes ksFadeIn   { from{opacity:0} to{opacity:1} }
`;

let _injected = false;
function injectKeyframes() {
  if (_injected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = KEYFRAMES;
  document.head.appendChild(el);
  _injected = true;
}

// ── Dot ───────────────────────────────────────────────────────────────────────
// Pulsing live indicator dot
export function Dot({ color, pulse, size = 7 }) {
  injectKeyframes();
  return (
    <span
      aria-hidden="true"
      style={{
        display     : "inline-block",
        width       : size,
        height      : size,
        borderRadius: "50%",
        background  : color,
        flexShrink  : 0,
        animation   : pulse ? "ksPulse 1.8s ease-in-out infinite" : "none",
      }}
    />
  );
}

// ── UrgencyBar ────────────────────────────────────────────────────────────────
// Horizontal bar showing urgency — red / amber / green mapped to palette
export function UrgencyBar({ value, max = 10, t }) {
  const pct   = Math.min(100, (value / max) * 100);
  const color = value >= 7 ? P.red : value >= 4 ? P.amber : P.green;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        height      : 3,
        background  : t.border,
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

// ── Chip ──────────────────────────────────────────────────────────────────────
// Small pill badge for tags and status labels
export function Chip({ label, accent, t }) {
  return (
    <span
      style={{
        fontFamily  : SF,
        fontSize    : 11,
        color       : accent || t.muted,
        border      : `1px solid ${accent ? accent + "55" : t.border}`,
        borderRadius: 99,
        padding     : "3px 10px",
        whiteSpace  : "nowrap",
        lineHeight  : 1.4,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </span>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
// Uppercase muted section heading
export function SectionLabel({ children, t, style = {} }) {
  return (
    <div
      style={{
        fontFamily   : SF,
        fontSize     : 10,
        fontWeight   : 600,
        color        : t.muted,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom : 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
// Full-width button — variants: primary | secondary | accent | ghost
// All buttons are now full pill-shaped (border-radius: 999px)
export function Button({ children, onClick, variant = "primary", disabled, t, style = {} }) {
  const base = {
    width       : "100%",
    padding     : "16px 20px",
    border      : "none",
    borderRadius: 999,               // full pill
    fontFamily  : SF,
    fontWeight  : 700,
    fontSize    : 15,
    cursor      : disabled ? "not-allowed" : "pointer",
    transition  : "opacity .15s, transform .15s, box-shadow .15s",
    lineHeight  : 1.3,
    display     : "flex",
    alignItems  : "center",
    justifyContent: "center",
    gap         : 8,
    ...style,
  };

  const variants = {
    primary: {
      background : P.red,
      color      : "#fff",
      opacity    : disabled ? 0.45 : 1,
      boxShadow  : disabled ? "none" : `0 6px 20px rgba(224,82,82,0.34)`,
    },
    secondary: {
      background : t.surface,
      border     : `1px solid ${t.border}`,
      color      : t.fg,
      opacity    : disabled ? 0.45 : 1,
    },
    accent: {
      background : disabled ? t.surfaceB : P.teal,
      border     : `1px solid ${disabled ? t.border : P.teal}`,
      color      : disabled ? t.muted : "#fff",
      opacity    : 1,
      boxShadow  : disabled ? "none" : `0 4px 16px rgba(28,133,133,0.30)`,
    },
    green: {
      background : disabled ? t.surfaceB : `rgba(29,162,126,0.12)`,
      border     : `1.5px solid ${disabled ? t.border : "rgba(29,162,126,0.35)"}`,
      color      : disabled ? t.muted : P.green,
      opacity    : 1,
    },
    ghost: {
      background : "transparent",
      border     : `1px solid ${t.border}`,
      color      : t.fgSub,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.opacity   = "0.84";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.opacity   = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.986)"; }}
      onMouseUp={e   => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
    >
      {children}
    </button>
  );
}

// ── SearchInput ───────────────────────────────────────────────────────────────
// Labelled text input with optional autocomplete dropdown slot
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
            fontFamily   : SF,
            fontSize     : 11,
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
        placeholder={placeholder}
        style={{
          width       : "100%",
          background  : t.surfaceB,
          border      : `1px solid ${t.border}`,
          borderRadius: 12,
          padding     : "13px 16px",
          color       : t.fg,
          fontFamily  : SF,
          fontSize    : 14,
          outline     : "none",
          transition  : "border-color .15s",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = P.teal;
          onFocus?.();
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = t.border;
          setTimeout(() => onBlur?.(), 160);
        }}
      />
      {children}
    </div>
  );
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
// Autocomplete suggestion list rendered below a SearchInput
export function Dropdown({ items, onSelect, addLabel, t }) {
  injectKeyframes();
  if (!items.length && !addLabel) return null;

  return (
    <div
      style={{
        position       : "absolute",
        top            : "calc(100% + 4px)",
        left           : 0,
        right          : 0,
        zIndex         : 300,
        background     : t.surface,
        border         : `1px solid ${t.border}`,
        borderRadius   : 12,
        overflow       : "hidden",
        boxShadow      : "0 12px 32px rgba(0,0,0,0.22)",
        animation      : "ksScaleIn .15s ease both",
        transformOrigin: "top center",
      }}
    >
      {items.map(item => (
        <div
          key={item}
          onMouseDown={() => onSelect(item)}
          style={{
            padding     : "12px 16px",
            fontFamily  : SF,
            fontSize    : 14,
            color       : t.fg,
            cursor      : "pointer",
            borderBottom: `1px solid ${t.border}`,
            transition  : "background .1s",
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
            padding   : "12px 16px",
            fontFamily: SF,
            fontSize  : 14,
            color     : P.green,
            fontWeight: 600,
            cursor    : "pointer",
            transition: "background .1s",
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