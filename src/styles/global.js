// ─── GLOBAL CSS STRING ───────────────────────────────────────────────────────
// Injected via <style> in App.jsx once at mount.
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro — iOS system font stack

export const GLOBAL_CSS = `

  /* ── Font stack ── */
  :root {
    --sf: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;

    /* Single unified font variable used everywhere */
    --ks-display : var(--sf);
    --ks-body    : var(--sf);

    /* ── Palette ── */
    --ks-deep    : #15292E;
    --ks-dark    : #074047;
    --ks-teal    : #1C8585;
    --ks-green   : #1DA27E;
    --ks-pgrey   : #C8D6D8;
    --ks-white   : #FFFFFF;
    --ks-red     : #E05252;
    --ks-amber   : #E8A84A;

    /* ── Spacing scale ── */
    --space-xs   : 6px;
    --space-sm   : 10px;
    --space-md   : 16px;
    --space-lg   : 24px;
    --space-xl   : 36px;

    /* ── Mobile font scale ── */
    --fs-xs      : 10px;
    --fs-sm      : 12px;
    --fs-base    : 13px;
    --fs-md      : 15px;
    --fs-lg      : 17px;
    --fs-xl      : 20px;
    --fs-2xl     : 26px;
    --fs-3xl     : 36px;

    /* ── Radius tokens ── */
    --radius-sm  : 8px;
    --radius-md  : 12px;
    --radius-lg  : 16px;
    --radius-xl  : 20px;
    --radius-pill: 999px;

    /* ── Max content width ── */
    --content-max: 480px;
  }

  /* ── Tablet ── */
  @media (min-width: 640px) {
    :root {
      --fs-xs      : 11px;
      --fs-sm      : 13px;
      --fs-base    : 15px;
      --fs-md      : 17px;
      --fs-lg      : 20px;
      --fs-xl      : 24px;
      --fs-2xl     : 32px;
      --fs-3xl     : 44px;
      --space-md   : 20px;
      --space-lg   : 32px;
      --content-max: 540px;
    }
  }

  /* ── Desktop ── */
  @media (min-width: 1024px) {
    :root {
      --fs-base    : 15px;
      --fs-md      : 17px;
      --fs-lg      : 22px;
      --fs-xl      : 28px;
      --fs-2xl     : 38px;
      --fs-3xl     : 52px;
      --content-max: 600px;
      --space-md   : 26px;
      --space-lg   : 38px;
    }
  }

  /* ── Reset ── */
  *, *::before, *::after {
    box-sizing : border-box;
    margin     : 0;
    padding    : 0;
  }

  html {
    -webkit-text-size-adjust : 100%;
    scroll-behavior          : smooth;
  }

  body {
    -webkit-font-smoothing  : antialiased;
    -moz-osx-font-smoothing : grayscale;
    font-family             : var(--ks-body);
    line-height             : 1.5;
    overflow-x              : hidden;
  }

  /* Remove tap highlight on mobile */
  button, a, [role="button"] {
    -webkit-tap-highlight-color : transparent;
    touch-action                : manipulation;
  }

  input, button, select, textarea {
    font-family : inherit;
    outline     : none;
  }

  /* Slim scrollbar */
  ::-webkit-scrollbar       { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    border-radius : 4px;
    background    : rgba(28,133,133,0.25);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(29,162,126,0.40);
  }

  /* ── Keyframes ────────────────────────────────────────────────────────── */

  /* Page / view entrance */
  @keyframes ks-fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes ks-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Bottom panel slide up (onboarding) */
  @keyframes ks-slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Live dot pulse */
  @keyframes ks-pulse {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.3; transform: scale(0.72); }
  }

  /* Dropdown / card entrance */
  @keyframes ks-scaleIn {
    from { opacity: 0; transform: scale(0.93) translateY(-4px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  /* Counter number pop */
  @keyframes ks-scaleInPop {
    from { opacity: 0; transform: scale(0.82); }
    to   { opacity: 1; transform: scale(1);    }
  }

  /* Splash exit — fades out after showing */
  @keyframes ks-splashOut {
    from { opacity: 1;  transform: scale(1);    }
    to   { opacity: 0;  transform: scale(1.04); pointer-events: none; }
  }

  /* Splash wordmark rises in with blur */
  @keyframes ks-splashText {
    from { opacity: 0; transform: translateY(16px); filter: blur(8px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }

  /* Accent bar under splash wordmark extends */
  @keyframes ks-splashLine {
    from { opacity: 0; width: 0; }
    to   { opacity: 1; width: 56px; }
  }

  /* Expanding ring (onboarding, success screens) */
  @keyframes ks-ringExpand {
    from { opacity: 0; transform: scale(0.55); }
    to   { opacity: 1; transform: scale(1);    }
  }

  /* Glow radial pulse */
  @keyframes ks-glowPulse {
    0%, 100% { transform: scale(1);    opacity: 1;   }
    50%       { transform: scale(1.15); opacity: 0.6; }
  }

  /* Button shimmer sweep */
  @keyframes ks-shimmer {
    0%   { left: -100%; }
    100% { left: 160%;  }
  }

  /* Dot grid fade in */
  @keyframes ks-dotFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Utility classes ──────────────────────────────────────────────────── */

  /* Visually hidden (accessibility) */
  .ks-sr-only {
    position   : absolute;
    width      : 1px;
    height     : 1px;
    padding    : 0;
    margin     : -1px;
    overflow   : hidden;
    clip       : rect(0,0,0,0);
    white-space: nowrap;
    border     : 0;
  }

  /* ── Layout helpers ───────────────────────────────────────────────────── */

  /* Centred page wrapper */
  .ks-page {
    width     : 100%;
    max-width : var(--content-max);
    margin    : 0 auto;
    padding   : 0 var(--space-md);
  }
  @media (min-width: 900px) {
    .ks-page { padding: 0 var(--space-lg); }
  }

  /* Stack → Row at tablet */
  .ks-row {
    display        : flex;
    flex-direction : column;
    gap            : var(--space-sm);
  }
  @media (min-width: 640px) {
    .ks-row { flex-direction: row; }
  }

  /* Signal button pair — stacked on mobile, side-by-side on tablet+ */
  .ks-signal-btns {
    display               : grid;
    grid-template-columns : 1fr;
    gap                   : 10px;
  }
  @media (min-width: 640px) {
    .ks-signal-btns { grid-template-columns: 1fr 1fr; }
  }

  /* Counter cells */
  .ks-counter-grid {
    display               : grid;
    grid-template-columns : 1fr 1fr;
    gap                   : 1px;
  }

  /* Driver route cards — 1 col mobile, 2 col desktop */
  .ks-driver-grid {
    display               : grid;
    grid-template-columns : 1fr;
    gap                   : 8px;
  }
  @media (min-width: 900px) {
    .ks-driver-grid { grid-template-columns: 1fr 1fr; }
  }

  /* Nav visibility */
  .ks-side-nav   { display: none; }
  .ks-bottom-nav { display: flex; }
  @media (min-width: 720px) {
    .ks-side-nav   { display: block; }
    .ks-bottom-nav { display: none;  }
  }

  /* Tag chip row */
  .ks-tags {
    display   : flex;
    flex-wrap : wrap;
    gap       : 8px;
  }

  /* ── Theme: dark (default) ────────────────────────────────────────────── */
  .ks-theme-dark {
    --bg        : #0d1f23;
    --surface   : #15292E;
    --surfaceB  : #0a191c;
    --border    : rgba(200,214,216,0.11);
    --border2   : rgba(200,214,216,0.16);
    --topBarBg  : rgba(13,31,35,0.82);
    --fg        : #ffffff;
    --fgSub     : rgba(255,255,255,0.70);
    --muted     : rgba(200,214,216,0.46);
    --accent    : #1DA27E;
    --accentFg  : #ffffff;
    --green     : #1DA27E;
    --teal      : #1C8585;
    --red       : #E05252;
    --amber     : #E8A84A;
  }

  /* ── Theme: light ─────────────────────────────────────────────────────── */
  .ks-theme-light {
    --bg        : #eef4f4;
    --surface   : #ffffff;
    --surfaceB  : #f5fafa;
    --border    : rgba(7,64,71,0.10);
    --border2   : rgba(7,64,71,0.16);
    --topBarBg  : rgba(238,244,244,0.88);
    --fg        : #15292E;
    --fgSub     : rgba(21,41,46,0.72);
    --muted     : rgba(7,64,71,0.46);
    --accent    : #1DA27E;
    --accentFg  : #ffffff;
    --green     : #1DA27E;
    --teal      : #1C8585;
    --red       : #E05252;
    --amber     : #E8A84A;
  }
`;