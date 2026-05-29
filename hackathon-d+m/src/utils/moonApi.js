/**
 * Astronomical Julian Day Number epoch constant (for year 2000).
 * @type {number}
 */
const JDN_EPOCH_2000 = 2451550.1;

/**
 * Average duration of a synodic (lunar) month in days.
 * @type {number}
 */
const LUNAR_MONTH_DAYS = 29.530588853;

/**
 * Total degrees in a full circle orbit.
 * @type {number}
 */
const DEGREES_IN_CIRCLE = 360;

/**
 * Definition of lunar phases by their maximum phase angle limit.
 */
const MOON_PHASES = [
  { maxAngle: 22.5, name: 'new-moon' },
  { maxAngle: 67.5, name: 'waxing-crescent' },
  { maxAngle: 112.5, name: 'first-quarter' },
  { maxAngle: 157.5, name: 'waxing-gibbous' },
  { maxAngle: 202.5, name: 'full-moon' },
  { maxAngle: 247.5, name: 'waning-gibbous' },
  { maxAngle: 292.5, name: 'last-quarter' },
  { maxAngle: 337.5, name: 'waning-crescent' },
];

/**
 * Probability thresholds for simulated lunar micrometeoroid risks.
 */
const MICROMETEOROID_LOW_THRESHOLD = 0.6;
const MICROMETEOROID_MEDIUM_THRESHOLD = 0.9;

/** Temperature simulation bounds (°C) */
const TEMP_DAY_BASE = 100;
const TEMP_DAY_VAR = 27;
const TEMP_NIGHT_BASE = -150;
const TEMP_NIGHT_VAR = 30;

/** Solar radiation simulation bounds (W/m²) */
const RAD_DAY_BASE = 1200;
const RAD_DAY_VAR = 200;
const RAD_NIGHT_BASE = 50;
const RAD_NIGHT_VAR = 100;

/**
 * Calculates current Moon phase angle/name and generates simulated real-time
 * lunar environmental telemetry (temperature, radiation, and micrometeoroid risk).
 *
 * @returns {{
 *   surfaceTemperature: number,
 *   micrometeoroidRisk: 'low' | 'medium' | 'high',
 *   solarRadiation: number,
 *   phaseAngle: number,
 *   phaseName: string
 * }} Object containing moon phase details and simulated environmental metrics.
 * 
 * @example
 * const telemetry = calculateMoonPhase();
 */
export function calculateMoonPhase() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // JDN (Julian Day Number) calculation using standard astronomical algorithms
  const JDN = (367 * year) - 
              Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
              Math.floor(275 * month / 9) + 
              day + 
              1721013.5;

  // Approximate Phase angle (0 = new moon, 180 = full moon, 360 = new moon)
  const ip = (JDN - JDN_EPOCH_2000) / LUNAR_MONTH_DAYS;
  const age = ip - Math.floor(ip);
  const phaseAngle = age * DEGREES_IN_CIRCLE;

  // Determine matching phase name from configured phase limits
  const phase = MOON_PHASES.find((p) => phaseAngle < p.maxAngle);
  const phaseName = phase ? phase.name : 'new-moon';

  // Determine if it is currently lunar day at the primary location (sun angle > 90° and < 270°)
  const isDay = phaseAngle > 90 && phaseAngle < 270;

  // Surface temperature varies based on day/night (-173°C to 127°C)
  const surfaceTemperature = isDay
    ? TEMP_DAY_BASE + Math.random() * TEMP_DAY_VAR
    : TEMP_NIGHT_BASE + Math.random() * TEMP_NIGHT_VAR;

  // Randomize micrometeoroid risk
  const riskRandom = Math.random();
  let micrometeoroidRisk = 'high';
  if (riskRandom < MICROMETEOROID_LOW_THRESHOLD) {
    micrometeoroidRisk = 'low';
  } else if (riskRandom < MICROMETEOROID_MEDIUM_THRESHOLD) {
    micrometeoroidRisk = 'medium';
  }

  // Solar radiation is higher during lunar day
  const solarRadiation = isDay
    ? RAD_DAY_BASE + Math.random() * RAD_DAY_VAR
    : RAD_NIGHT_BASE + Math.random() * RAD_NIGHT_VAR;

  return {
    surfaceTemperature,
    micrometeoroidRisk,
    solarRadiation,
    phaseAngle,
    phaseName,
  };
}