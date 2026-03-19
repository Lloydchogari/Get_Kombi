// HomeScreen.jsx — KombiSignal home dashboard
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;

const NAV_ITEMS = [
  { label: "Home",  key: "home",  desc: "Route dashboard"      },
  { label: "Find",  key: "find",  desc: "Search or signal route" },
  { label: "Alert", key: "alert", desc: "Quick local alerts"    },
  { label: "Info",  key: "info",  desc: "How the app works"     },
];

export function HomeScreen({ theme, onAction, t }) {
  const isDark = theme === "dark";

  // ── theme tokens ────────────────────────────────────────────────────────────
  const T = isDark ? {
    bg:       "#0d1f23",
    surface:  "#15292E",
    surfaceB: "#0a191c",
    border:   "rgba(200,214,216,0.11)",
    fg:       "#ffffff",
    fgSub:    "rgba(255,255,255,0.70)",
    muted:    "rgba(200,214,216,0.45)",
    cardHover:"#1a3038",
  } : {
    bg:       "#eef4f4",
    surface:  "#ffffff",
    surfaceB: "#f5fafa",
    border:   "rgba(7,64,71,0.10)",
    fg:       "#15292E",
    fgSub:    "rgba(21,41,46,0.72)",
    muted:    "rgba(7,64,71,0.46)",
    cardHover:"#f0fafa",
  };

  return (
    <>
      <style>{`
        :root {
          --green: #1DA27E;
          --teal:  #1C8585;
          --dark:  #074047;
          --sf: ${SF};
        }

        .hs-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: ${T.bg};
          color: ${T.fg};
          font-family: var(--sf);
          padding: clamp(20px, 5vw, 28px) clamp(16px, 5vw, 24px) 40px;
          animation: hsFadeUp .22s ease both;
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Header ── */
        .hs-header {
          margin-top: 12px;
          margin-bottom: 28px;
          animation: hsFadeUp .3s ease .05s both;
        }
        .hs-wordmark {
          font-size: clamp(26px, 7vw, 32px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          color: ${T.fg};
        }
        .hs-wordmark span {
          color: var(--green);
          font-weight: 300;
        }
        .hs-tagline {
          font-size: 13px;
          font-weight: 400;
          color: ${T.muted};
          margin-top: 7px;
          line-height: 1.5;
        }

        /* ── Live status strip ── */
        .hs-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 9px 14px;
          background: rgba(29,162,126,0.10);
          border: 1px solid rgba(29,162,126,0.22);
          border-radius: 12px;
          animation: hsFadeUp .3s ease .1s both;
        }
        .hs-status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--green);
          flex-shrink: 0;
          animation: hsPulse 2s ease-in-out infinite;
        }
        .hs-status-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--green);
          letter-spacing: 0.02em;
        }
        .hs-status-sep {
          width: 1px; height: 12px;
          background: rgba(29,162,126,0.3);
          margin: 0 2px;
        }
        .hs-status-city {
          font-size: 12px;
          color: ${T.muted};
          font-weight: 400;
        }

        /* ── Hero launch card ── */
        .hs-hero {
          position: relative;
          overflow: hidden;
          background: ${isDark
            ? "linear-gradient(135deg, #074047 0%, #15292E 100%)"
            : "linear-gradient(135deg, #074047 0%, #1C8585 100%)"
          };
          border-radius: 20px;
          padding: 22px 20px;
          margin-bottom: 16px;
          border: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          animation: hsFadeUp .3s ease .15s both;
        }

        /* subtle dot texture on hero */
        .hs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(200,214,216,0.07) 1px, transparent 1px);
          background-size: 22px 22px;
          border-radius: 20px;
        }

        /* decorative ring */
        .hs-hero::after {
          content: '';
          position: absolute;
          right: -40px; top: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          border: 1px solid rgba(29,162,126,0.18);
          pointer-events: none;
        }

        .hs-hero-inner { position: relative; z-index: 1; }

        .hs-hero-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(200,214,216,0.55);
          margin-bottom: 6px;
        }
        .hs-hero-title {
          font-size: clamp(18px, 5vw, 22px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .hs-hero-sub {
          font-size: 13px;
          color: rgba(200,214,216,0.65);
          line-height: 1.5;
          margin-bottom: 18px;
          max-width: 260px;
        }

        /* Launch button — full pill */
        .hs-launch-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 18px;
          background: var(--green);
          border: none;
          border-radius: 999px;
          cursor: pointer;
          overflow: hidden;
          transition: transform .18s ease, box-shadow .18s ease;
          box-shadow: 0 6px 24px rgba(29,162,126,0.42);
        }
        .hs-launch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(29,162,126,0.52);
        }
        .hs-launch-btn:active { transform: scale(0.986); }
        .hs-launch-btn::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
          animation: hsShimmer 3s ease 2s infinite;
        }
        .hs-launch-label {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .hs-launch-arrow {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .18s, transform .18s;
        }
        .hs-launch-btn:hover .hs-launch-arrow {
          background: rgba(255,255,255,0.28);
          transform: translateX(3px);
        }

        /* ── Nav grid ── */
        .hs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          animation: hsFadeUp .3s ease .22s both;
        }

        .hs-nav-card {
          background: ${T.surface};
          border: ${T.cardBorder};
          box-shadow: ${T.cardShadow};
          border-radius: 16px;
          padding: 15px 14px;
          text-align: left;
          cursor: pointer;
          transition: background .15s, transform .15s, box-shadow .15s;
          position: relative;
          overflow: hidden;
        }
        .hs-nav-card:hover {
          background: ${T.cardHover};
          box-shadow: 0 6px 20px rgba(0,0,0,0.11);
          transform: translateY(-1px);
        }
        .hs-nav-card:active { transform: scale(0.984); }

        /* accent corner on hover */
        .hs-nav-card::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 3px; height: 0;
          background: var(--green);
          border-radius: 0 16px 0 0;
          transition: height .2s ease;
        }
        .hs-nav-card:hover::after { height: 100%; border-radius: 0 16px 16px 0; }

        .hs-nav-label {
          font-size: 15px;
          font-weight: 700;
          color: ${T.fg};
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }
        .hs-nav-desc {
          font-size: 11px;
          color: ${T.muted};
          line-height: 1.45;
        }

        /* ── Divider ── */
        .hs-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 20px 0 16px;
        }
        .hs-divider-line { flex: 1; height: 0.5px; background: ${T.border}; }
        .hs-divider-text {
          font-size: 10px; font-weight: 600;
          color: ${T.muted}; letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── Keyframes ── */
        @keyframes hsFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hsPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.4; transform:scale(0.78); }
        }
        @keyframes hsShimmer {
          0%   { left: -100%; }
          100% { left: 160%; }
        }

        @media (min-width: 400px) {
          .hs-nav-card { padding: 16px 15px; }
        }
      `}</style>

      <div className="hs-root">

        {/* ── Wordmark + tagline ── */}
        <div className="hs-header">
          <div className="hs-wordmark">
            Kombi<span>Signal</span>
          </div>
          <p className="hs-tagline">
            Your shared transit demand app for Harare.
          </p>

          {/* Live status strip */}
          <div className="hs-status">
            <span className="hs-status-dot" />
            <span className="hs-status-text">Live now</span>
            <span className="hs-status-sep" />
            <span className="hs-status-city">Harare, Zimbabwe</span>
          </div>
        </div>

        {/* ── Hero launch card ── */}
        <div className="hs-hero">
          <div className="hs-hero-inner">
            <div className="hs-hero-label">Dashboard</div>
            <div className="hs-hero-title">Open KombiControl</div>
            <p className="hs-hero-sub">
              Connect with passengers, drivers, or report alerts in real time.
            </p>
            <button className="hs-launch-btn" onClick={() => onAction("start")}>
              <span className="hs-launch-label">Launch now</span>
              <span className="hs-launch-arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* ── Section divider ── */}
        <div className="hs-divider">
          <div className="hs-divider-line" />
          <span className="hs-divider-text">Quick access</span>
          <div className="hs-divider-line" />
        </div>

        {/* ── Nav grid ── */}
        <div className="hs-grid">
          {NAV_ITEMS.map(b => (
            <button
              key={b.key}
              className="hs-nav-card"
              onClick={() => onAction(b.key)}
            >
              <div className="hs-nav-label">{b.label}</div>
              <div className="hs-nav-desc">{b.desc}</div>
            </button>
          ))}
        </div>

      </div>
    </>
  );
}