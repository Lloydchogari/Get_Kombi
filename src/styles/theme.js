// ─── THEME TOKENS ────────────────────────────────────────────────────────────
// Each theme is a plain object of CSS-ready values.
// Components receive the active theme as prop `t` — no context needed.

export const THEMES = {
  dark: {
    bg:        "#0a0a0a",
    surface:   "#131313",
    surfaceB:  "#1c1c1c",
    border:    "#222222",
    border2:   "#2e2e2e",
    fg:        "#ededed",
    fgSub:     "#b0b0b0",
    muted:     "#606060",
    dim:       "#383838",
    accent:    "#e8c547",
    accentFg:  "#0a0a0a",
    red:       "#e05555",
    green:     "#4caf82",
    topBarBg:  "rgba(10,10,10,0.94)",
    shadow:    "0 1px 0 #222",
    scrollbar: "#2e2e2e",
  },
  light: {
    bg:        "#f7f6f3",
    surface:   "#ffffff",
    surfaceB:  "#f0ede8",
    border:    "#e2ddd8",
    border2:   "#d4cfc9",
    fg:        "#1a1a1a",
    fgSub:     "#444444",
    muted:     "#888888",
    dim:       "#cccccc",
    accent:    "#b8860b",
    accentFg:  "#ffffff",
    red:       "#c0392b",
    green:     "#2e7d56",
    topBarBg:  "rgba(247,246,243,0.95)",
    shadow:    "0 1px 0 #e2ddd8",
    scrollbar: "#d4cfc9",
  },
};