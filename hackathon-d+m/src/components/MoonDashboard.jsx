import { useCallback, useState } from 'react';
import { Moon, Thermometer, AlertTriangle, Sun, RefreshCw } from 'lucide-react';
import { MOON } from '../planets';
import { calculateMoonPhase } from '../utils/moonApi';
import moonMapImage from '../assets/moon_map.jpg'; // Keep resolving to existing image
import { getGlobeGlowShadow, getGlobeInsetShadow } from '../utils/globeStyles';
import { useGlobeRotation } from '../utils/useGlobeRotation';

const MAP_WIDTH = 1000;
const DEFAULT_SIZE = 400;
const ROTATION_SPEED = 0.4;
const ROTATION_INTERVAL_MS = 50;

/**
 * MoonGlobe component visualizing the rotating Moon surface, 
 * simulated phase shadow projection overlay, and 3D lunar glow.
 *
 * @component
 * @param {Object} props
 * @param {number} props.phaseAngle - Current angle of the lunar phase in degrees.
 * @param {number} [props.size=400] - Render diameter size of the globe in pixels.
 * @param {'default'|'compare'} [props.variant='default'] - Visual layout variant.
 * @param {boolean} [props.showPhase=true] - Whether to overlay the phase shadow.
 */
export const MoonGlobe = ({ 
  phaseAngle, 
  size = DEFAULT_SIZE, 
  variant = 'default', 
  showPhase = true 
}) => {
  // Use standard rotation hook
  const rotationOffset = useGlobeRotation(ROTATION_SPEED, MAP_WIDTH, ROTATION_INTERVAL_MS);

  const SIZE = size;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2;
  const SHADOW_R = R * 1.14;

  const illum = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;
  const waxing = phaseAngle < 180;
  const shadowX = waxing ? CX - 2 * R * illum : CX + 2 * R * illum;

  const currentMapWidth = size * 2.5;
  const currentMapHeight = size * 1.25;
  const scaledRotationOffset = rotationOffset * (currentMapWidth / MAP_WIDTH);

  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: getGlobeGlowShadow(size, 'rgba(200, 200, 220, 0.4)'),
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
            left: scaledRotationOffset + (tileOffset * currentMapWidth),
            top: (size - currentMapHeight) / 2,
            width: currentMapWidth,
            height: currentMapHeight
          }}>
            <img src={moonMapImage} alt="Moon Satellite Map" style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              objectFit: 'fill',
              filter: variant === 'compare' 
                ? 'brightness(1.25) contrast(1.15)' 
                : 'brightness(1.1) contrast(1.1)'
            }} />
          </div>
        ))}
      </div>
      
      {/* Dynamic Phase Shadow Overlay */}
      {showPhase && illum < 0.995 && (
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
        boxShadow: getGlobeInsetShadow(size, 'rgba(220, 220, 240, 0.4)', variant),
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

/**
 * Main MoonDashboard component calculating current lunar phase telemetry,
 * displaying simulated temperatures, radiation levels, and rendering
 * the interactive Moon globe.
 *
 * @component
 */
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
            Datový panel — {MOON.name}
          </h2>
          <button 
            type="button" 
            className="control-btn" 
            onClick={refresh} 
            title="Obnovit telemetry"
          >
            <RefreshCw size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Obnovit
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
            <span className="stat-label">Aktuální fáze</span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap' 
            }}>
              <span className="moon-phase-name" style={{ margin: 0, fontSize: '1.5rem' }}>
                {phaseLabel}
              </span>
              <span 
                className="moon-phase-meta" 
                style={{ 
                  margin: 0, 
                  paddingLeft: '1rem', 
                  borderLeft: '1px solid rgba(255,255,255,0.2)', 
                  fontSize: '1rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 'normal' 
                }}
              >
                Úhel fáze: {Math.round(phaseAngle)}° · {isLunarDay ? 'Lunární den' : 'Lunární noc'}
              </span>
            </div>
          </div>

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
