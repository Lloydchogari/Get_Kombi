export function Splash({ theme }) {
  const bg = theme === "dark" ? "#000000" : "#ffffff";
  const fg = theme === "dark" ? "#ffffff" : "#000000";
  const ac = theme === "dark" ? "#e8c547" : "#b8860b";

  return (
    <div
      style={{
        position      : "fixed",
        inset         : 0,
        background    : bg,
        display       : "flex",
        flexDirection : "column",
        alignItems    : "center",
        justifyContent: "center",
        zIndex        : 9999,
        // stays fully visible for 2.2s, then fades over 0.6s
        animation     : "ks-splashOut 0.6s ease 2.2s both",
      }}
    >
      {/* Wordmark — no icon, just the name, big */}
      <div style={{ animation: "ks-splashText 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}>
        <div
          style={{
            fontFamily   : "var(--ks-display)",
            fontSize     : 42,
            fontWeight   : 800,
            color        : fg,
            letterSpacing: "-0.03em",
            textAlign    : "center",
            lineHeight   : 1,
          }}
        >
          Kombi
          <span style={{ color: ac }}>Signal</span>
        </div>

        <div
          style={{
            fontFamily   : "var(--ks-body)",
            fontSize     : 12,
            color        : theme === "dark" ? "#555" : "#aaa",
            textAlign    : "center",
            marginTop    : 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Harare Transit · Live Demand
        </div>
      </div>

      {/* Thin accent line beneath */}
      <div
        style={{
          width    : 40,
          height   : 2,
          background: ac,
          borderRadius: 2,
          marginTop: 24,
          animation: "ks-splashLine 0.7s ease 0.7s both",
        }}
      />
    </div>
  );
}