import { useState, useEffect, useCallback } from "react";

import { PRESET_ROUTES, SIGNAL_TTL } from "./data/routes.js";
import { THEMES }                     from "./styles/theme.js";
import { GLOBAL_CSS }                 from "./styles/global.js";
import { uid, now }                   from "./utils/signals.js";
import { TopBar }                     from "./components/TopBar.jsx";
import { PassengerView }              from "./views/PassengerView.jsx";
import { DriverView }                 from "./views/DriverView.jsx";                

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme,    setTheme]    = useState("dark");
  const [mode,     setMode]     = useState("passenger"); // "passenger" | "driver"
  const [signals,  setSignals]  = useState([]);          // starts empty — no fake data
  const [routes,   setRoutes]   = useState(PRESET_ROUTES);
  const [sessionId]             = useState(uid);         // stable per browser tab
  const [, forceRender]         = useState(0);

  const t = THEMES[theme];

  // ── Inject global CSS once ──
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ks-global";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // ── Apply scrollbar color to match theme ──
  useEffect(() => {
    document.documentElement.style.setProperty("--ks-scrollbar", t.scrollbar);
    document.body.style.background = t.bg;
    document.body.style.color      = t.fg;
  }, [t]);

  // ── Purge stale signals every 20s + re-render for live counters ──
  useEffect(() => {
    const id = setInterval(() => {
      setSignals(s => s.filter(sig => now() - sig.ts < SIGNAL_TTL));
      forceRender(n => n + 1);
    }, 20000);
    return () => clearInterval(id);
  }, []);

  // ── Signal handlers ──
  const handleSignal = useCallback((sig) => {
    // Register new user-created route if not already in list
    if (sig.routeMeta && !routes.find(r => r.id === sig.routeId)) {
      setRoutes(r => [...r, sig.routeMeta]);
    }
    setSignals(s => [...s, sig]);
  }, [routes]);

  const handleBump = useCallback((sigId) => {
    setSignals(s =>
      s.map(sig => sig.id === sigId ? { ...sig, lastBump: now() } : sig)
    );
  }, []);

  const activeCount = signals.filter(s => now() - s.ts < SIGNAL_TTL).length;

  // ── Page background covers full viewport ──
  return (
    <div
      style={{
        minHeight  : "100vh",
        background : t.bg,
        color      : t.fg,
        transition : "background .2s, color .2s",
      }}
    >
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(th => th === "dark" ? "light" : "dark")}
        mode={mode}
        onSetMode={setMode}
        activeCount={activeCount}
        t={t}
      />

      {mode === "passenger" ? (
        <PassengerView
          routes={routes}
          signals={signals}
          onSignal={handleSignal}
          onBump={handleBump}
          sessionId={sessionId}
          t={t}
        />
      ) : (
        <DriverView
          signals={signals}
          routes={routes}
          t={t}
        />
      )}
    </div>
  );
}