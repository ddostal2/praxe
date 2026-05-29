import { BODIES } from '../planets';

export { BODIES };

export const COMPARE_METRICS = [
  {
    key: 'diameterKm',
    label: 'Průměr',
    format: (v) => `${v.toLocaleString('cs-CZ')} km`,
    higherIsLarger: true,
  },
  {
    key: 'massKg',
    label: 'Hmotnost',
    format: (v) => formatMass(v),
    higherIsLarger: true,
  },
  {
    key: 'gravityMs2',
    label: 'Povrchová gravitace',
    format: (v) => `${v.toFixed(2)} m/s²`,
    higherIsLarger: true,
  },
  {
    key: 'dayLabel',
    label: 'Délka dne (rotace)',
    format: (v) => v,
    compareNumeric: false,
  },
  {
    key: 'orbitLabel',
    label: 'Doba oběhu',
    format: (v) => v,
    compareNumeric: false,
  },
  {
    key: 'distanceFromSunAu',
    label: 'Vzdálenost od Slunce',
    format: (v) => `${v.toFixed(3)} AU`,
    higherIsLarger: true,
  },
  {
    key: 'avgSurfaceTempC',
    label: 'Prům. povrchová teplota',
    format: (v) => (v == null ? '−173 až +127 °C' : `${v > 0 ? '+' : ''}${v} °C`),
    higherIsLarger: true,
    skipHighlight: (v) => v == null,
  },
  {
    key: 'atmosphere',
    label: 'Atmosféra',
    format: (v) => v,
    compareNumeric: false,
  },
  {
    key: 'moons',
    label: 'Počet měsíců',
    format: (v) => String(v),
    higherIsLarger: true,
  },
];

function formatMass(kg) {
  if (kg >= 1e24) return `${(kg / 1e24).toFixed(2)} × 10²⁴ kg`;
  if (kg >= 1e23) return `${(kg / 1e23).toFixed(2)} × 10²³ kg`;
  if (kg >= 1e22) return `${(kg / 1e22).toFixed(2)} × 10²² kg`;
  return `${kg.toExponential(2)} kg`;
}
