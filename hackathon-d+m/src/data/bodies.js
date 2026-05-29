/** Charakteristiky nebeských těles sluneční soustavy (orientační hodnoty NASA). */

export const BODIES = [
  {
    id: 'earth',
    name: 'Země',
    accent: 'earth',
    diameterKm: 12_742,
    massKg: 5.972e24,
    gravityMs2: 9.807,
    dayLabel: '24 h',
    orbitLabel: '365 dní kolem Slunce',
    distanceFromSunAu: 1,
    avgSurfaceTempC: 15,
    atmosphere: 'N₂, O₂ (21 % kyslíku)',
    moons: 1,
  },
  {
    id: 'mars',
    name: 'Mars',
    accent: 'mars',
    diameterKm: 6_779,
    massKg: 6.39e23,
    gravityMs2: 3.721,
    dayLabel: '24,6 h',
    orbitLabel: '687 dní kolem Slunce',
    distanceFromSunAu: 1.524,
    avgSurfaceTempC: -63,
    atmosphere: 'CO₂ (tenká)',
    moons: 2,
  },
  {
    id: 'moon',
    name: 'Měsíc',
    accent: 'moon',
    diameterKm: 3_474,
    massKg: 7.342e22,
    gravityMs2: 1.62,
    dayLabel: '27,3 dní (vázaný)',
    orbitLabel: '27,3 dní kolem Země',
    distanceFromSunAu: 1,
    avgSurfaceTempC: null,
    atmosphere: 'Žádná',
    moons: 0,
    note: 'Oběžná dráha kolem Země (~384 400 km)',
  },
];

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
