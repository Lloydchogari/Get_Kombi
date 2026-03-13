// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
// Real kombi photo background (Unsplash), dark overlay, semi-transparent
// bottom panel so the image shows through slightly behind the action cards.

import { useState, useEffect } from 'react';

export function HomeScreen({ theme, onAction, t }) {
  const isDark = theme === "dark";

  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real photo of a Harare-style hiace/kombi rank — Unsplash free licence
  // Using a specific image ID so it's always the same photo, not random
  const BG_IMAGE = "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&q=80&fit=crop&crop=center";

  const actions = [
    {
      id   : "passenger",
      title: "I need a kombi",
      sub  : "Signal demand on your route",
      accent: t.accent,
    },
    {
      id   : "driver",
      title: "Find passengers",
      sub  : "See routes with high demand",
      accent: "#ffffff",
    },
    {
      id   : "alert",
      title: "Report an alert",
      sub  : "Traffic or council activity nearby",
      accent: t.red,
    },
  ];

  if (isMobile && showIntro) {
    return (
      <div
        style={{
          position     : "fixed",
          inset        : 0,
          display      : "flex",
          flexDirection: "column",
          overflow     : "hidden",
          animation    : "ks-fadeIn 0.7s ease both",
        }}
      >
        {/* ── Real photo background ── */}
        <div
          style={{
            position          : "absolute",
            inset             : 0,
            backgroundImage   : `url("${BG_IMAGE}")`,
            backgroundSize    : "cover",
            backgroundPosition: "center 40%",
            backgroundRepeat  : "no-repeat",
          }}
        />

        {/* ── Overlay: strong at top for readability, lightens in middle ── */}
        <div
          style={{
            position  : "absolute",
            inset     : 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 62%, rgba(0,0,0,0.0) 72%)",
          }}
        />

        {/* ── App name at top over image ── */}
        <div
          style={{
            position : "relative",
            zIndex   : 2,
            padding  : "56px 24px 0",
            animation: "ks-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}
        >
          <div
            style={{
              fontFamily   : "var(--ks-display)",
              fontSize     : 32,
              fontWeight   : 800,
              color        : "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight   : 1,
            }}
          >
            Kombi<span style={{ color: t.accent }}>Signal</span>
          </div>
          <p
            style={{
              fontFamily  : "var(--ks-body)",
              fontSize    : 12,
              color       : "rgba(255,255,255,0.5)",
              marginTop   : 7,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Harare Transit · Live Demand
          </p>
        </div>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Bottom container with glassmorphism ── */}
        <div
          style={{
            position : "relative",
            zIndex   : 2,
            background: isDark
              ? "rgba(0,0,0,0.8)"
              : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius : "20px 20px 0 0",
            padding  : "24px 20px",
            margin   : "0 16px 0",
            animation: "ks-slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.55s both",
          }}
        >
          <h2
            style={{
              fontFamily   : "var(--ks-display)",
              fontSize     : 18,
              fontWeight   : 800,
              color        : isDark ? "#ffffff" : t.fg,
              letterSpacing: "-0.02em",
              marginBottom : 8,
            }}
          >
            Share the status of your busstop
          </h2>
          <p
            style={{
              fontFamily: "var(--ks-body)",
              fontSize  : 14,
              color     : isDark ? "rgba(255,255,255,0.7)" : t.muted,
              marginBottom: 20,
              lineHeight: 1.4,
            }}
          >
            Help fellow commuters by sharing real-time updates about bus stop conditions and availability.
          </p>
          <button
            onClick={() => setShowIntro(false)}
            style={{
              display      : "flex",
              alignItems   : "center",
              justifyContent: "center",
              width        : "100%",
              padding      : "12px 18px",
              background   : t.accent,
              border       : "none",
              borderRadius : 12,
              cursor       : "pointer",
              fontFamily   : "var(--ks-body)",
              fontSize     : 16,
              fontWeight   : 700,
              color        : "#ffffff",
              transition   : "all 0.25s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Get Started
            <span style={{ marginLeft: 8, fontSize: 18 }}>›</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position     : "fixed",
        inset        : 0,
        display      : "flex",
        flexDirection: "column",
        overflow     : "hidden",
        animation    : "ks-fadeIn 0.7s ease both",
      }}
    >
      {/* ── Real photo background ── */}
      <div
        style={{
          position          : "absolute",
          inset             : 0,
          backgroundImage   : `url("${BG_IMAGE}")`,
          backgroundSize    : "cover",
          backgroundPosition: "center 40%",
          backgroundRepeat  : "no-repeat",
        }}
      />

      {/* ── Overlay: strong at top for readability, lightens in middle ── */}
      <div
        style={{
          position  : "absolute",
          inset     : 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 62%, rgba(0,0,0,0.0) 72%)",
        }}
      />

      {/* ── App name at top over image ── */}
      <div
        style={{
          position : "relative",
          zIndex   : 2,
          padding  : "56px 24px 0 0",
          animation: "ks-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both",
        }}
      >
        <div
          style={{
            fontFamily   : "var(--ks-display)",
            fontSize     : 32,
            fontWeight   : 800,
            color        : "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight   : 1,
          }}
        >
          Kombi<span style={{ color: t.accent }}>Signal</span>
        </div>
        <p
          style={{
            fontFamily  : "var(--ks-body)",
            fontSize    : 12,
            color       : "rgba(255,255,255,0.5)",
            marginTop   : 7,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Harare Transit · Live Demand
        </p>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom panel — semi-transparent so image bleeds through ── */}
      <div
        style={{
          position : "relative",
          zIndex   : 2,
          // glass-like: image visible through top portion, solid at very bottom
          background: isDark
            ? "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.72) 22%, rgba(0,0,0,0.91) 50%)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.78) 22%, rgba(255,255,255,0.95) 50%)",
          backdropFilter: "blur(0px)",
          padding  : "52px 20px 40px",
          animation: "ks-slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.55s both",
        }}
      >
        {/* Section heading */}
        <div style={{ marginBottom: 16 }}>
          <h2
            style={{
              fontFamily   : "var(--ks-display)",
              fontSize     : 20,
              fontWeight   : 800,
              color        : isDark ? "#ffffff" : t.fg,
              letterSpacing: "-0.02em",
              marginBottom : 3,
            }}
          >
            What do you need?
          </h2>
          <p style={{ fontFamily: "var(--ks-body)", fontSize: 12, color: isDark ? "rgba(255,255,255,0.45)" : t.muted }}>
            Tap an option to get started
          </p>
        </div>

        {/* Action cards — no icons, text only, semi-transparent bg */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
          {actions.map(({ id, title, sub, accent }, i) => (
            <button
              key={id}
              onClick={() => onAction(id)}
              style={{
                display      : "flex",
                alignItems   : "center",
                justifyContent: "space-between",
                width        : "100%",
                padding      : "15px 18px",
                // semi-transparent so the kombi image bleeds through subtly
                background   : isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.62)",
                border       : isDark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : `1px solid rgba(0,0,0,0.10)`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius : 14,
                cursor       : "pointer",
                textAlign    : "left",
                transition   : "all 0.25s ease",
                animation    : `ks-fadeUp 0.7s ease ${0.7 + i * 0.12}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.85)";
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.62)";
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--ks-body)",
                    fontSize  : 15,
                    fontWeight: 700,
                    color     : isDark ? "#ffffff" : t.fg,
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--ks-body)",
                    fontSize  : 12,
                    color     : isDark ? "rgba(255,255,255,0.48)" : t.muted,
                    marginTop : 3,
                  }}
                >
                  {sub}
                </div>
              </div>

              {/* Accent chevron */}
              <div
                style={{
                  fontFamily: "var(--ks-body)",
                  fontSize  : 18,
                  color     : accent,
                  flexShrink: 0,
                  marginLeft: 12,
                  fontWeight: 300,
                }}
              >
                ›
              </div>
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => onAction("theme")}
            style={{
              background: "none",
              border    : "none",
              cursor    : "pointer",
              fontFamily: "var(--ks-body)",
              fontSize  : 12,
              color     : isDark ? "rgba(255,255,255,0.35)" : t.muted,
              padding   : "6px 12px",
            }}
          >
            {isDark ? "Switch to light mode  ☀" : "Switch to dark mode  ◑"}
          </button>
        </div>
      </div>
    </div>
  );
}