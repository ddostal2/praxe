/**
 * @typedef {Object} Body
 * @property {string} id - Unique identifier for the body (e.g. 'earth').
 * @property {string} name - Czech display name of the body (e.g. 'Země').
 * @property {string} accent - The theme key used to styled classes (e.g. 'earth').
 * @property {number} diameterKm - Diameter of the body in kilometers.
 * @property {number} massKg - Scientific mass of the body in kilograms.
 * @property {number} gravityMs2 - Surface gravity in meters per second squared.
 * @property {string} dayLabel - Text describing duration of one rotation (day).
 * @property {string} orbitLabel - Text describing duration of orbit (year).
 * @property {number} distanceFromSunAu - Distance from Sun in Astronomical Units.
 * @property {number|null} avgSurfaceTempC - Average surface temperature in Celsius, or null if variable.
 * @property {string} atmosphere - Description of chemical composition of the atmosphere.
 * @property {number} moons - The number of satellites (moons).
 * @property {string} [note] - Optional additional context notes about the body's orbit or characteristics.
 */

/**
 * Standard parameters and specifications for planet Earth.
 * @type {Body}
 */
export const EARTH = {
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
};

/**
 * Standard parameters and specifications for planet Mars.
 * @type {Body}
 */
export const MARS = {
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
};

/**
 * Standard parameters and specifications for the Moon.
 * @type {Body}
 */
export const MOON = {
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
};

/**
 * Array containing all configured celestial bodies.
 * @type {Body[]}
 */
export const BODIES = [EARTH, MARS, MOON];
