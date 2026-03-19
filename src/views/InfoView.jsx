// InfoView.jsx — KombiSignal how it works page
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;
const P  = { green: "#1DA27E", teal: "#1C8585", dark: "#074047", deep: "#15292E", pgrey: "#C8D6D8" };

const STEPS = [
  {
    num: "01",
    title: "Share route demand",
    text: "Passengers tap Find, choose where they are and where they want to go, then press 'No kombis'. This creates a live demand signal that all drivers on that route can see instantly.",
  },
  {
    num: "02",
    title: "Track urgency",
    text: "The app ranks routes by waiting counts and urgency level. Drivers can quickly identify high-demand routes and plan their pickups accordingly.",
  },
  {
    num: "03",
    title: "Report alerts",
    text: "Drivers and passengers can report heavy traffic or other disruptions. Alerts are shared instantly and visible in the alert tab for everyone nearby.",
  },
  {
    num: "04",
    title: "Update and resolve",
    text: "When kombis arrive, users tap 'Kombis arrived' to clear stale signals. All signals auto-expire after 25 minutes to keep the data accurate.",
  },
];

export function InfoView({ t }) {
  return (
    <>
      <style>{`
        :root {
          --green: #1DA27E; --teal: #1C8585;
          --sf: ${SF};
        }

        .iv-root {
          min-height: calc(100vh - 88px);
          padding: clamp(20px,5vw,28px) clamp(16px,5vw,24px) 88px;
          font-family: var(--sf);
          color: ${t.fg};
          animation: ivFadeUp .22s ease both;
        }

        .iv-inner {
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .iv-header { margin-bottom: 24px; }

        .iv-eyebrow {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .iv-eyebrow-line { width: 20px; height: 1px; background: var(--green); }
        .iv-eyebrow-text {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--green);
        }

        .iv-h1 {
          font-size: clamp(22px, 6vw, 28px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.12;
          color: ${t.fg};
          margin-bottom: 10px;
        }
        .iv-h1 span { color: var(--green); font-weight: 300; }

        .iv-intro {
          font-size: 14px; font-weight: 400;
          color: ${t.muted}; line-height: 1.65;
          max-width: 400px;
        }

        /* ── Steps ── */
        .iv-steps {
          display: flex; flex-direction: column;
          gap: 0; margin-top: 24px;
          position: relative;
        }

        /* vertical timeline line */
        .iv-steps::before {
          content: '';
          position: absolute;
          left: 21px; top: 40px;
          width: 1px;
          height: calc(100% - 80px);
          background: linear-gradient(to bottom, rgba(28,133,133,0.35), rgba(29,162,126,0.08));
        }

        .iv-step {
          display: flex; gap: 16px;
          padding: 0 0 20px;
          position: relative;
        }

        /* Step number circle */
        .iv-step-num {
          width: 42px; height: 42px;
          border-radius: 50%; flex-shrink: 0;
          background: ${t.surface};
          border: 1px solid ${t.border};
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          transition: border-color .2s, background .2s;
        }
        .iv-step-num-text {
          font-size: 12px; font-weight: 700;
          color: var(--teal); letter-spacing: 0.02em;
        }

        /* Step content card */
        .iv-step-card {
          flex: 1;
          background: ${t.surface};
          border: 1px solid ${t.border};
          border-radius: 16px;
          padding: 15px 16px;
          transition: border-color .2s, transform .15s;
          margin-top: 4px;
        }
        .iv-step-card:hover {
          border-color: rgba(28,133,133,0.35);
          transform: translateX(2px);
        }

        .iv-step-title {
          font-size: 15px; font-weight: 700;
          color: ${t.fg}; letter-spacing: -0.015em;
          margin-bottom: 6px; line-height: 1.2;
        }
        .iv-step-text {
          font-size: 13px; font-weight: 400;
          color: ${t.muted}; line-height: 1.6;
          margin: 0;
        }

        /* ── Community note ── */
        .iv-note {
          margin-top: 8px;
          background: rgba(28,133,133,0.07);
          border: 1px solid rgba(29,162,126,0.18);
          border-radius: 14px;
          padding: 14px 16px;
          position: relative;
          overflow: hidden;
        }
        .iv-note::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, var(--teal), var(--green));
          border-radius: 3px 0 0 3px;
        }
        .iv-note-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--green); margin-bottom: 6px;
        }
        .iv-note-text {
          font-size: 13px; color: ${t.fgSub};
          line-height: 1.65; margin: 0;
        }

        /* ── Stats row ── */
        .iv-stats {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 8px; margin-top: 16px;
        }
        .iv-stat {
          background: ${t.surface};
          border: 1px solid ${t.border};
          border-radius: 14px;
          padding: 14px 10px;
          text-align: center;
        }
        .iv-stat-num {
          font-size: 22px; font-weight: 700;
          color: var(--green); letter-spacing: -0.03em;
          line-height: 1;
        }
        .iv-stat-lbl {
          font-size: 11px; color: ${t.muted};
          margin-top: 4px; line-height: 1.35;
        }

        /* ── Keyframes ── */
        @keyframes ivFadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @media (min-width: 480px) {
          .iv-steps::before { left: 23px; }
        }
      `}</style>

      <div className="iv-root">
        <div className="iv-inner">

          {/* Header */}
          <div className="iv-header">
            <div className="iv-eyebrow">
              <div className="iv-eyebrow-line" />
              <span className="iv-eyebrow-text">Guide</span>
            </div>
            <h1 className="iv-h1">
              How Kombi<span>Signal</span><br />works
            </h1>
            <p className="iv-intro">
              Built for fast action in busy transit corridors. Every user can report demand, route status, and alerts — keeping drivers and passengers in sync in real time.
            </p>
          </div>

          {/* Stats row */}
          <div className="iv-stats">
            {[
              { num: "25m",  lbl: "Signal lifespan" },
              { num: "Live", lbl: "Demand updates"  },
              { num: "Free", lbl: "No account needed" },
            ].map(s => (
              <div className="iv-stat" key={s.lbl}>
                <div className="iv-stat-num">{s.num}</div>
                <div className="iv-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Steps timeline */}
          <div className="iv-steps">
            {STEPS.map((step, i) => (
              <div className="iv-step" key={step.num}
                style={{ animation: `ivFadeUp .25s ease ${0.06 + i * 0.07}s both` }}>
                <div className="iv-step-num">
                  <span className="iv-step-num-text">{step.num}</span>
                </div>
                <div className="iv-step-card">
                  <div className="iv-step-title">{step.title}</div>
                  <p className="iv-step-text">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Community note */}
          <div className="iv-note">
            <div className="iv-note-label">Community tip</div>
            <p className="iv-note-text">
              KombiSignal works best when users keep signals fresh and accurate — update your waiting status, mark arrival, and share alerts immediately. The whole community benefits from accurate data.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}