import { useCallback, useEffect, useState } from 'react';
import {
  Moon,
  Thermometer,
  Sun,
  ShieldAlert,
  Radio,
  Compass,
  RefreshCw,
} from 'lucide-react';
import '../modules/Earth/EarthModule.css';
import {
  calculateMoonPhase,
  PHASE_LABELS_CZ,
  RISK_LABELS_CZ,
} from './utils/moonCalculations.js';
import './MoonModule.css';

const CRATERS = [
  { cx: 75, cy: 85, r: 12 },
  { cx: 110, cy: 120, r: 8 },
  { cx: 95, cy: 135, r: 6 },
  { cx: 135, cy: 90, r: 10 },
  { cx: 65, cy: 115, r: 7 },
  { cx: 120, cy: 65, r: 5 },
];

function buildPhasePath(cx, cy, r, age) {
  const dx = r * 2 * Math.abs(2 * age - 1);
  const shadowCx = age <= 0.5 ? cx + dx : cx - dx;

  let d = `M ${cx},${cy - r} `;
  d += `A ${r},${r} 0 1,1 ${cx},${cy + r} `;
  d += `A ${r},${r} 0 1,1 ${cx},${cy - r} `;
  d += `M ${shadowCx},${cy - r} `;

  if (age <= 0.5) {
    d += `A ${r},${r} 0 0,0 ${shadowCx},${cy + r} `;
    d += `A ${r},${r} 0 0,0 ${shadowCx},${cy - r} `;
  } else {
    d += `A ${r},${r} 0 0,1 ${shadowCx},${cy + r} `;
    d += `A ${r},${r} 0 0,1 ${shadowCx},${cy - r} `;
  }

  return d;
}

