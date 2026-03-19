// App.jsx — KombiSignal root shell
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import { useState, useEffect, useCallback } from "react";

import { PRESET_ROUTES, SIGNAL_TTL } from "./data/routes.js";
import { THEMES }                     from "./styles/theme.js";
import { GLOBAL_CSS }                 from "./styles/global.js";
import { uid, now }                   from "./utils/signals.js";
import { Splash }                     from "./views/Splash.jsx";
import { OnboardingView }             from "./views/OnboardingView.jsx";
import { HomeScreen }                 from "./views/HomeScreen.jsx";
import { AlertView }                  from "./views/AlertView.jsx";
import { InfoView }                   from "./views/InfoView.jsx";
import { TopBar }                     from "./components/TopBar.jsx";
import { PassengerView }              from "./views/PassengerView.jsx";
import { DriverView }                 from "./views/DriverView.jsx";
import './App.css';

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  green: "#1DA27E",
  teal:  "#1C8585",
  dark:  "#074047",
  deep:  "#15292E",
  pgrey: "#C8D6D8",
};

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;

// ── Nav tabs — no icons, clean text labels with SVG indicators ───────────────
const NAV_TABS = [
  { key: "home",  label: "Home"  },
  { key: "find",  label: "Find"  },
  { key: "alert", label: "Alert" },
  { key: "info",  label: "Info"  },
];

