import {
  Globe,
  Circle,
  Weight,
  ArrowDown,
  Layers,
  Orbit,
  RotateCw,
  Sun,
  Navigation,
  Cloud,
  Gauge,
  Thermometer,
  Moon,
  Droplets,
  Magnet,
  Clock,
} from 'lucide-react';
import '../Earth/EarthModule.css';
import { BODIES, CHARACTERISTICS } from './data/bodyCharacteristics.js';
import './CompareModule.css';

const ICON_MAP = {
  Globe,
  Circle,
  Weight,
  ArrowDown,
  Layers,
  Orbit,
  RotateCw,
  Sun,
  Navigation,
  Cloud,
  Gauge,
  Thermometer,
  Moon,
  Droplets,
  Magnet,
  Clock,
};

const BODY_ORDER = ['earth', 'moon', 'mars'];

const SUMMARY_STATS = {
  earth: { label: 'Průměr', value: '12 742 km' },
  moon: { label: 'Gravitace', value: '1,62 m/s²' },
  mars: { label: 'Den', value: '24 h 39 min' },
};

function getHighlightClass(row, bodyId) {
  if (row.highlight !== 'max') return '';

  const values = BODY_ORDER.map((id) => {
    if (row.compareValues?.[id] != null) return row.compareValues[id];
    return null;
  });

  if (values.every((v) => v === null)) return '';

  const max = Math.max(...values);
  const bodyIndex = BODY_ORDER.indexOf(bodyId);
  if (values[bodyIndex] === max) {
    return `compare-cell-highlight compare-cell-highlight--${bodyId}`;
  }

  return '';
}

function CharacteristicIcon({ name }) {
  const Icon = ICON_MAP[name] ?? Globe;
  return <Icon size={14} />;
}

export default function CompareModule() {
  return (
    <div className="earth-container compare-container">
      <header className="earth-header">
        <h1 className="earth-title">
          <span>⚖️</span> MODUL POROVNÁNÍ
        </h1>

        <div className="search-control-panel">
          <p className="compare-intro">
            Srovnání fyzikálních a planetárních charakteristik Země, Měsíce a Marsu
          </p>
        </div>
      </header>

      <main className="earth-content compare-content">
        <section className="compare-summary-grid" aria-label="Přehled těles">
          {BODY_ORDER.map((bodyId) => {
            const body = BODIES[bodyId];
            const stat = SUMMARY_STATS[bodyId];
            return (
              <article
                key={bodyId}
                className={`compare-body-card compare-body-card--${bodyId}`}
              >
                <div className="compare-body-emoji">{body.emoji}</div>
                <h2 className="compare-body-name">{body.name}</h2>
                <p className="compare-body-tagline">{body.tagline}</p>
                <div className="compare-body-stat">
                  <span className="compare-body-stat-label">{stat.label}</span>
                  <span className="compare-body-stat-value">{stat.value}</span>
                </div>
              </article>
            );
          })}
        </section>

        <div className="glass-card compare-table-wrapper">
          <div className="compare-table-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Charakteristika</th>
                  <th scope="col" className="col-earth">
                    {BODIES.earth.emoji} {BODIES.earth.name}
                  </th>
                  <th scope="col" className="col-moon">
                    {BODIES.moon.emoji} {BODIES.moon.name}
                  </th>
                  <th scope="col" className="col-mars">
                    {BODIES.mars.emoji} {BODIES.mars.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CHARACTERISTICS.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="compare-row-label">
                        <span className="compare-row-icon">
                          <CharacteristicIcon name={row.icon} />
                        </span>
                        {row.label}
                      </span>
                    </td>
                    {BODY_ORDER.map((bodyId) => (
                      <td key={bodyId} className={getHighlightClass(row, bodyId)}>
                        {row[bodyId]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="compare-legend">
            <span className="compare-legend-dot" aria-hidden="true" />
            Zvýrazněné hodnoty = nejvyšší u srovnatelných číselných údajů
          </p>
        </div>
      </main>
    </div>
  );
}
