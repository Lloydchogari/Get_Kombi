// ─── GLOBAL CSS STRING ───────────────────────────────────────────────────────
// Injected via <style> in App.jsx once at mount.
// Contains font imports, resets, keyframes, and responsive breakpoints.

export const GLOBAL_CSS = `
  /* No Google Fonts import — system-ui loads instantly from the device */

  :root {
    /*
      LinkedIn font stack:
      - system-ui         → picks the OS native font automatically
      - -apple-system     → San Francisco on iPhone/Mac
      - BlinkMacSystemFont → San Francisco on Chrome/Mac
      - Segoe UI          → Windows
      - Roboto            → Android
      - Helvetica Neue    → older macOS fallback
      - Arial, sans-serif → universal fallback
    */
    --ks-display : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                   Roboto, 'Helvetica Neue', Arial, sans-serif;
    --ks-body    : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                   Roboto, 'Helvetica Neue', Arial, sans-serif;

    /* Responsive spacing scale */
    --space-xs   : 6px;
    --space-sm   : 10px;
    --space-md   : 16px;
    --space-lg   : 24px;
    --space-xl   : 36px;

    /* ── Mobile font scale (deliberately smaller than before) ── */
    --fs-xs      : 10px;
    --fs-sm      : 12px;
    --fs-base    : 13px;
    --fs-md      : 15px;
    --fs-lg      : 17px;
    --fs-xl      : 20px;
    --fs-2xl     : 26px;
    --fs-3xl     : 36px;

    /* Max content width */
    --content-max: 500px;
  }

  /* ── Tablet — sizes step up to comfortable reading size ── */
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
      --content-max: 580px;
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
      --content-max: 660px;
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
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    -webkit-font-smoothing : antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family : var(--ks-body);
    line-height : 1.5;
    /* Prevent horizontal overflow on mobile */
    overflow-x  : hidden;
  }

  /* Remove tap highlight on mobile */
  button, a, [role="button"] {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  input, button, select, textarea {
    font-family: inherit;
    outline: none;
  }

  /* Scrollbar */
  ::-webkit-scrollbar       { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { border-radius: 4px; }

  /* ── Keyframes ── */
  @keyframes ks-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes ks-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes ks-slideUp {
    from { transform: translateY(60px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  @keyframes ks-pulse {
    0%, 100% { opacity: 1;   }
    50%       { opacity: .2; }
  }

  @keyframes ks-scaleIn {
    from { transform: scale(.94); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  /* Splash fades out gently — runs after 2.2s delay in Splash.jsx */
  @keyframes ks-splashOut {
    from { opacity: 1; }
    to   { opacity: 0; pointer-events: none; }
  }

  /* Splash wordmark rises in */
  @keyframes ks-splashText {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Accent line under wordmark extends */
  @keyframes ks-splashLine {
    from { opacity: 0; width: 0; }
    to   { opacity: 1; width: 40px; }
  }

  /* ── Utility: visually hidden (for accessibility) ── */
  .ks-sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* ── Responsive layout helpers ── */
  .ks-page {
    width     : 100%;
    max-width : var(--content-max);
    margin    : 0 auto;
    padding   : 0 var(--space-md);
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
    .ks-signal-btns {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* Counter grid — 1 col mobile, 2 col otherwise */
  .ks-counter-grid {
    display               : grid;
    grid-template-columns : 1fr 1fr;
    gap                   : 1px;
  }

  /* Driver cards grid — 1 col mobile, 2 col desktop */
  .ks-driver-grid {
    display               : grid;
    grid-template-columns : 1fr;
    gap                   : 10px;
  }
  @media (min-width: 900px) {
    .ks-driver-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* Tags wrap row */
  .ks-tags {
    display   : flex;
    flex-wrap : wrap;
    gap       : 8px;
  }
`;