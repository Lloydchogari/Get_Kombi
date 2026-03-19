// TopBar.jsx — KombiSignal sticky top navigation bar
// Palette: #15292E · #074047 · #1C8585 · #1DA27E · #C8D6D8 · #FFFFFF
// Font: SF Pro (iOS system font)

import { Dot } from "./Atoms.jsx";

const SF = `-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif`;
const P  = { green: "#1DA27E", teal: "#1C8585", dark: "#074047", deep: "#15292E", pgrey: "#C8D6D8" };

export function TopBar({ theme, onToggleTheme, activeCount, t, onHome }) {
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .tb-header {
          position: sticky;
          top: 0;
          z-index: 200;
          background: ${isDark
            ? "rgba(13,31,35,0.82)"
            : "rgba(240,245,245,0.88)"
          };
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isDark
            ? "rgba(200,214,216,0.08)"
            : "rgba(7,64,71,0.08)"
          };
        }

        .tb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── Wordmark button ── */
        .tb-home-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          padding: 0;
          transition: opacity .15s;
        }
        .tb-home-btn:hover  { opacity: .78; }
        .tb-home-btn:active { opacity: .55; }

        /* Logo mark — two stacked bars */
        .tb-logomark {
          width: 30px; height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, ${P.dark} 0%, ${P.teal} 100%);
          display: inline-flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; flex-shrink: 0;
        }
        .tb-logo-bar {
          border-radius: 2px;
          background: rgba(255,255,255,0.9);
        }
        .tb-logo-bar-1 { width: 14px; height: 2.5px; }
        .tb-logo-bar-2 { width: 10px; height: 2.5px; }

        /* Wordmark text */
        .tb-wordmark {
          font-family: ${SF};
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: ${t.fg};
          line-height: 1;
        }
        .tb-wordmark span {
          color: ${P.green};
          font-weight: 300;
        }

        /* ── Right side ── */
        .tb-right {
          display: flex; align-items: center; gap: 8px;
        }

        /* Live pill */
        .tb-live-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: ${activeCount > 0
            ? "rgba(29,162,126,0.10)"
            : isDark ? "rgba(200,214,216,0.07)" : "rgba(7,64,71,0.06)"
          };
          border: 1px solid ${activeCount > 0
            ? "rgba(29,162,126,0.22)"
            : isDark ? "rgba(200,214,216,0.12)" : "rgba(7,64,71,0.10)"
          };
          border-radius: 99px;
          padding: 4px 10px;
          transition: background .3s, border-color .3s;
        }
        .tb-live-text {
          font-family: ${SF};
          font-size: 12px;
          font-weight: 500;
          color: ${activeCount > 0 ? P.green : t.muted};
          letter-spacing: 0.01em;
          transition: color .3s;
        }

        /* Theme toggle */
        .tb-theme-btn {
          width: 32px; height: 32px;
          border-radius: 9px;
          border: 1px solid ${isDark
            ? "rgba(200,214,216,0.12)"
            : "rgba(7,64,71,0.10)"
          };
          background: ${isDark
            ? "rgba(200,214,216,0.07)"
            : "rgba(7,64,71,0.05)"
          };
          color: ${t.fg};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, border-color .15s, transform .15s;
          font-family: ${SF};
          font-size: 13px;
        }
        .tb-theme-btn:hover  {
          background: ${isDark ? "rgba(200,214,216,0.13)" : "rgba(7,64,71,0.10)"};
          border-color: rgba(28,133,133,0.30);
        }
        .tb-theme-btn:active { transform: scale(0.88); }
      `}</style>

      <header className="tb-header">
        <div className="tb-inner">

          {/* Wordmark */}
          <button className="tb-home-btn" onClick={onHome} aria-label="Go to home">
            <div className="tb-logomark">
              <div className="tb-logo-bar tb-logo-bar-1" />
              <div className="tb-logo-bar tb-logo-bar-2" />
            </div>
            <span className="tb-wordmark">
              Kombi<span>Signal</span>
            </span>
          </button>

          {/* Right controls */}
          <div className="tb-right">

            {/* Live count pill */}
            <div className="tb-live-pill">
              <Dot
                color={activeCount > 0 ? P.green : t.muted}
                pulse={activeCount > 0}
                size={6}
              />
              <span className="tb-live-text">{activeCount} live</span>
            </div>

            {/* Theme toggle */}
            <button
              className="tb-theme-btn"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀" : "◑"}
            </button>

          </div>
        </div>
      </header>
    </>
  );
}