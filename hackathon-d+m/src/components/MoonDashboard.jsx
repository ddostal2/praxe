import React, { useCallback, useState, useEffect } from 'react';
import { Moon, Thermometer, AlertTriangle, Sun, RefreshCw } from 'lucide-react';
import { calculateMoonPhase } from '../utils/moonApi';
import moonMapImage from '../assets/moon_map.jpg';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;
const VIEWPORT_SIZE = 400;

const MoonGlobe = ({ phaseAngle }) => {
  const [rotationOffset, setRotationOffset] = useState(0);

  useEffect(() => {
    // Slowly rotate Moon constantly
    const updateRotation = () => {
      setRotationOffset(prev => {
        let next = prev - 0.4;
        if (next <= -MAP_WIDTH) return 0;
        return next;
      });
    };
    const interval = setInterval(updateRotation, 50);
    return () => clearInterval(interval);
  }, []);

  const SIZE = VIEWPORT_SIZE;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2;
  const SHADOW_R = R * 1.14;

  const illum = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;
  const waxing = phaseAngle < 180;
  const shadowX = waxing ? CX - 2 * R * illum : CX + 2 * R * illum;

  return (
    <div style={{ 
      width: VIEWPORT_SIZE, 
      height: VIEWPORT_SIZE, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: '0 0 80px rgba(200, 200, 220, 0.4)',
      backgroundColor: '#000'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
        {/* Render tiles to wrap horizontally */}
        {[0, 1, 2].map(tileOffset => (
          <div key={tileOffset} style={{
            position: 'absolute',
            left: rotationOffset + (tileOffset * MAP_WIDTH),
            top: (VIEWPORT_SIZE - MAP_HEIGHT) / 2,
            width: MAP_WIDTH,
            height: MAP_HEIGHT
          }}>
            <img src={moonMapImage} alt="Moon Satellite Map" style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              objectFit: 'fill',
              filter: 'brightness(1.1) contrast(1.1)'
            }} />
          </div>
        ))}
      </div>
      
      {/* Dynamic Phase Shadow Overlay */}
      {illum < 0.995 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          <circle
            cx={shadowX}
            cy={CY}
            r={SHADOW_R}
            fill="rgba(5, 5, 15, 0.9)"
            style={{ filter: 'blur(15px)' }}
          />
        </svg>
      )}

      {/* 3D Atmospheric and Shading Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset -40px -40px 80px rgba(0,0,0,0.9), inset 15px 15px 40px rgba(220, 220, 240, 0.4)'
      }} />
    </div>
  );
};

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

      <div className="dashboard-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, color: 'var(--text-muted)' }}>
          Satelitní Pohled
        </h3>
        <MoonGlobe phaseAngle={phaseAngle} />
      </div>
    </div>
  );
}
