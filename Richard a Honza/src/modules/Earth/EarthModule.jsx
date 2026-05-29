import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  Snowflake, 
  CloudLightning,
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Clock, 
  Compass, 
  Star,
  Navigation,
  Search,
  AlertTriangle
} from 'lucide-react';
import './EarthModule.css';

// --------------------------------------------------------------------------
// STATIC QUICK LINKS CONFIGURATION
// --------------------------------------------------------------------------
const STATIC_LOCATIONS = [
  {
    id: 'praha',
    name: 'Praha',
    country: 'Česká republika',
    flag: '🇨🇿',
    lat: 50.0755,
    lon: 14.4378,
    mapX: 108, // Hand-tuned map coordinates
    mapY: 58,
    timezone: 'Europe/Prague',
    timezoneOffset: () => getOffsetForTimezone('Europe/Prague')
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Austrálie',
    flag: '🇦🇺',
    lat: -33.8688,
    lon: 151.2093,
    mapX: 165,
    mapY: 138,
    timezone: 'Australia/Sydney',
    timezoneOffset: () => getOffsetForTimezone('Australia/Sydney')
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'Spojené státy',
    flag: '🇺🇸',
    lat: 40.7128,
    lon: -74.0060,
    mapX: 55,
    mapY: 72,
    timezone: 'America/New_York',
    timezoneOffset: () => getOffsetForTimezone('America/New_York')
  },
  {
    id: 'tokio',
    name: 'Tokio',
    country: 'Japonsko',
    flag: '🇯🇵',
    lat: 35.6762,
    lon: 139.6503,
    mapX: 168,
    mapY: 62,
    timezone: 'Asia/Tokyo',
    timezoneOffset: () => getOffsetForTimezone('Asia/Tokyo')
  },
  {
    id: 'reykjavik',
    name: 'Reykjavík',
    country: 'Island',
    flag: '🇮🇸',
    lat: 64.1466,
    lon: -21.9426,
    mapX: 89,
    mapY: 45,
    timezone: 'Atlantic/Reykjavik',
    timezoneOffset: () => getOffsetForTimezone('Atlantic/Reykjavik')
  }
];

// --------------------------------------------------------------------------
// WEATHER TRANSLATOR & WMO CODE MAPPER
// --------------------------------------------------------------------------
const getWeatherInfo = (code) => {
  switch (code) {
    case 0: 
      return { text: 'Jasno', icon: Sun };
    case 1: 
      return { text: 'Převážně jasno', icon: CloudSun };
    case 2: 
      return { text: 'Polojasno', icon: CloudSun };
    case 3: 
      return { text: 'Zataženo', icon: Cloud };
    case 45: 
    case 48: 
      return { text: 'Mlhavo', icon: CloudFog };
    case 51:
    case 53:
    case 55: 
      return { text: 'Slabé mrholení', icon: CloudDrizzle };
    case 61:
    case 63:
    case 65: 
      return { text: 'Déšť', icon: CloudRain };
    case 71:
    case 73:
    case 75: 
      return { text: 'Sněžení', icon: Snowflake };
    case 77: 
      return { text: 'Sněhové krupky', icon: Snowflake };
    case 80:
    case 81:
    case 82: 
      return { text: 'Dešťové přeháňky', icon: CloudRain };
    case 85:
    case 86: 
      return { text: 'Sněhové přeháňky', icon: Snowflake };
    case 95:
    case 96:
    case 99: 
      return { text: 'Bouřka s blesky', icon: CloudLightning };
    default: 
      return { text: 'Neznámé meteorologické podmínky', icon: Cloud };
  }
};

