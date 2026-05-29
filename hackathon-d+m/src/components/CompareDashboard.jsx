import React from 'react';
import { Scale } from 'lucide-react';
import { BODIES } from '../planets';
import { COMPARE_METRICS } from '../data/bodies';
import { EarthGlobe } from './EarthDashboard';
import { MarsGlobe } from './MarsDashboard';
import { MoonGlobe } from './MoonDashboard';

const MAX_DIAMETER = Math.max(...BODIES.map((b) => b.diameterKm));

const GLOBE_COMPONENTS = {
  earth: EarthGlobe,
  mars: MarsGlobe,
  moon: MoonGlobe,
};

function accentClass(accent) {
  return `${accent}-title`;
}

function getNumericValues(metric) {
  if (metric.compareNumeric === false) return null;
  return BODIES.map((b) => b[metric.key]).filter((v) => typeof v === 'number');
}

function isHighlight(metric, body, value) {
  if (metric.skipHighlight?.(value)) return false;
  const nums = getNumericValues(metric);
  if (!nums?.length) return false;
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  if (max === min) return false;
  return metric.higherIsLarger ? value === max : value === min;
}

function CompareGlobe({ body, size }) {
  const Globe = GLOBE_COMPONENTS[body.id];
  if (!Globe) return null;

  if (body.id === 'moon') {
    return (
      <MoonGlobe
        size={size}
        phaseAngle={180}
        variant="compare"
        showPhase={false}
      />
    );
  }

  return <Globe size={size} variant="compare" />;
}

export default function CompareDashboard() {
  return (
    <div className="dashboard compare-dashboard">
      <div className="dashboard-panel compare-panel">
        <div className="panel-header">
          <h2 className="panel-title compare-title">
            <Scale size={22} />
            Porovnání charakteristik
          </h2>
        </div>
        <p className="compare-intro">
          Země, Mars a Měsíc vedle sebe — velikost, hmotnost, gravitace a další údaje.
        </p>

        <section className="compare-size-section" aria-labelledby="compare-size-heading">
          <h3 id="compare-size-heading" className="compare-section-title">
            Relativní velikost (průměr)
          </h3>
          <div className="compare-size-row">
            {BODIES.map((body) => {
              const scale = body.diameterKm / MAX_DIAMETER;
              const sizePx = Math.max(48, Math.round(scale * 160));
              return (
                <div key={body.id} className="compare-size-item">
                  <div
                    className="compare-globe-wrap"
                    title={`${body.name}: ${body.diameterKm.toLocaleString('cs-CZ')} km`}
                  >
                    <CompareGlobe body={body} size={sizePx} />
                  </div>
                  <span className={`compare-body-name ${accentClass(body.accent)}`}>
                    {body.name}
                  </span>
                  <span className="compare-body-value">
                    {body.diameterKm.toLocaleString('cs-CZ')} km
                  </span>
                  <span className="compare-body-ratio">
                    {((body.diameterKm / BODIES[0].diameterKm) * 100).toFixed(0)} % Země
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="compare-table-section" aria-labelledby="compare-table-heading">
          <h3 id="compare-table-heading" className="compare-section-title">
            Tabulka vlastností
          </h3>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Vlastnost</th>
                  {BODIES.map((body) => (
                    <th key={body.id} scope="col" className={accentClass(body.accent)}>
                      {body.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_METRICS.map((metric) => (
                  <tr key={metric.key}>
                    <th scope="row">{metric.label}</th>
                    {BODIES.map((body) => {
                      const raw = body[metric.key];
                      const display = metric.format(raw);
                      const highlight = isHighlight(metric, body, raw);
                      return (
                        <td
                          key={body.id}
                          className={highlight ? 'compare-cell--max' : undefined}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ul className="compare-notes">
          {BODIES.filter((b) => b.note).map((b) => (
            <li key={b.id}>
              <strong className={accentClass(b.accent)}>{b.name}:</strong> {b.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
