export function calculateMoonPhase() {
    const date = new Date();

    // Calculate moon phase
    // This is a simplified algorithm for moon phase calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Calculate approximate phase angle (0-360 degrees)
    // const c = 279.9348; // Circular orbit constant
    // const r = (year - 2000) * 365.25; // Rough day number

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

    return {
        surfaceTemperature,
        micrometeoroidRisk,
        solarRadiation,
        phaseAngle,
        phaseName
    };
}