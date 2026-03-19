// themes.js — KombiSignal design tokens
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (applied via globalCss.js)

export const THEMES = {

  // ── Dark mode ──────────────────────────────────────────────────────────────
  dark: {
    bg:        "#0d1f23",
    surface:   "#15292E",
    surfaceB:  "#0a191c",
    topBarBg:  "rgba(13,31,35,0.82)",

    border:    "rgba(200,214,216,0.11)",
    border2:   "rgba(200,214,216,0.17)",

    // Dark mode cards keep border — no shadow needed on dark
    cardBorder: "rgba(200,214,216,0.11)",
    cardShadow: "none",

    fg:        "#ffffff",
    fgSub:     "rgba(255,255,255,0.70)",
    muted:     "rgba(200,214,216,0.46)",
    dim:       "rgba(200,214,216,0.20)",

    accent:    "#1DA27E",
    accentFg:  "#ffffff",
    green:     "#1DA27E",
    teal:      "#1C8585",
    red:       "#E05252",
    amber:     "#E8A84A",

    shadow:    "0 1px 0 rgba(0,0,0,0.35)",
    scrollbar: "rgba(28,133,133,0.25)",
  },

  // ── Light mode ─────────────────────────────────────────────────────────────
  light: {
    bg:        "#ffffff",
    surface:   "#ffffff",
    surfaceB:  "#f7f7f7",
    topBarBg:  "rgba(255,255,255,0.90)",

    border:    "rgba(0,0,0,0.08)",
    border2:   "rgba(0,0,0,0.12)",

    // Light mode cards: NO border, black drop shadow instead
    cardBorder: "none",
    cardShadow: "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",

    fg:        "#15292E",
    fgSub:     "rgba(21,41,46,0.72)",
    muted:     "rgba(21,41,46,0.42)",
    dim:       "rgba(21,41,46,0.18)",

    accent:    "#1DA27E",
    accentFg:  "#ffffff",
    green:     "#1DA27E",
    teal:      "#1C8585",
    red:       "#E05252",
    amber:     "#E8A84A",

    shadow:    "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
    scrollbar: "rgba(0,0,0,0.12)",
  },
};