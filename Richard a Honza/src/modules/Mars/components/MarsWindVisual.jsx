const DUST_COUNT = 18;
const STREAK_COUNT = 6;

const CRATERS = [
  { cx: 72, cy: 82, r: 10 },
  { cx: 128, cy: 108, r: 8 },
  { cx: 92, cy: 128, r: 6 },
  { cx: 138, cy: 78, r: 9 },
  { cx: 58, cy: 108, r: 7 },
];

/** Wind bearing = where it comes FROM; flow = opposite (+180°). */
function getWindFlowDegrees(fromDegrees) {
  return (fromDegrees + 180) % 360;
}

function getAnimationDuration(speedMs) {
  const clamped = Math.min(Math.max(speedMs ?? 5, 0.5), 20);
  return `${Math.max(0.65, 5.8 - clamped * 0.24).toFixed(2)}s`;
}

function getParticleOpacity(speedMs) {
  const clamped = Math.min(Math.max(speedMs ?? 5, 0.5), 20);
  return 0.55 + (clamped / 20) * 0.45;
}

function getStreakLength(speedMs) {
  const clamped = Math.min(Math.max(speedMs ?? 5, 0.5), 20);
  return 28 + clamped * 4;
}

export default function MarsWindVisual({
  windSpeed = 5,
  windDirectionDegrees = 270,
  loading,
}) {
  const flowDegrees = getWindFlowDegrees(windDirectionDegrees);
  const duration = getAnimationDuration(windSpeed);
  const particleOpacity = getParticleOpacity(windSpeed);
  const arrowScale = 0.9 + Math.min(windSpeed / 12, 1) * 0.55;
  const streakLength = getStreakLength(windSpeed);

  return (
    <div
      className="mars-wind-visual"
      style={{
        '--wind-flow-deg': `${flowDegrees}deg`,
        '--wind-from-deg': `${windDirectionDegrees}deg`,
        '--wind-duration': duration,
        '--wind-particle-opacity': particleOpacity,
        '--wind-arrow-scale': arrowScale,
        '--wind-streak-length': `${streakLength}px`,
      }}
    >
      <div className="globe-wrapper mars-globe-wrapper">
        <div className="globe-glow-ambient mars-globe-glow" />

        <div className="mars-disk-shell" aria-hidden={loading}>
          <svg viewBox="0 0 200 200" className="mars-svg mars-svg-base" aria-hidden="true">
            <defs>
              <radialGradient id="mars-atmosphere" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="#1a0804" stopOpacity="0" />
                <stop offset="94%" stopColor="#ff7043" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff5722" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="mars-surface-gradient" cx="38%" cy="32%" r="72%">
                <stop offset="0%" stopColor="#e8a87c" />
                <stop offset="45%" stopColor="#c45c26" />
                <stop offset="100%" stopColor="#6b2d14" />
              </radialGradient>

              <clipPath id="mars-clip">
                <circle cx="100" cy="100" r="80" />
              </clipPath>
            </defs>

            <circle cx="100" cy="100" r="90" fill="url(#mars-atmosphere)" />
            <circle cx="100" cy="100" r="80" className="mars-atmosphere-ring" strokeWidth="0.75" fill="none" />

            <g clipPath="url(#mars-clip)">
              <circle cx="100" cy="100" r="80" fill="url(#mars-surface-gradient)" />

              <g className="mars-grid" strokeWidth="0.35" fill="none">
                <circle cx="100" cy="100" r="20" />
                <circle cx="100" cy="100" r="40" />
                <circle cx="100" cy="100" r="60" />
                <line x1="20" y1="100" x2="180" y2="100" />
                <line x1="100" y1="20" x2="100" y2="180" />
                <path d="M 100,20 Q 130,100 100,180" />
                <path d="M 100,20 Q 70,100 100,180" />
              </g>

              {CRATERS.map(({ cx, cy, r }, index) => (
                <g key={index} className="mars-crater-group">
                  <circle cx={cx} cy={cy} r={r} className="mars-crater" />
                  <circle
                    cx={cx - r * 0.15}
                    cy={cy - r * 0.15}
                    r={r * 0.72}
                    className="mars-crater-highlight"
                  />
                </g>
              ))}
            </g>
          </svg>

          {/* Unified wind layer — arrow + streaks + dust share one rotation */}
          <div className="mars-wind-overlay">
            <div className="mars-wind-unified-layer">
              <svg viewBox="0 0 200 200" className="mars-wind-streaks-svg" aria-hidden="true">
                {Array.from({ length: STREAK_COUNT }, (_, i) => {
                  const x = 36 + i * 22;
                  return (
                    <g
                      key={i}
                      className="mars-wind-streak-wrap"
                      style={{ '--streak-delay': `${i * 0.38}s` }}
                    >
                      <line x1={x} y1="145" x2={x} y2="185" className="mars-wind-streak" />
                    </g>
                  );
                })}
              </svg>

              {Array.from({ length: DUST_COUNT }, (_, i) => (
                <span
                  key={i}
                  className="mars-dust-particle"
                  style={{
                    '--particle-delay': `${(i * 0.27) % 2.2}s`,
                    '--particle-offset': `${12 + ((i * 17) % 72)}%`,
                    '--particle-size': `${2 + (i % 3)}px`,
                  }}
                />
              ))}

              <div className="mars-wind-arrow-group" aria-hidden="true">
                <svg viewBox="0 0 48 48" className="mars-wind-arrow-svg">
                  <path
                    d="M24 4 L40 40 L24 30 L8 40 Z"
                    fill="currentColor"
                    stroke="rgba(255, 210, 120, 0.85)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            <span className="mars-wind-azimuth-label">
              {windDirectionDegrees.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
