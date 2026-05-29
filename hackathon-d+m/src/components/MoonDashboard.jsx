import React, { useCallback, useState } from 'react';
import { Moon, Thermometer, AlertTriangle, Sun, RefreshCw } from 'lucide-react';
import { calculateMoonPhase } from '../utils/moonApi';
import MoonVisualization from './MoonVisualization';

const PHASE_LABELS = {
  'new-moon': 'Nov',
  'waxing-crescent': 'Dorůstající srpek',
  'first-quarter': 'První čtvrť',
  'waxing-gibbous': 'Dorůstající Měsíc',
  'full-moon': 'Úplněk',
  'waning-gibbous': 'Ubývající Měsíc',
  'last-quarter': 'Poslední čtvrť',
  'waning-crescent': 'Ubývající srpek',
};

const RISK_LABELS = {
  low: 'Nízké',
  medium: 'Střední',
  high: 'Vysoké',
};

export default function MoonDashboard() {
  const [data, setData] = useState(() => calculateMoonPhase());

  const refresh = useCallback(() => {
    setData(calculateMoonPhase());
  }, []);

  const {
    phaseName,
    phaseAngle,
    surfaceTemperature,
    micrometeoroidRisk,
    solarRadiation,
  } = data;

  const phaseLabel = PHASE_LABELS[phaseName] ?? phaseName;
  const isLunarDay = phaseAngle > 90 && phaseAngle < 270;

  return (
    <div className="dashboard">
      <div className="dashboard-panel">
        <div className="panel-header">
          <h2 className="panel-title moon-title">
            <Moon size={22} />
            Datový panel — Měsíc
          </h2>
          <button type="button" className="control-btn" onClick={refresh} title="Obnovit telemetry">
            <RefreshCw size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Obnovit
          </button>
        </div>

        <div className="moon-phase-banner">
          <span className="stat-label">Aktuální fáze</span>
          <span className="moon-phase-name">{phaseLabel}</span>
          <span className="moon-phase-meta">
            Úhel fáze: {Math.round(phaseAngle)}° · {isLunarDay ? 'Lunární den' : 'Lunární noc'}
          </span>
        </div>

        <h3 className="moon-section-heading">Environmentální zpráva</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">
              <Thermometer size={14} style={{ display: 'inline', marginRight: 4 }} />
              Povrchová teplota
            </span>
            <span className="stat-value moon-stat-value">
              {Math.round(surfaceTemperature)} °C
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: 4 }} />
              Riziko mikrometeoroidů
            </span>
            <span className={`stat-value risk-${micrometeoroidRisk}`}>
              {RISK_LABELS[micrometeoroidRisk]}
            </span>
          </div>

          <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
            <span className="stat-label">
              <Sun size={14} style={{ display: 'inline', marginRight: 4 }} />
              Úroveň sluneční radiace
            </span>
            <span className="stat-value moon-stat-value">
              {Math.round(solarRadiation)} W/m²
            </span>
            <span className="moon-radiation-hint">
              {isLunarDay
                ? 'Zvýšená úroveň během lunárního dne'
                : 'Snížená úroveň během lunární noci'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="panel-header">
          <h2 className="panel-title moon-title">Vizuální náhled</h2>
        </div>
        <MoonVisualization phaseAngle={phaseAngle} />
        <p className="moon-viz-caption">
          Osvětlená a zastíněná část podle aktuální fáze (vypočteno z úhlu {Math.round(phaseAngle)}°).
        </p>
      </div>
    </div>
  );
}
