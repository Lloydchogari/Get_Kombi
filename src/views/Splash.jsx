// Splash.jsx — KombiSignal animated splash screen
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · pastel grey · white
// Font: SF Pro (iOS system font)

export function Splash({ theme }) {
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        :root {
          --ks-deep:  #15292E;
          --ks-dark:  #074047;
          --ks-teal:  #1C8585;
          --ks-green: #1DA27E;
          --ks-pgrey: #C8D6D8;
          --ks-white: #FFFFFF;
          --sf: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }

        .ks-splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: ${isDark ? "var(--ks-deep)" : "var(--ks-white)"};
          animation: splashExit 0.55s ease 3.8s both;
        }

        .ks-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            ${isDark ? "rgba(200,214,216,0.07)" : "rgba(7,64,71,0.055)"} 1px,
            transparent 1px
          );
          background-size: 28px 28px;
          animation: dotFade 1.2s ease 0.1s both;
        }

        .ks-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            ${isDark ? "rgba(28,133,133,0.20)" : "rgba(28,133,133,0.09)"} 0%,
            transparent 70%
          );
          animation: glowPulse 3.2s ease-in-out infinite;
        }

        .ks-ring {
          position: absolute;
          width: 230px; height: 230px;
          border-radius: 50%;
          border: 1px solid rgba(29,162,126,0.2);
          animation: ringExpand 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }
        .ks-ring2 {
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(29,162,126,0.09);
          animation: ringExpand 1.7s cubic-bezier(0.22,1,0.36,1) 0.4s both;
        }
        .ks-ring3 {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          border: 1px solid rgba(29,162,126,0.04);
          animation: ringExpand 2s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }

        .ks-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ks-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          opacity: 0;
          animation: riseUp 0.7s ease 0.5s forwards;
        }
        .ks-eyebrow-line {
          width: 26px; height: 1px;
          background: var(--ks-green);
        }
        .ks-eyebrow-text {
          font-family: var(--sf);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ks-green);
        }

        .ks-wordmark {
          font-family: var(--sf);
          font-size: clamp(44px, 11vw, 56px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
          color: ${isDark ? "var(--ks-white)" : "var(--ks-deep)"};
          opacity: 0;
          animation: wordReveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
        }
        .ks-wordmark span {
          color: var(--ks-green);
          font-weight: 300;
        }

        .ks-bar {
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--ks-teal), var(--ks-green));
          border-radius: 2px;
          margin-top: 16px;
          animation: barGrow 0.8s ease 0.95s forwards;
        }

        .ks-tagline {
          font-family: var(--sf);
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${isDark ? "var(--ks-pgrey)" : "var(--ks-teal)"};
          margin-top: 18px;
          opacity: 0;
          animation: riseUp 0.7s ease 1.1s forwards;
        }

        .ks-loader {
          display: flex;
          gap: 7px;
          margin-top: 56px;
          opacity: 0;
          animation: riseUp 0.5s ease 1.5s forwards;
        }
        .ks-loader span {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${isDark ? "var(--ks-pgrey)" : "var(--ks-teal)"};
          opacity: 0.3;
        }
        .ks-loader span:nth-child(1) { animation: dotBounce 1.1s ease 1.5s infinite; }
        .ks-loader span:nth-child(2) { animation: dotBounce 1.1s ease 1.68s infinite; }
        .ks-loader span:nth-child(3) { animation: dotBounce 1.1s ease 1.85s infinite; }

        .ks-city {
          position: absolute;
          bottom: 36px;
          left: 0; right: 0;
          text-align: center;
          font-family: var(--sf);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${isDark ? "rgba(200,214,216,0.28)" : "rgba(7,64,71,0.3)"};
          opacity: 0;
          animation: riseUp 0.6s ease 1.4s forwards;
        }

        @keyframes wordReveal {
          from { opacity: 0; transform: translateY(16px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: 56px; }
        }
        @keyframes ringExpand {
          from { opacity: 0; transform: scale(0.55); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(1.15); opacity: 0.65; }
        }
        @keyframes dotFade {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes dotBounce {
          0%, 100% { opacity: 0.3; transform: translateY(0);   }
          50%       { opacity: 1;   transform: translateY(-5px); }
        }
        @keyframes splashExit {
          from { opacity: 1; transform: scale(1);    }
          to   { opacity: 0; transform: scale(1.04); pointer-events: none; }
        }
      `}</style>

      <div className="ks-splash">
        <div className="ks-dot-grid" />
        <div className="ks-glow" />
        <div className="ks-ring" />
        <div className="ks-ring2" />
        <div className="ks-ring3" />

        <div className="ks-content">
          <div className="ks-eyebrow">
            <div className="ks-eyebrow-line" />
            <span className="ks-eyebrow-text">Harare Transit</span>
            <div className="ks-eyebrow-line" />
          </div>

          <div className="ks-wordmark">
            Kombi<span>Signal</span>
          </div>

          <div className="ks-bar" />
          <div className="ks-tagline">Live Demand &nbsp;·&nbsp; Real Time</div>

          <div className="ks-loader">
            <span /><span /><span />
          </div>
        </div>

        <div className="ks-city">Harare, Zimbabwe</div>
      </div>
    </>
  );
}