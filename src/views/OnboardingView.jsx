// OnboardingView.jsx — KombiSignal onboarding screen
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import '../App.css';

const BG_IMAGE = "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&q=80&fit=crop&crop=center";

const FEATURES = [
  { label: "Live bus stop status" },
  { label: "Real-time kombi demand" },
  { label: "Instant community alerts" },
];

export function OnboardingView({ onGetStarted, theme }) {
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

        .ob-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: var(--sf);
          animation: obFadeIn 0.6s ease both;
        }

        .ob-photo {
          position: absolute; inset: 0;
          background-image: url("${BG_IMAGE}");
          background-size: cover;
          background-position: center 35%;
          background-repeat: no-repeat;
          transform: scale(1.04);
          animation: obZoom 8s ease-out forwards;
        }

        .ob-overlay-top {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,64,71,0.75) 0%,
            rgba(21,41,46,0.28) 45%,
            transparent 65%
          );
        }

        .ob-overlay-bottom {
          position: absolute; inset: 0;
          background: ${isDark
            ? "linear-gradient(to top, rgba(7,64,71,0.97) 0%, rgba(21,41,46,0.88) 36%, transparent 62%)"
            : "linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 36%, transparent 62%)"
          };
        }

        .ob-topbar {
          position: relative; z-index: 2;
          padding: clamp(44px,10vw,60px) clamp(20px,6vw,28px) 0;
          animation: riseUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .ob-wordmark {
          font-size: clamp(26px,7vw,34px);
          font-weight: 700; letter-spacing: -0.03em;
          color: #fff; line-height: 1;
        }
        .ob-wordmark span { color: var(--ks-green); font-weight: 300; }
        .ob-sub-tag {
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); margin-top: 7px;
        }
        .ob-live {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 14px;
          background: rgba(29,162,126,0.18);
          border: 1px solid rgba(29,162,126,0.35);
          border-radius: 99px; padding: 5px 12px;
          opacity: 0; animation: riseUp 0.7s ease 0.6s forwards;
        }
        .ob-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ks-green);
          animation: livePulse 2s ease-in-out infinite;
        }
        .ob-live-text {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.08em; color: var(--ks-green);
        }

        .ob-spacer { flex: 1; }

        .ob-panel {
          position: relative; z-index: 2;
          padding: clamp(24px,6vw,40px) clamp(20px,6vw,28px) clamp(36px,9vw,52px);
          animation: slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.5s both;
        }

        .ob-heading {
          font-size: clamp(22px,6vw,30px);
          font-weight: 700; letter-spacing: -0.025em; line-height: 1.18;
          color: ${isDark ? "#fff" : "var(--ks-deep)"};
          margin-bottom: 10px;
          opacity: 0; animation: riseUp 0.7s ease 0.75s forwards;
        }
        .ob-heading span { color: var(--ks-green); }

        .ob-desc {
          font-size: clamp(13px,3.5vw,15px); font-weight: 400;
          line-height: 1.6;
          color: ${isDark ? "rgba(200,214,216,0.65)" : "rgba(7,64,71,0.65)"};
          margin-bottom: 22px; max-width: 380px;
          opacity: 0; animation: riseUp 0.7s ease 0.88s forwards;
        }

        .ob-features {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 28px;
          opacity: 0; animation: riseUp 0.7s ease 1.0s forwards;
        }
        .ob-pill {
          display: inline-flex; align-items: center;
          background: ${isDark ? "rgba(28,133,133,0.13)" : "rgba(28,133,133,0.09)"};
          border: 1px solid ${isDark ? "rgba(29,162,126,0.26)" : "rgba(28,133,133,0.22)"};
          border-radius: 99px; padding: 6px 14px;
        }
        .ob-pill-text {
          font-size: 12px; font-weight: 500;
          color: ${isDark ? "var(--ks-pgrey)" : "var(--ks-teal)"};
          letter-spacing: 0.01em;
        }

        /* ── CTA — full pill shape ── */
        .ob-cta-wrap {
          opacity: 0; animation: riseUp 0.7s ease 1.12s forwards;
        }

        .ob-btn {
          position: relative;
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 16px 20px;
          background: var(--ks-green);
          border: none;
          border-radius: 999px;
          cursor: pointer; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 32px rgba(29,162,126,0.40), 0 2px 8px rgba(0,0,0,0.18);
        }
        .ob-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 44px rgba(29,162,126,0.50), 0 4px 14px rgba(0,0,0,0.2);
        }
        .ob-btn:active {
          transform: scale(0.984);
          box-shadow: 0 4px 16px rgba(29,162,126,0.3);
        }
        .ob-btn::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 2.8s ease 1.8s infinite;
        }

        .ob-btn-left {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 2px;
          padding-left: 6px;
        }
        .ob-btn-label {
          font-size: clamp(15px,4vw,17px);
          font-weight: 700; letter-spacing: -0.01em; color: #fff;
        }
        .ob-btn-sub {
          font-size: 12px; font-weight: 400;
          color: rgba(255,255,255,0.65);
        }

        .ob-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .ob-btn:hover .ob-arrow {
          background: rgba(255,255,255,0.30);
          transform: translateX(3px);
        }

        .ob-footer {
          text-align: center; margin-top: 16px;
          font-size: 11px; font-weight: 400; letter-spacing: 0.04em;
          color: ${isDark ? "rgba(200,214,216,0.28)" : "rgba(7,64,71,0.32)"};
          opacity: 0; animation: riseUp 0.6s ease 1.25s forwards;
        }

        @keyframes obFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes obZoom    { from { transform: scale(1.04); } to { transform: scale(1); } }
        @keyframes riseUp    { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp   { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes livePulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.45; transform:scale(0.82); } }
        @keyframes shimmer   { 0%{ left:-100%; } 100%{ left:160%; } }

        @media (min-width: 640px) {
          .ob-panel, .ob-topbar { max-width: 480px; margin-left: auto; margin-right: auto; }
        }
      `}</style>

      <div className="ob-root">
        <div className="ob-photo" />
        <div className="ob-overlay-top" />
        <div className="ob-overlay-bottom" />

        <div className="ob-topbar">
          <div className="ob-wordmark">Kombi<span>Signal</span></div>
          <div className="ob-sub-tag">Harare Transit · Live Demand</div>
          <div className="ob-live">
            <div className="ob-live-dot" />
            <span className="ob-live-text">Live now</span>
          </div>
        </div>

        <div className="ob-spacer" />

        <div className="ob-panel">
          <h2 className="ob-heading">
            Know your stop.<br />
            <span>Before you leave.</span>
          </h2>
          <p className="ob-desc">
            Share real-time kombi availability and traffic updates with fellow commuters across Harare.
          </p>

          <div className="ob-features">
            {FEATURES.map(f => (
              <div className="ob-pill" key={f.label}>
                <span className="ob-pill-text">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="ob-cta-wrap">
            <button className="ob-btn" onClick={onGetStarted}>
              <div className="ob-btn-left">
                <span className="ob-btn-label">Get Started</span>
                <span className="ob-btn-sub">Start sharing &amp; discovering</span>
              </div>
              <div className="ob-arrow">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          </div>

          <p className="ob-footer">No account needed · Free to use · Community powered</p>
        </div>
      </div>
    </>
  );
}