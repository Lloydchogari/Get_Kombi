// themes.js — KombiSignal design tokens
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (applied via globalCss.js)

export const THEMES = {

  // ── Dark mode ──────────────────────────────────────────────────────────────
  dark: {
    // Backgrounds
    bg:        "#0d1f23",       // page background — deepest teal-black
    surface:   "#15292E",       // card / input surface — --ks-deep
    surfaceB:  "#0a191c",       // recessed surface (inputs inside cards)
    topBarBg:  "rgba(13,31,35,0.82)", // frosted glass top bar

    // Borders
    border:    "rgba(200,214,216,0.11)",  // subtle divider
    border2:   "rgba(200,214,216,0.17)",  // slightly stronger border

    // Typography
    fg:        "#ffffff",                       // primary text
    fgSub:     "rgba(255,255,255,0.70)",        // secondary text
    muted:     "rgba(200,214,216,0.46)",        // muted / hint text
    dim:       "rgba(200,214,216,0.20)",        // dimmed / disabled

    // Accent — KombiSignal green
    accent:    "#1DA27E",
    accentFg:  "#ffffff",

    // Semantic colours
    green:     "#1DA27E",      // success / arrived
    teal:      "#1C8585",      // secondary accent / active states
    red:       "#E05252",      // critical / no kombis
    amber:     "#E8A84A",      // moderate / few kombis

    // Misc
    shadow:    "0 1px 0 rgba(0,0,0,0.35)",
    scrollbar: "rgba(28,133,133,0.25)",
  },

  // ── Light mode ─────────────────────────────────────────────────────────────
  light: {
    // Backgrounds
    bg:        "#eef4f4",       // page background — pale teal tint
    surface:   "#ffffff",       // card / input surface
    surfaceB:  "#f5fafa",       // recessed surface (inputs inside cards)
    topBarBg:  "rgba(238,244,244,0.88)", // frosted glass top bar

    // Borders
    border:    "rgba(7,64,71,0.10)",   // subtle divider
    border2:   "rgba(7,64,71,0.16)",   // slightly stronger border

    // Typography
    fg:        "#15292E",                       // primary text — --ks-deep
    fgSub:     "rgba(21,41,46,0.72)",           // secondary text
    muted:     "rgba(7,64,71,0.46)",            // muted / hint text
    dim:       "rgba(7,64,71,0.20)",            // dimmed / disabled

    // Accent — KombiSignal green
    accent:    "#1DA27E",
    accentFg:  "#ffffff",

    // Semantic colours
    green:     "#1DA27E",      // success / arrived
    teal:      "#1C8585",      // secondary accent / active states
    red:       "#E05252",      // critical / no kombis
    amber:     "#E8A84A",      // moderate / few kombis

    // Misc
    shadow:    "0 1px 0 rgba(7,64,71,0.08)",
    scrollbar: "rgba(28,133,133,0.20)",
  },
};