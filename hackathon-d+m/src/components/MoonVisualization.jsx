import { useMemo } from 'react';

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE * 0.42;

/** Slightly larger than disc so phase shadow fully covers edge pixels */
const SHADOW_R = R * 1.14;

/**
 * Calculates the exact X-coordinate center for the SVG shadow overlay
 * based on the current lunar phase angle.
 *
 * @param {number} phaseAngle - Current moon phase angle in degrees (0-360).
 * @returns {number} The calculated horizontal SVG center coordinate for the shadow circle.
 */
function calculateShadowCenterX(phaseAngle) {
  const illum = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;
  const waxing = phaseAngle < 180;
  if (waxing) {
    return CX - 2 * R * illum;
  }
  return CX + 2 * R * illum;
}

/**
 * Visual-only Moon component rendering a circular lunar disk overlayed with
 * an SVG phase-based shadow circle to represent the current phase illumination percentage.
 *
 * @component
 * @param {Object} props
 * @param {number} props.phaseAngle - Angle of the moon phase in degrees.
 */
export default function MoonVisualization({ phaseAngle }) {
  const shadowX = useMemo(() => calculateShadowCenterX(phaseAngle), [phaseAngle]);
  const illum = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;

  return (
    <div className="viz-container viz-moon" aria-hidden="true">
      <div className="moon-disc">
        <img
          src="/moon.png"
          alt=""
          className="moon-disc-image"
          draggable={false}
        />

        <svg
          className="moon-disc-overlay"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <defs>
            <clipPath id="moonDiscClip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
          </defs>
          <g clipPath="url(#moonDiscClip)">
            {illum < 0.995 && (
              <circle
                cx={shadowX}
                cy={CY}
                r={SHADOW_R}
                fill="#0a0a18"
                opacity={0.96}
              />
            )}
          </g>
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <p className="moon-illum-label">{Math.round(illum * 100)} % osvětlení</p>
    </div>
  );
}
