import { useState, useEffect, useCallback } from "react";

import { PRESET_ROUTES, SIGNAL_TTL } from "./data/routes.js";
import { THEMES }                     from "./styles/theme.js";
import { GLOBAL_CSS }                 from "./styles/global.js";
import { uid, now }                   from "./utils/signals.js";
import { Splash }                     from "./views/Splash.jsx";
import { HomeScreen }                 from "./views/HomeScreen.jsx";
import { AlertView }                  from "./views/AlertView.jsx";
import { TopBar }                     from "./components/TopBar.jsx";
import { PassengerView }              from "./views/PassengerView.jsx";
import { DriverView }                 from "./views/DriverView.jsx";

// App moves through four stages:
// "splash" → "home" → "app" (with mode: passenger | driver | alert)

export default function App() {
  const [stage,    setStage]    = useState("splash"); // splash | home | app
  const [theme,    setTheme]    = useState("dark");
  const [mode,     setMode]     = useState("passenger");
  const [signals,  setSignals]  = useState([]);
  const [routes,   setRoutes]   = useState(PRESET_ROUTES);
  const [sessionId]             = useState(uid);
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

  // ── Apply theme to body ──
  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.color      = t.fg;
  }, [t]);

  // ── Splash timer: after 1.8s move to home ──
  useEffect(() => {
    if (stage !== "splash") return;
    const id = setTimeout(() => setStage("home"), 3200);
    return () => clearTimeout(id);
  }, [stage]);

  // ── Purge stale signals every 20s ──
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
    setSignals(s => s.map(sig => sig.id === sigId ? { ...sig, lastBump: now() } : sig));
  }, []);

  // ── Home screen action handler ──
  function handleHomeAction(action) {
    if (action === "theme") {
      setTheme(th => th === "dark" ? "light" : "dark");
      return;
    }
    if (action === "passenger") { setMode("passenger"); setStage("app"); return; }
    if (action === "driver")    { setMode("driver");    setStage("app"); return; }
    if (action === "alert")     { setMode("alert");     setStage("app"); return; }
  }

  const activeCount = signals.filter(s => now() - s.ts < SIGNAL_TTL).length;

  // ── SPLASH ──
  if (stage === "splash") {
    return <Splash theme={theme} />;
  }

  // ── HOME ──
  if (stage === "home") {
    return (
      <HomeScreen
        theme={theme}
        onAction={handleHomeAction}
        t={t}
      />
    );
  }

  // ── MAIN APP ──
  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.fg, transition: "background .2s, color .2s" }}>
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(th => th === "dark" ? "light" : "dark")}
        mode={mode === "alert" ? "passenger" : mode}
        onSetMode={(m) => setMode(m)}
        activeCount={activeCount}
        t={t}
        onHome={() => setStage("home")}
      />

      {mode === "passenger" && (
        <PassengerView
          routes={routes} signals={signals}
          onSignal={handleSignal} onBump={handleBump}
          sessionId={sessionId} t={t}
        />
      )}
      {mode === "driver" && (
        <DriverView signals={signals} routes={routes} t={t} />
      )}
      {mode === "alert" && (
        <AlertView
          onSubmit={handleSignal}
          onBack={() => setStage("home")}
          sessionId={sessionId}
          t={t}
        />
      )}
    </div>
  );
}