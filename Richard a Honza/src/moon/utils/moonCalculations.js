export const PHASE_LABELS_CZ = {
  'new-moon': 'Nov (Novoluní)',
  'waxing-crescent': 'Dorůstající srpek',
  'first-quarter': 'První čtvrť',
  'waxing-gibbous': 'Dorůstající měsíc',
  'full-moon': 'Úplněk',
  'waning-gibbous': 'Couvající měsíc',
  'last-quarter': 'Poslední čtvrť',
  'waning-crescent': 'Ubývající srpek',
};

export const RISK_LABELS_CZ = {
  low: 'Nízké',
  medium: 'Střední',
  high: 'Vysoké',
};

export function calculateMoonPhase() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const JDN =
    367 * year -
    Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
    Math.floor((275 * month) / 9) +
    day +
    1721013.5;

  const ip = (JDN - 2451550.1) / 29.530588853;
  const age = ip - Math.floor(ip);
  const phaseAngle = age * 360;

  let phaseName;
  if (phaseAngle < 22.5) {
    phaseName = 'new-moon';
  } else if (phaseAngle < 67.5) {
    phaseName = 'waxing-crescent';
  } else if (phaseAngle < 112.5) {
    phaseName = 'first-quarter';
  } else if (phaseAngle < 157.5) {
    phaseName = 'waxing-gibbous';
  } else if (phaseAngle < 202.5) {
    phaseName = 'full-moon';
  } else if (phaseAngle < 247.5) {
    phaseName = 'waning-gibbous';
  } else if (phaseAngle < 292.5) {
    phaseName = 'last-quarter';
  } else if (phaseAngle < 337.5) {
    phaseName = 'waning-crescent';
  } else {
    phaseName = 'new-moon';
  }

  const isDay = phaseAngle > 90 && phaseAngle < 270;

  const surfaceTemperature = isDay
    ? 100 + Math.random() * 27
    : -150 + Math.random() * 30;

  const riskRandom = Math.random();
  const micrometeoroidRisk =
    riskRandom < 0.6 ? 'low' : riskRandom < 0.9 ? 'medium' : 'high';

  const solarRadiation = isDay
    ? 1200 + Math.random() * 200
    : 50 + Math.random() * 100;

  return {
    surfaceTemperature,
    micrometeoroidRisk,
    solarRadiation,
    phaseAngle,
    phaseName,
    illumination: (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2,
    age,
    isLunarDay: isDay,
    updatedAt: date,
  };
}
