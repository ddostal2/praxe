/**
 * Earth Weather API service using Open-Meteo API.
 */

// Statically configured locations for Earth weather selection
export const EARTH_LOCATIONS = [
  { id: 'prague', name: 'Praha, Česko', latitude: 50.0755, longitude: 14.4378 },
  { id: 'new-york', name: 'New York, USA', latitude: 40.7128, longitude: -74.0060 },
  { id: 'sydney', name: 'Sydney, Austrálie', latitude: -33.8688, longitude: 151.2093 },
  { id: 'tokyo', name: 'Tokio, Japonsko', latitude: 35.6762, longitude: 139.6503 }
];

// Map WMO Weather Interpretation Codes to Czech conditions
export const WEATHER_CONDITIONS_CZ = {
  0: 'Jasno',
  1: 'Převážně jasno',
  2: 'Polojasno',
  3: 'Zataženo',
  45: 'Mlha',
  48: 'Jinovatka',
  51: 'Mrholení',
  53: 'Mírné mrholení',
  55: 'Husté mrholení',
  56: 'Mrznoucí mrholení',
  57: 'Husté mrznoucí mrholení',
  61: 'Slabý déšť',
  63: 'Mírný déšť',
  65: 'Silný déšť',
  66: 'Slabý mrznoucí déšť',
  67: 'Silný mrznoucí déšť',
  71: 'Slabé sněžení',
  73: 'Mírné sněžení',
  75: 'Silné sněžení',
  77: 'Sněhové krupice',
  80: 'Slabé přeháňky',
  81: 'Mírné přeháňky',
  82: 'Silné přeháňky',
  85: 'Slabé sněhové přeháňky',
  86: 'Silné sněhové přeháňky',
  95: 'Bouřka',
  96: 'Bouřka s krupobitím',
  99: 'Silná bouřka s krupobitím'
};

/**
 * Fetches current weather for a specific latitude and longitude.
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Formatted weather data
 */
export async function fetchEarthWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.current) {
      throw new Error('Invalid response structure from weather API');
    }
    
    const current = data.current;
    const code = current.weather_code;
    const conditionText = WEATHER_CONDITIONS_CZ[code] || 'Neznámé počasí';
    
    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      condition: conditionText,
      weatherCode: code,
      isDay: current.is_day === 1,
      timestamp: current.time,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Error fetching Earth weather:', error);
    // Provide robust fallback data in case the API is offline
    return {
      temperature: 15.5,
      humidity: 62,
      windSpeed: 12.4,
      windDirection: 180,
      condition: 'Polojasno (Nouzová data)',
      weatherCode: 2,
      isDay: true,
      timestamp: new Date().toISOString(),
      timezone: 'UTC',
      isFallback: true
    };
  }
}
