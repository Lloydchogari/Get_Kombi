// ─── GLOBAL CSS STRING ───────────────────────────────────────────────────────
// Injected via <style> in App.jsx once at mount.
// Contains font imports, resets, keyframes, and responsive breakpoints.

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@700;800&display=swap');

  :root {
    --ks-display : 'Outfit', sans-serif;
    --ks-body    : 'Plus Jakarta Sans', sans-serif;

    /* Responsive spacing scale */
    --space-xs   : 8px;
    --space-sm   : 12px;
    --space-md   : 20px;
    --space-lg   : 32px;
    --space-xl   : 48px;

    /* Responsive font scale (mobile-first, overridden at breakpoints) */
    --fs-xs      : 11px;
    --fs-sm      : 13px;
    --fs-base    : 15px;
    --fs-md      : 17px;
    --fs-lg      : 20px;
    --fs-xl      : 24px;
    --fs-2xl     : 32px;
    --fs-3xl     : 44px;

    /* Max content width for each breakpoint */
    --content-max: 520px;
  }

  /* ── Tablet ── */
  @media (min-width: 640px) {
    :root {
      --fs-base    : 16px;
      --fs-md      : 18px;
      --fs-lg      : 22px;
      --fs-xl      : 28px;
      --fs-2xl     : 36px;
      --fs-3xl     : 52px;
      --content-max: 600px;
    }
  }

  /* ── Desktop ── */
  @media (min-width: 1024px) {
    :root {
      --fs-base    : 16px;
      --fs-md      : 18px;
      --fs-lg      : 24px;
      --fs-xl      : 30px;
      --fs-2xl     : 40px;
      --fs-3xl     : 56px;
      --content-max: 680px;
      --space-md   : 28px;
      --space-lg   : 40px;
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
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes ks-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes ks-slideUp {
    from { transform: translateY(100%); opacity: 0; }
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