// --------------------------------------------------------------------------
// TIMEZONE OFFSET EXTRACTION & CALCULATIONS
// --------------------------------------------------------------------------
const getOffsetForTimezone = (timezoneStr) => {
  if (!timezoneStr) return 0;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneStr,
      timeZoneName: 'longOffset'
    });
    const parts = formatter.formatToParts(new Date());
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    if (offsetPart) {
      const val = offsetPart.value; // e.g. "GMT-4", "GMT+2", "GMT", "UTC"
      if (val === 'GMT' || val === 'UTC') return 0;
      const match = val.match(/([+-]\d+)(?::(\d+))?/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) / 60 : 0;
        return hours >= 0 ? hours + minutes : hours - minutes;
      }
    }
  } catch (e) {
    console.error("Timezone offset extraction error for:", timezoneStr, e);
  }
  
  // Fallbacks
  if (timezoneStr.includes('Prague') || timezoneStr.includes('Berlin') || timezoneStr.includes('Paris')) {
    const month = new Date().getMonth();
    return (month >= 2 && month <= 9) ? 2 : 1;
  }
  if (timezoneStr.includes('New_York')) {
    const month = new Date().getMonth();
    return (month >= 2 && month <= 10) ? -4 : -5;
  }
  if (timezoneStr.includes('Sydney')) {
    const month = new Date().getMonth();
    return (month >= 9 || month <= 2) ? 11 : 10;
  }
  if (timezoneStr.includes('Tokyo')) return 9;
  return 0;
};

const getLocalTime = (offsetFn) => {
  const offset = offsetFn();
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (3600000 * offset));
  
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const seconds = localDate.getSeconds();
  
  const decimalHours = hours + (minutes / 60) + (seconds / 3600);
  const timeString = localDate.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  return {
    decimalHours,
    timeString,
    offset
  };
};

// --------------------------------------------------------------------------
// DYNAMIC 2D ADAPTIVE PROJECTION
// --------------------------------------------------------------------------
const calculateMapCoordinates = (lat, lon) => {
  // Cylindrical/equirectangular scaling mapping to SVG viewport
  // X range [20, 180], Y range [20, 180] inside a circle of radius 80
  let x = 100 + (lon * 0.48);
  let y = 100 - (lat * 0.88);
  
  // Ensure the coordinate resides strictly within the circular boundary (clamped to radius 74)
  const dx = x - 100;
  const dy = y - 100;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist > 74) {
    x = 100 + (dx / dist) * 74;
    y = 100 + (dy / dist) * 74;
  }
  
  return { x, y };
};