function MoonPhaseSvg({ age, illumination }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const phasePath = buildPhasePath(cx, cy, r, age);

  return (
    <svg viewBox="0 0 200 200" className="earth-svg moon-svg" aria-label="Vizualizace fáze Měsíce">
      <defs>
        <radialGradient id="moon-atmosphere" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#0a0f24" stopOpacity="0" />
          <stop offset="94%" stopColor="#cbd5e1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="moon-lit-gradient" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#faf6ea" />
          <stop offset="55%" stopColor="#ddd6c4" />
          <stop offset="100%" stopColor="#9a9484" />
        </radialGradient>

        <radialGradient id="moon-shadow-gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1c1c2e" />
          <stop offset="70%" stopColor="#12121f" />
          <stop offset="100%" stopColor="#0a0a14" />
        </radialGradient>

        <clipPath id="moon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r="90" fill="url(#moon-atmosphere)" />
      <circle cx={cx} cy={cy} r={r} className="moon-atmosphere-ring" strokeWidth="0.75" fill="none" />

      <g clipPath="url(#moon-clip)">
        <circle cx={cx} cy={cy} r={r} fill="url(#moon-shadow-gradient)" />

        {illumination <= 0.5 ? (
          <path fillRule="evenodd" d={phasePath} fill="url(#moon-lit-gradient)" />
        ) : (
          <>
            <circle cx={cx} cy={cy} r={r} fill="url(#moon-lit-gradient)" />
            <path fillRule="evenodd" d={phasePath} fill="url(#moon-shadow-gradient)" />
          </>
        )}

        {CRATERS.map(({ cx: craterX, cy: craterY, r: craterR }, index) => (
          <g key={index}>
            <circle cx={craterX} cy={craterY} r={craterR} className="moon-crater" />
            <circle
              cx={craterX - craterR * 0.2}
              cy={craterY - craterR * 0.2}
              r={craterR * 0.75}
              className="moon-crater-highlight"
            />
          </g>
        ))}

        <g className="moon-grid" strokeWidth="0.4" fill="none">
          <circle cx={cx} cy={cy} r="20" />
          <circle cx={cx} cy={cy} r="40" />
          <circle cx={cx} cy={cy} r="60" />
          <line x1="20" y1={cy} x2="180" y2={cy} />
          <line x1={cx} y1="20" x2={cx} y2="180" />
          <path d={`M ${cx},20 Q 130,100 ${cx},180`} />
          <path d={`M ${cx},20 Q 70,100 ${cx},180`} />
        </g>
      </g>
    </svg>
  );
}

export default function MoonModule() {
  const [data, setData] = useState(() => calculateMoonPhase());
  const [utcTime, setUtcTime] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setData(calculateMoonPhase());
    setUtcTime(new Date());
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(calculateMoonPhase());
      setUtcTime(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const illuminationPct = Math.round(data.illumination * 100);
  const riskClass =
    data.micrometeoroidRisk === 'low'
      ? 'risk-low'
      : data.micrometeoroidRisk === 'medium'
        ? 'risk-medium'
        : 'risk-high';

  const telemetryStatus = refreshing
    ? { text: 'AKTUALIZACE...', color: '#ffd700' }
    : { text: 'ONLINE / OK', color: '#86efac' };

  return (
    <div className="earth-container moon-container">
      <header className="earth-header">
        <h1 className="earth-title">
          <span>🌙</span> MODUL MĚSÍC
        </h1>

        <div className="search-control-panel">
          <div className="search-form-row">
            <div className="search-input-wrapper">
              <Moon size={18} className="search-input-icon" />
              <input
                type="text"
                className="search-input"
                value={`Ephemeris · ${PHASE_LABELS_CZ[data.phaseName]}`}
                readOnly
                aria-label="Aktuální lunární fáze"
              />
            </div>
            <button type="button" className="search-btn" onClick={refresh} disabled={refreshing}>
              {refreshing ? (
                <div className="search-btn-spinner" />
              ) : (
                <>
                  <RefreshCw size={16} /> Obnovit telemetrii
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="earth-content">
        <section className="earth-data-column">
          <div className="glass-card location-info-card">
            <div className="location-title-row">
              <div className="location-name-container">
                <h2 className="location-name">
                  🌙 {PHASE_LABELS_CZ[data.phaseName]}
                </h2>
                <span className="location-country">Lunární povrch · Simulovaná telemetrie</span>
              </div>

              <div className="clock-container">
                <span className="clock-label">UTC čas</span>
                <span className="clock-time">
                  {utcTime.toLocaleTimeString('cs-CZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span className="timezone-tag">Julianský den · JDN algoritmus</span>
              </div>
            </div>

            <div className="location-coordinates" style={{ marginBottom: '2rem' }}>
              <div className="coord-tag">
                <strong>Fázový úhel:</strong> {data.phaseAngle.toFixed(2)}°
              </div>
              <div className="coord-tag">
                <strong>Stáří:</strong> {(data.age * 29.53).toFixed(1)} dní
              </div>
            </div>

            <h3 className="weather-panel-title">
              <Compass size={18} /> LUNÁRNÍ DATA
            </h3>

            <div className="weather-overview">
              <Moon size={56} className="weather-large-icon" />
              <div className="temperature-main">
                <div>
                  <span className="temp-val">{illuminationPct}</span>
                  <span className="temp-unit">%</span>
                </div>
                <span className="weather-desc-text">
                  {data.isLunarDay ? 'Lunární den (vysoké záření)' : 'Lunární noc (nízké záření)'}
                </span>
                <div className="illumination-bar" aria-hidden="true">
                  <span style={{ width: `${illuminationPct}%` }} />
                </div>
              </div>
            </div>

            <div className="weather-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box">
                  <Thermometer size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Teplota povrchu</span>
                  <span className="metric-value">{data.surfaceTemperature.toFixed(1)} °C</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <ShieldAlert size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Mikrometeoritový déšť</span>
                  <span className={`metric-value ${riskClass}`}>
                    {RISK_LABELS_CZ[data.micrometeoroidRisk]}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <Sun size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Sluneční radiace</span>
                  <span className="metric-value">{Math.round(data.solarRadiation)} W/m²</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <Radio size={20} style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Telemetrický stav</span>
                  <span className="metric-value" style={{ color: telemetryStatus.color, fontWeight: 800 }}>
                    {telemetryStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="earth-visual-column">
          <div className="globe-wrapper">
            <div className="globe-glow-ambient" />
            <MoonPhaseSvg age={data.age} illumination={data.illumination} />
          </div>

          <div className="terminator-info-box">
            <span>
              Senzorický log: Zobrazena aktuální fáze <strong>{PHASE_LABELS_CZ[data.phaseName]}</strong> s
              osvětlením <strong>{illuminationPct}%</strong>. Terminátor odděluje osvětlenou a stínovou
              hemisféru podle fázového úhlu <strong>{data.phaseAngle.toFixed(1)}°</strong>. Teplota povrchu
              se pohybuje mezi <strong>-173 °C</strong> a <strong>127 °C</strong>.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
