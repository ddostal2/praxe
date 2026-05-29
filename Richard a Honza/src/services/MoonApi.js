/**
 * Moon phase and simulated environmental data API service.
 */

// Czech translations and details for Moon phases
export const MOON_PHASES_CZ = {
  'new-moon': {
    name: 'Nov (Novoluní)',
    description: 'Měsíc se nachází mezi Sluncem a Zemí. Jeho osvětlená polovina směřuje pryč od Země, takže ho na obloze nevidíme.'
  },
  'waxing-crescent': {
    name: 'Dorůstající srpek',
    description: 'Měsíc se pomalu přesouvá na východ od Slunce. Na pravé straně disku se objevuje úzký zářící srpek ve tvaru písmene D.'
  },
  'first-quarter': {
    name: 'První čtvrť',
    description: 'Měsíc urazil čtvrtinu své dráhy kolem Země. Pravá polovina disku je osvětlená, levá je ve stínu.'
  },
  'waxing-gibbous': {
    name: 'Dorůstající měsíc (vypouklý)',
    description: 'Většina povrchu Měsíce je již osvětlená Sluncem, temný zůstává pouze úzký srpek na levé straně.'
  },
  'full-moon': {
    name: 'Úplněk',
    description: 'Měsíc stojí naproti Slunci a jeho přivrácená polokoule je plně osvětlená. Na obloze září jako jasný kruh.'
  },
  'waning-gibbous': {
    name: 'Couvající měsíc (vypouklý)',
    description: 'Po úplňku začíná stín z pravé strany postupně zakrývat měsíční kotouč.'
  },
  'last-quarter': {
    name: 'Poslední čtvrť',
    description: 'Měsíc má za sebou tři čtvrtiny oběhu. Osvětlená je levá polovina disku (tvar písmene C), pravá je ve stínu.'
  },
  'waning-crescent': {
    name: 'Ubývající srpek',
    description: 'Z Měsíce zbývá jen tenký srpek na levé straně, který se každým dnem ztenčuje, dokud Měsíc opět nezmizí v novu.'
  }
};

// Czech translations for micrometeoroid risk levels
export const RISK_LEVELS_CZ = {
  'low': 'Nízké',
  'medium': 'Střední',
  'high': 'Vysoké'
};

/**
 * Calculates the current moon phase and generates simulated lunar environmental data.
 * This is based on the simplified algorithm provided in the project specification.
 * 
 * @returns {Object} Moon phase and simulated environmental data
 */
export function calculateMoonPhase() {
  const date = new Date();
  
  // Calculate moon phase
  // This is a simplified algorithm for moon phase calculation
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // JDN = Julian Day Number
  const JDN = (367 * year) - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + 
              Math.floor(275 * month / 9) + day + 1721013.5;
              
  // Phase angle (0 = new, 180 = full)
  const ip = (JDN - 2451550.1) / 29.530588853;
  const age = ip - Math.floor(ip);
  const phaseAngle = age * 360; // Convert to degrees
  
  // Determine phase name
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
  
  // Generate simulated lunar environmental data based on phase
  const isDay = phaseAngle > 90 && phaseAngle < 270;
  
  // Surface temperature varies based on day/night (-173°C to 127°C)
  const surfaceTemperature = isDay ? 
    100 + Math.random() * 27 : // Day temperatures
    -150 + Math.random() * 30; // Night temperatures
    
  // Randomize micrometeoroid risk (more likely during certain phases)
  const riskRandom = Math.random();
  const micrometeoroidRisk = riskRandom < 0.6 ? 'low' : riskRandom < 0.9 ? 'medium' : 'high';
  
  // Solar radiation is higher during lunar day
  const solarRadiation = isDay ? 
    1200 + Math.random() * 200 : // High during day
    50 + Math.random() * 100;    // Low during night
  
  // Get translated name and details
  const translation = MOON_PHASES_CZ[phaseName] || { name: 'Neznámá fáze', description: '' };
  
  return {
    surfaceTemperature: Number(surfaceTemperature.toFixed(1)),
    micrometeoroidRisk,
    micrometeoroidRiskCZ: RISK_LEVELS_CZ[micrometeoroidRisk],
    solarRadiation: Number(solarRadiation.toFixed(1)),
    phaseAngle: Number(phaseAngle.toFixed(2)),
    phaseName,
    phaseNameCZ: translation.name,
    phaseDescriptionCZ: translation.description,
    isLunarDay: isDay
  };
}