export default function EarthModule() {
  const [selectedLocation, setSelectedLocation] = useState(STATIC_LOCATIONS[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeData, setTimeData] = useState(() => getLocalTime(STATIC_LOCATIONS[0].timezoneOffset));

  // Search input state management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Update time details every second
  useEffect(() => {
    const update = () => {
      setTimeData(getLocalTime(selectedLocation.timezoneOffset));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  // Fetch weather data from Open-Meteo API when location shifts
  useEffect(() => {
    let isMounted = true;
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Chyba při komunikaci se satelitem počasí.');
        }
        const data = await res.json();
        
        if (isMounted) {
          if (data && data.current) {
            setWeather(data.current);
          } else {
            throw new Error('Přijata neplatná data o počasí.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Nepodařilo se navázat spojení se meteorologickou stanicí.');
          setLoading(false);
        }
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  // Geocoding API handler for dynamic search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Nepodařilo se spojit se satelitním registrem měst.');
      }
      
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        throw new Error('Město nebylo nalezeno, zkontrolujte prosím překlepy.');
      }

      const city = data.results[0];
      const coords = calculateMapCoordinates(city.latitude, city.longitude);

      const customLocation = {
        id: `custom-${city.id || Date.now()}`,
        name: city.name,
        country: city.country || 'Pozemská federace',
        flag: '📍',
        lat: city.latitude,
        lon: city.longitude,
        mapX: coords.x,
        mapY: coords.y,
        timezone: city.timezone || 'UTC',
        timezoneOffset: () => getOffsetForTimezone(city.timezone || 'UTC')
      };

      setSelectedLocation(customLocation);
      setSearchQuery('');
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // REPAIRED DYNAMIC TERMINATOR LOGIC
  // Centers terminator dynamically using selected city coordinate and local time
  // --------------------------------------------------------------------------
  const renderTerminatorStops = () => {
    const H = timeData.decimalHours;
    const P = (selectedLocation.mapX / 200) * 100; // City horizontal coordinate as percentage [0, 100]
    
    if (H === 12) {
      return <stop offset="100%" stopColor="#ffffff" />;
    }
    if (H === 0 || H === 24) {
      return <stop offset="100%" stopColor="#000000" />;
    }

    let X_term;
    if (H > 0 && H <= 12) {
      if (H <= 6) {
        X_term = 100 - (H / 6) * (100 - P);
      } else {
        X_term = P - ((H - 6) / 6) * P;
      }
      const startClamped = Math.max(0, Math.min(100, X_term - 12));
      const endClamped = Math.max(0, Math.min(100, X_term + 12));
      return (
        <>
          <stop offset={`${startClamped}%`} stopColor="#000000" />
          <stop offset={`${endClamped}%`} stopColor="#ffffff" />
        </>
      );
    } else {
      const H_after = H - 12;
      if (H_after <= 6) {
        X_term = 100 - (H_after / 6) * (100 - P);
      } else {
        X_term = P - ((H_after - 6) / 6) * P;
      }
      const startClamped = Math.max(0, Math.min(100, X_term - 12));
      const endClamped = Math.max(0, Math.min(100, X_term + 12));
      return (
        <>
          <stop offset={`${startClamped}%`} stopColor="#ffffff" />
          <stop offset={`${endClamped}%`} stopColor="#000000" />
        </>
      );
    }
  };

  const weatherInfo = weather ? getWeatherInfo(weather.weather_code) : null;
  const WeatherIcon = weatherInfo ? weatherInfo.icon : Cloud;

  // Helper to render dynamic satellite connection status
  const getSatelliteStatus = () => {
    if (loading) return { text: 'PŘIPOJOVÁNÍ...', color: '#ffd700' };
    if (error) return { text: 'CHYBA SPOJENÍ', color: '#ef4444' };
    return { text: 'ONLINE / OK', color: '#00e676' };
  };
  const satStatus = getSatelliteStatus();

  // Helper to check if active city is in the static quick links list
  const isStaticActive = (staticId) => {
    return selectedLocation.id === staticId;
  };

  return (
    <div className="earth-container">
      {/* Enhanced Cosmic Meteor Shower Background (20 dynamically layered meteors) */}
      <div className="meteor-container">
        {/* Cyan trails (foreground/mid-ground) */}
        <div className="meteor meteor-1 meteor-cyan" />
        <div className="meteor meteor-2 meteor-cyan" />
        <div className="meteor meteor-5 meteor-cyan" />
        <div className="meteor meteor-6 meteor-cyan" />
        <div className="meteor meteor-9 meteor-cyan" />
        <div className="meteor meteor-11 meteor-cyan" />
        <div className="meteor meteor-14 meteor-cyan" />
        <div className="meteor meteor-15 meteor-cyan" />
        <div className="meteor meteor-19 meteor-cyan" />
        <div className="meteor meteor-20 meteor-cyan" />

        {/* White trails (foreground sparks & deep highlights) */}
        <div className="meteor meteor-4 meteor-white" />
        <div className="meteor meteor-7 meteor-white" />
        <div className="meteor meteor-10 meteor-white" />
        <div className="meteor meteor-12 meteor-white" />
        <div className="meteor meteor-13 meteor-white" />
        <div className="meteor meteor-17 meteor-white" />

        {/* Purple/Indigo trails (deep space spectral rays) */}
        <div className="meteor meteor-3 meteor-purple" />
        <div className="meteor meteor-8 meteor-purple" />
        <div className="meteor meteor-16 meteor-purple" />
        <div className="meteor meteor-18 meteor-purple" />
      </div>

      {/* Header with Title */}
      <header className="earth-header">
        <h1 className="earth-title">
          <span>🌍</span> MODUL ZEMĚ
        </h1>

        {/* Dynamic Geocoding Search Control Panel */}
        <div className="search-control-panel">
          <form className="search-form-row" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} className="search-input-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Hledat pozemské město..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={searchLoading}
              />
            </div>
            <button type="submit" className="search-btn" disabled={searchLoading}>
              {searchLoading ? (
                <div className="search-btn-spinner" />
              ) : (
                <>
                  <Navigation size={16} /> Vyhledat
                </>
              )}
            </button>
          </form>

          {/* Quick links tag selectors underneath */}
          <div className="quick-links-row">
            <span className="quick-links-label">Rychlá volba:</span>
            <div className="quick-links-nav">
              {STATIC_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  className={`quick-tag-btn ${isStaticActive(loc.id) ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setSearchError(null);
                  }}
                >
                  <span>{loc.flag}</span> {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Error Indicator */}
          {searchError && (
            <div className="search-error-msg">
              <AlertTriangle size={16} />
              <span>{searchError}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="earth-content">
        {/* Left Side: Weather and Location Details */}
        <section className="earth-data-column">
          <div className="glass-card location-info-card">
            {/* Title / Coordinates */}
            <div className="location-title-row">
              <div className="location-name-container">
                <h2 className="location-name">
                  {selectedLocation.flag} {selectedLocation.name}
                </h2>
                <span className="location-country">{selectedLocation.country}</span>
              </div>
              
              <div className="clock-container">
                <span className="clock-label">Místní čas</span>
                <span className="clock-time">{timeData.timeString}</span>
                <span className="timezone-tag" title={selectedLocation.timezone}>
                  {selectedLocation.timezone.split('/').pop().replace('_', ' ')} (UTC {timeData.offset >= 0 ? `+${timeData.offset}` : timeData.offset})
                </span>
              </div>
            </div>

            <div className="location-coordinates" style={{ marginBottom: '2rem' }}>
              <div className="coord-tag">
                <strong>Šířka:</strong> {selectedLocation.lat.toFixed(4)}°
              </div>
              <div className="coord-tag">
                <strong>Délka:</strong> {selectedLocation.lon.toFixed(4)}°
              </div>
            </div>

            {/* Weather details panel */}
            <h3 className="weather-panel-title">
              <Compass size={18} /> ATMOSFÉRICKÁ DATA
            </h3>

            {/* Weather overview display */}
            {loading ? (
              <div className="weather-overview">
                <Cloud size={56} className="weather-large-icon animate-pulse" />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">--</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text">Připojování k družici...</span>
                </div>
              </div>
            ) : error ? (
              <div className="weather-overview">
                <AlertTriangle size={56} className="weather-large-icon" style={{ color: '#ef4444' }} />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">--</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text" style={{ color: '#ef4444' }}>Chyba spojení</span>
                </div>
              </div>
            ) : (
              <div className="weather-overview">
                <WeatherIcon size={56} className="weather-large-icon" />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">{Math.round(weather.temperature_2m)}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text">{weatherInfo.text}</span>
                </div>
              </div>
            )}

            {/* Metrics Dashboard Grid */}
            <div className="weather-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box">
                  <Thermometer size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Teplota vzduchu</span>
                  <span className="metric-value">
                    {loading || error || !weather ? '-- °C' : `${Math.round(weather.temperature_2m)} °C`}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <Droplets size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Relativní vlhkost</span>
                  <span className="metric-value">
                    {loading || error || !weather ? '-- %' : `${weather.relative_humidity_2m} %`}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <Wind size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Rychlost větru</span>
                  <span className="metric-value">
                    {loading || error || !weather ? '-- km/h' : `${weather.wind_speed_10m.toFixed(1)} km/h`}
                  </span>
                </div>
              </div>

              {/* Dynamic Satellite Status Metric Card */}
              <div className="metric-card">
                <div className="metric-icon-box">
                  <Navigation size={20} style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Satelitní stav</span>
                  <span className="metric-value" style={{ color: satStatus.color, fontWeight: 800 }}>
                    {satStatus.text}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Retry helper if error occurs */}
            {error && (
              <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                <button 
                  className="retry-btn" 
                  onClick={() => setSelectedLocation({...selectedLocation})}
                >
                  Opakovat spojení
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Day/Night Globe Terminator */}
        <section className="earth-visual-column">
          <div className="globe-wrapper">
            <div className="globe-glow-ambient" />
            
            <svg viewBox="0 0 200 200" className="earth-svg">
              <defs>
                {/* Atmosphere outer gradient */}
                <radialGradient id="earth-atmosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="85%" stopColor="#0a0f24" stopOpacity="0" />
                  <stop offset="94%" stopColor="#00f0ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </radialGradient>

                {/* Day ocean glow */}
                <radialGradient id="day-ocean" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#005fa3" />
                  <stop offset="70%" stopColor="#002d5a" />
                  <stop offset="100%" stopColor="#001830" />
                </radialGradient>

                {/* Day Land neon gradient */}
                <linearGradient id="day-land" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#00b0ff" />
                </linearGradient>

                {/* Earth sphere clipping boundary */}
                <clipPath id="earth-clip">
                  <circle cx="100" cy="100" r="80" />
                </clipPath>

                {/* Dynamic Day/Night Terminator Mask */}
                <linearGradient id="terminator-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  {renderTerminatorStops()}
                </linearGradient>

                <mask id="day-mask">
                  <rect x="0" y="0" width="200" height="200" fill="url(#terminator-grad)" />
                </mask>
              </defs>

              {/* Atmosphere Outer Ring Glow */}
              <circle cx="100" cy="100" r="90" fill="url(#earth-atmosphere)" />
              <circle cx="100" cy="100" r="80" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="0.75" fill="none" />

              {/* Masked Earth Sphere Globe */}
              <g clipPath="url(#earth-clip)">
                {/* --------------------------------------------------------
                   NIGHT SIDE LAYER (Default base layer underneath)
                   -------------------------------------------------------- */}
                <rect x="0" y="0" width="200" height="200" fill="#040612" />
                
                {/* Night Continents - Deep dark blue outline & shape */}
                <g opacity="0.85">
                  {/* North America */}
                  <path d="M 45,45 L 52,38 L 60,42 L 68,40 L 72,48 L 62,56 L 68,64 L 62,70 L 52,72 L 55,80 L 62,82 L 58,92 L 64,100 L 56,110 L 46,112 L 40,108 L 45,100 L 38,92 L 40,84 L 35,76 L 25,72 L 28,60 L 34,54 L 32,48 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* South America */}
                  <path d="M 56,110 L 58,118 L 65,124 L 72,120 L 78,128 L 74,138 L 66,145 L 60,155 L 56,170 L 53,172 L 51,168 L 54,152 L 52,142 L 46,134 L 42,126 L 45,115 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* Europe / Asia */}
                  <path d="M 90,52 L 96,44 L 105,40 L 115,38 L 128,32 L 142,32 L 155,36 L 168,34 L 175,40 L 172,48 L 165,48 L 168,54 L 176,50 L 180,60 L 172,66 L 165,62 L 160,68 L 156,76 L 162,82 L 168,80 L 172,86 L 165,92 L 158,88 L 150,92 L 144,98 L 140,105 L 142,112 L 136,118 L 128,110 L 125,98 L 120,95 L 115,98 L 116,90 L 110,88 L 105,94 L 98,90 L 92,84 L 96,78 L 92,72 L 95,64 L 88,60 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* Africa */}
                  <path d="M 95,92 L 104,95 L 110,90 L 116,92 L 120,96 L 124,104 L 128,112 L 126,122 L 122,132 L 118,142 L 114,152 L 109,158 L 107,152 L 108,140 L 105,130 L 102,122 L 98,116 L 94,110 L 92,102 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* Australia */}
                  <path d="M 152,132 L 162,128 L 170,132 L 174,142 L 168,148 L 158,146 L 150,140 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* Greenland */}
                  <path d="M 72,28 L 82,24 L 78,34 L 70,36 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                  {/* Iceland */}
                  <path d="M 89,45 L 91,44 L 90,46 Z" fill="#0d122b" stroke="#18224d" strokeWidth="0.5" />
                </g>

                {/* Faint Glowing Golden City Lights on Night Side */}
                <g fill="#ffd700">
                  <circle cx="55" cy="72" r="1.5" className="city-light" style={{ animationDelay: '0.2s' }} />
                  <circle cx="100" cy="54" r="1.2" className="city-light" style={{ animationDelay: '0.6s' }} />
                  <circle cx="168" cy="62" r="1.5" className="city-light" style={{ animationDelay: '0.9s' }} />
                  <circle cx="165" cy="138" r="1.2" className="city-light" style={{ animationDelay: '0.1s' }} />
                  <circle cx="108" cy="58" r="1.4" className="city-light" style={{ animationDelay: '0s' }} />
                  <circle cx="140" cy="98" r="1.2" className="city-light" style={{ animationDelay: '1.5s' }} />
                  <circle cx="70" cy="138" r="1.3" className="city-light" style={{ animationDelay: '1.2s' }} />
                  <circle cx="116" cy="92" r="1.2" className="city-light" style={{ animationDelay: '0.8s' }} />
                  <circle cx="114" cy="152" r="1" className="city-light" style={{ animationDelay: '0.4s' }} />
                </g>

                {/* --------------------------------------------------------
                   DAY SIDE LAYER (Revealed dynamically via SVG mask)
                   -------------------------------------------------------- */}
                <g mask="url(#day-mask)">
                  <rect x="0" y="0" width="200" height="200" fill="url(#day-ocean)" />

                  {/* Day Continents - Vibrant cyber gradient */}
                  <g filter="drop-shadow(0 0 2px rgba(0, 240, 255, 0.4))">
                    <path d="M 45,45 L 52,38 L 60,42 L 68,40 L 72,48 L 62,56 L 68,64 L 62,70 L 52,72 L 55,80 L 62,82 L 58,92 L 64,100 L 56,110 L 46,112 L 40,108 L 45,100 L 38,92 L 40,84 L 35,76 L 25,72 L 28,60 L 34,54 L 32,48 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 56,110 L 58,118 L 65,124 L 72,120 L 78,128 L 74,138 L 66,145 L 60,155 L 56,170 L 53,172 L 51,168 L 54,152 L 52,142 L 46,134 L 42,126 L 45,115 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 90,52 L 96,44 L 105,40 L 115,38 L 128,32 L 142,32 L 155,36 L 168,34 L 175,40 L 172,48 L 165,48 L 168,54 L 176,50 L 180,60 L 172,66 L 165,62 L 160,68 L 156,76 L 162,82 L 168,80 L 172,86 L 165,92 L 158,88 L 150,92 L 144,98 L 140,105 L 142,112 L 136,118 L 128,110 L 125,98 L 120,95 L 115,98 L 116,90 L 110,88 L 105,94 L 98,90 L 92,84 L 96,78 L 92,72 L 95,64 L 88,60 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 95,92 L 104,95 L 110,90 L 116,92 L 120,96 L 124,104 L 128,112 L 126,122 L 122,132 L 118,142 L 114,152 L 109,158 L 107,152 L 108,140 L 105,130 L 102,122 L 98,116 L 94,110 L 92,102 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 152,132 L 162,128 L 170,132 L 174,142 L 168,148 L 158,146 L 150,140 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 72,28 L 82,24 L 78,34 L 70,36 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                    <path d="M 89,45 L 91,44 L 90,46 Z" fill="url(#day-land)" stroke="#00f0ff" strokeWidth="0.4" />
                  </g>
                </g>

                {/* --------------------------------------------------------
                   GLOBE CYBER NET OVERLAY (Always visible on top)
                   -------------------------------------------------------- */}
                <g stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.4" fill="none">
                  <circle cx="100" cy="100" r="20" />
                  <circle cx="100" cy="100" r="40" />
                  <circle cx="100" cy="100" r="60" />
                  <line x1="20" y1="100" x2="180" y2="100" />
                  <line x1="100" y1="20" x2="100" y2="180" />
                  <path d="M 100,20 Q 130,100 100,180" />
                  <path d="M 100,20 Q 70,100 100,180" />
                  <path d="M 100,20 Q 155,100 100,180" />
                  <path d="M 100,20 Q 45,100 100,180" />
                </g>

                {/* --------------------------------------------------------
                   DYNAMIC PULSING SELECTOR RING FOR ACTIVE CITY
                   -------------------------------------------------------- */}
                <g>
                  <circle 
                    cx={selectedLocation.mapX} 
                    cy={selectedLocation.mapY} 
                    r="6" 
                    fill="none" 
                    stroke="#00f0ff" 
                    strokeWidth="1.5" 
                    className="target-ring" 
                  />
                  <circle 
                    cx={selectedLocation.mapX} 
                    cy={selectedLocation.mapY} 
                    r="2.5" 
                    fill="#ffffff" 
                    stroke="#0072ff"
                    strokeWidth="1.2"
                    className="target-dot" 
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Interactive environmental status log */}
          <div className="terminator-info-box">
            <span>Senzorický log: Zobrazena hemisféra centrována na <strong>{selectedLocation.name}</strong>. Hranice stínu simuluje optický terminátor k místnímu času <strong>{timeData.timeString}</strong>. Den se posouvá z Východu na Západ rychlostí 15°/hod.</span>
          </div>
        </section>
      </main>
    </div>
  );
}