// ── NavTab SVG path data (thin line icons, no emoji) ─────────────────────────
// Each is a minimal 24×24 path string
const NAV_ICONS = {
  home: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  find: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M16.5 16.5L21 21"/>
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="8" x2="12" y2="8.01"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  ),
};

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [stage,     setStage]    = useState("splash");
  const [appPage,   setAppPage]  = useState("home");
  const [theme,     setTheme]    = useState("dark");
  const [signals,   setSignals]  = useState([]);
  const [routes,    setRoutes]   = useState(PRESET_ROUTES);
  const [sessionId]              = useState(uid);
  const [,          forceRender] = useState(0);

  const t = THEMES[theme];
  const isDark = theme === "dark";

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ks-global";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.color      = t.fg;
    document.body.style.fontFamily = SF;
  }, [t]);

  // Splash timer → onboarding
  useEffect(() => {
    if (stage !== "splash") return;
    const id = setTimeout(() => setStage("onboarding"), 3200);
    return () => clearTimeout(id);
  }, [stage]);

  // Purge stale signals every 20s
  useEffect(() => {
    const id = setInterval(() => {
      setSignals(s => s.filter(sig => now() - sig.ts < SIGNAL_TTL));
      forceRender(n => n + 1);
    }, 20000);
    return () => clearInterval(id);
  }, []);

  const handleSignal = useCallback((sig) => {
    if (sig.routeMeta && !routes.find(r => r.id === sig.routeId)) {
      setRoutes(r => [...r, sig.routeMeta]);
    }
    setSignals(s => [...s, sig]);
  }, [routes]);

  const handleBump = useCallback((sigId) => {
    setSignals(s => s.map(sig =>
      sig.id === sigId ? { ...sig, lastBump: now() } : sig
    ));
  }, []);

  function handleHomeAction(action) {
    if (action === "theme") { setTheme(th => th === "dark" ? "light" : "dark"); return; }
    if (action === "start" || action === "home") { setStage("app"); setAppPage("home"); return; }
    if (action === "find")  { setStage("app"); setAppPage("find");  return; }
    if (action === "alert") { setStage("app"); setAppPage("alert"); return; }
    if (action === "info")  { setStage("app"); setAppPage("info");  return; }
  }

  const activeCount = signals.filter(s => now() - s.ts < SIGNAL_TTL).length;

  // ── SPLASH ──
  if (stage === "splash") return <Splash theme={theme} />;

  // ── ONBOARDING ──
  if (stage === "onboarding") {
    return (
      <OnboardingView
        theme={theme}
        onGetStarted={() => { setStage("app"); setAppPage("home"); }}
      />
    );
  }

  // ── MAIN APP ──
  return (
    <>
      <style>{APP_STYLES(t, isDark)}</style>

      <div className="app-root">

        {/* ── Top bar ── */}
        <TopBar
          theme={theme}
          onToggleTheme={() => setTheme(th => th === "dark" ? "light" : "dark")}
          activeCount={activeCount}
          t={t}
          onHome={() => { setStage("app"); setAppPage("home"); }}
        />

        <div className="app-body">

          {/* ── Side nav (tablet+) ── */}
          <aside className="app-side-nav ks-side-nav">
            <div className="side-wordmark">
              Kombi<span>Signal</span>
            </div>

            <div className="side-nav-items">
              {NAV_TABS.map(tab => {
                const active = appPage === tab.key;
                return (
                  <button
                    key={tab.key}
                    className={`side-nav-btn ${active ? "side-nav-btn--active" : ""}`}
                    onClick={() => setAppPage(tab.key)}
                  >
                    <span className="side-nav-icon">{NAV_ICONS[tab.key]}</span>
                    <span className="side-nav-label">{tab.label}</span>
                    {active && <span className="side-nav-pip" />}
                  </button>
                );
              })}
            </div>

            {/* Side nav live badge */}
            {activeCount > 0 && (
              <div className="side-live-badge">
                <span className="side-live-dot" />
                <span className="side-live-text">{activeCount} live signal{activeCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </aside>

          {/* ── Main content ── */}
          <main className="app-main">
            <div className="app-content">
              {appPage === "home" && (
                <DriverView signals={signals} routes={routes} t={t} />
              )}
              {appPage === "find" && (
                <PassengerView
                  routes={routes} signals={signals}
                  onSignal={handleSignal} onBump={handleBump}
                  onDone={() => setAppPage("home")}
                  sessionId={sessionId} t={t}
                />
              )}
              {appPage === "alert" && (
                <AlertView
                  onSubmit={handleSignal}
                  onComplete={() => setAppPage("home")}
                  sessionId={sessionId} t={t}
                />
              )}
              {appPage === "info" && <InfoView t={t} />}
            </div>
          </main>
        </div>

        {/* ── Bottom nav (mobile) ── */}
        <nav className="app-bottom-nav ks-bottom-nav">
          {/* Frosted background handled by CSS */}
          {NAV_TABS.map(tab => {
            const active = appPage === tab.key;
            return (
              <button
                key={tab.key}
                className={`bottom-nav-btn ${active ? "bottom-nav-btn--active" : ""}`}
                onClick={() => setAppPage(tab.key)}
                aria-label={tab.label}
              >
                <span className="bottom-nav-icon">{NAV_ICONS[tab.key]}</span>
                <span className="bottom-nav-label">{tab.label}</span>
                {active && <span className="bottom-nav-pip" />}
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function APP_STYLES(t, isDark) {
  return `
    .app-root {
      min-height: 100vh;
      background: ${t.bg};
      color: ${t.fg};
      display: flex;
      flex-direction: column;
      transition: background .25s, color .25s;
      font-family: ${SF};
    }

    .app-body {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    /* ── Side nav ── */
    .app-side-nav {
      flex-shrink: 0;
      width: 220px;
      background: ${isDark ? "#0a191c" : "#f0f8f8"};
      border-right: 1px solid ${t.border};
      padding: 20px 12px 24px;
      position: sticky;
      top: 0;
      height: calc(100vh - 52px);
      align-self: flex-start;
      display: flex;
      flex-direction: column;
    }

    .side-wordmark {
      font-family: ${SF};
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: ${t.fg};
      padding: 0 8px;
      margin-bottom: 24px;
      line-height: 1;
    }
    .side-wordmark span { color: ${P.green}; font-weight: 300; }

    .side-nav-items {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1;
    }

    .side-nav-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-family: ${SF};
      font-size: 14px;
      font-weight: 500;
      color: ${t.muted};
      transition: background .15s, color .15s;
      position: relative;
      text-align: left;
      min-height: 44px;
    }
    .side-nav-btn:hover {
      background: ${isDark ? "rgba(200,214,216,0.06)" : "rgba(7,64,71,0.05)"};
      color: ${t.fg};
    }
    .side-nav-btn--active {
      background: ${isDark ? "rgba(29,162,126,0.10)" : "rgba(29,162,126,0.08)"};
      color: ${P.green} !important;
      font-weight: 600;
    }
    .side-nav-btn--active:hover {
      background: ${isDark ? "rgba(29,162,126,0.14)" : "rgba(29,162,126,0.12)"};
    }

    .side-nav-icon {
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; width: 20px; height: 20px;
      transition: color .15s;
    }
    .side-nav-label { flex: 1; }

    /* active pip — right edge */
    .side-nav-pip {
      position: absolute;
      right: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 20px;
      border-radius: 3px 0 0 3px;
      background: ${P.green};
    }

    /* live badge at bottom of side nav */
    .side-live-badge {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 12px;
      background: rgba(29,162,126,0.08);
      border: 1px solid rgba(29,162,126,0.18);
      border-radius: 10px;
      margin-top: 12px;
    }
    .side-live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: ${P.green}; flex-shrink: 0;
      animation: appPulse 2s ease-in-out infinite;
    }
    .side-live-text { font-size: 12px; font-weight: 500; color: ${P.green}; }

    /* ── Main content area ── */
    .app-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 0 80px;
      /* Hide scrollbar but keep scroll */
      scrollbar-width: thin;
      scrollbar-color: rgba(28,133,133,0.22) transparent;
    }
    .app-main::-webkit-scrollbar       { width: 4px; }
    .app-main::-webkit-scrollbar-track { background: transparent; }
    .app-main::-webkit-scrollbar-thumb { background: rgba(28,133,133,0.22); border-radius: 4px; }

    .app-content {
      width: 100%;
      max-width: var(--content-max, 480px);
      margin: 0 auto;
    }

    /* ── Bottom nav ── */
    .app-bottom-nav {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      height: 68px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 200;
      /* Glass effect */
      background: ${isDark
        ? "rgba(13,31,35,0.88)"
        : "rgba(238,244,244,0.92)"
      };
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid ${t.border};
    }

    .bottom-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      flex: 1;
      height: 100%;
      background: none;
      border: none;
      cursor: pointer;
      color: ${t.muted};
      font-family: ${SF};
      transition: color .15s;
      position: relative;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .bottom-nav-btn:active { opacity: .65; }

    .bottom-nav-btn--active { color: ${P.green}; }

    .bottom-nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .15s, color .15s;
    }
    .bottom-nav-btn--active .bottom-nav-icon {
      transform: translateY(-1px);
    }

    .bottom-nav-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color .15s;
    }
    .bottom-nav-btn--active .bottom-nav-label {
      font-weight: 700;
    }

    /* Active pip — top edge of tab */
    .bottom-nav-pip {
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 20px; height: 2px;
      border-radius: 0 0 3px 3px;
      background: ${P.green};
    }

    /* Page transition */
    .app-content > * {
      animation: appFadeUp .18s ease both;
    }

    @keyframes appFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes appPulse {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:.35; transform:scale(.72); }
    }

    /* Responsive — show/hide nav */
    .ks-side-nav   { display: none; }
    .ks-bottom-nav { display: flex; }
    @media (min-width: 720px) {
      .ks-side-nav   { display: flex !important; }
      .ks-bottom-nav { display: none !important; }
      .app-main      { padding-bottom: 24px; }
    }
  `;
}