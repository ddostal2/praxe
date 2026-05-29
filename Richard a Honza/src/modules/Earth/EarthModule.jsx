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
// EQUIRECTANGULAR GEOMETRIC PROJECTION SOLVERS
// --------------------------------------------------------------------------
const getMapX = (lon) => 100 + (lon * 0.48);
const getMapY = (lat) => 100 - (lat * (160 / 180));

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
    mapX: getMapX(14.4378),
    mapY: getMapY(50.0755),
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
    mapX: getMapX(151.2093),
    mapY: getMapY(-33.8688),
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
    mapX: getMapX(-74.0060),
    mapY: getMapY(40.7128),
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
    mapX: getMapX(139.6503),
    mapY: getMapY(35.6762),
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
    mapX: getMapX(-21.9426),
    mapY: getMapY(64.1466),
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



const renderCityLights = () => (
  <>
    <circle cx="55" cy="72" r="1.5" className="city-light" style={{ animationDelay: '0.2s' }} />
    <circle cx="100" cy="54" r="1.2" className="city-light" style={{ animationDelay: '0.6s' }} />
    <circle cx="168" cy="62" r="1.5" className="city-light" style={{ animationDelay: '0.9s' }} />
    <circle cx="165" cy="138" r="1.2" className="city-light" style={{ animationDelay: '0.1s' }} />
    <circle cx="108" cy="58" r="1.4" className="city-light" style={{ animationDelay: '0s' }} />
    <circle cx="140" cy="98" r="1.2" className="city-light" style={{ animationDelay: '1.5s' }} />
    <circle cx="70" cy="138" r="1.3" className="city-light" style={{ animationDelay: '1.2s' }} />
    <circle cx="116" cy="92" r="1.2" className="city-light" style={{ animationDelay: '0.8s' }} />
    <circle cx="114" cy="152" r="1" className="city-light" style={{ animationDelay: '0.4s' }} />
  </>
);

const calculateMapCoordinates = (lat, lon) => {
  return {
    x: getMapX(lon),
    y: getMapY(lat)
  };
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

  // Helper to render shifted and wrapped layers horizontally (translated side-by-side at -172.8, 0, +172.8)
  const renderShiftedLayer = (children) => {
    const shift = 100 - selectedLocation.mapX;
    return (
      <g transform={`translate(${shift}, 0)`} className="globe-map-group">
        <g transform="translate(-172.8, 0)">{children}</g>
        <g transform="translate(0, 0)">{children}</g>
        <g transform="translate(172.8, 0)">{children}</g>
      </g>
    );
  };

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
  // MATHEMATICALLY PERFECT DYNAMIC SOLAR TERMINATOR LOGIC
  // Calculates global day/night boundaries based on UTC time (sun position)
  // Maps sunrise/sunset with seamless midnight wrapping and soft penumbra (±8%)
  // --------------------------------------------------------------------------
  const getTerminatorStops = (isInverse = false) => {
    // Decimal hours in local time of the selected location (range [0.0, 24.0])
    const H_local = timeData.decimalHours;

    // Because the map rotates to center the selected city at 50% width (X=100),
    // the sun's position on this disk is determined solely by local hours.
    // Sun is at center (X=50%) at local noon (12:00), and at edges (X=100%/0%) at local midnight.
    const X_sun = 100 - (H_local / 24) * 100;
    
    // Day extends 25% (90 degrees longitude) to either side of the sun
    const X_start = X_sun - 25;
    const X_end = X_sun + 25;

    // Transition softness width (penumbra) for realistic atmospheric scattering
    const soft = 8;

    const nightColor = isInverse ? "#ffffff" : "rgba(4, 6, 18, 0.82)";
    const dayColor = isInverse ? "#000000" : "rgba(0, 0, 0, 0)";

    // Handle wrapping boundaries across the edges of the 2D sphere
    if (X_start >= 0 && X_end <= 100) {
      // Case 1: Day is in the middle of the flat map, night is at the left & right edges
      return (
        <>
          <stop offset="0%" stopColor={nightColor} />
          <stop offset={`${Math.max(0, X_start - soft)}%`} stopColor={nightColor} />
          <stop offset={`${Math.min(100, X_start + soft)}%`} stopColor={dayColor} />
          <stop offset={`${Math.max(0, X_end - soft)}%`} stopColor={dayColor} />
          <stop offset={`${Math.min(100, X_end + soft)}%`} stopColor={nightColor} />
          <stop offset="100%" stopColor={nightColor} />
        </>
      );
    } else if (X_start < 0) {
      // Case 2: Day is centered on the left edge (wraps to right edge), night is in the middle
      const X_start_wrapped = 100 + X_start;
      return (
        <>
          <stop offset="0%" stopColor={dayColor} />
          <stop offset={`${Math.max(0, X_end - soft)}%`} stopColor={dayColor} />
          <stop offset={`${Math.min(100, X_end + soft)}%`} stopColor={nightColor} />
          <stop offset={`${Math.max(0, X_start_wrapped - soft)}%`} stopColor={nightColor} />
          <stop offset={`${Math.min(100, X_start_wrapped + soft)}%`} stopColor={dayColor} />
          <stop offset="100%" stopColor={dayColor} />
        </>
      );
    } else {
      // Case 3: Day is centered on the right edge (wraps to left edge), night is in the middle
      const X_end_wrapped = X_end - 100;
      return (
        <>
          <stop offset="0%" stopColor={dayColor} />
          <stop offset={`${Math.max(0, X_end_wrapped - soft)}%`} stopColor={dayColor} />
          <stop offset={`${Math.min(100, X_end_wrapped + soft)}%`} stopColor={nightColor} />
          <stop offset={`${Math.max(0, X_start - soft)}%`} stopColor={nightColor} />
          <stop offset={`${Math.min(100, X_start + soft)}%`} stopColor={dayColor} />
          <stop offset="100%" stopColor={dayColor} />
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
            
            {/* 1. Real Satellite Texture of planet Earth (CSS background-image with transition) */}
            <div 
              className="earth-sphere" 
              style={{ 
                backgroundPositionX: `${50 + (selectedLocation.lon / 1.8)}%` 
              }} 
            />
            
            <svg viewBox="0 0 200 200" className="earth-svg">
              <defs>
                {/* Atmosphere outer gradient */}
                <radialGradient id="earth-atmosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="85%" stopColor="#0a0f24" stopOpacity="0" />
                  <stop offset="94%" stopColor="#00f0ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </radialGradient>

                {/* Day/Night Terminator Gradient (Opacity overlay on top of Day Map) */}
                <linearGradient id="terminator-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  {getTerminatorStops(false)}
                </linearGradient>

                {/* City Lights Mask Gradient (Inverse terminator gradient) */}
                <linearGradient id="city-lights-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  {getTerminatorStops(true)}
                </linearGradient>

                {/* Night Mask to display city lights only on the dark hemisphere */}
                <mask id="night-mask">
                  <rect x="0" y="0" width="200" height="200" fill="url(#city-lights-grad)" />
                </mask>

                {/* Earth sphere clipping boundary */}
                <clipPath id="earth-clip">
                  <circle cx="100" cy="100" r="80" />
                </clipPath>
              </defs>

              {/* Atmosphere Outer Ring Glow */}
              <circle cx="100" cy="100" r="90" fill="url(#earth-atmosphere)" />
              <circle cx="100" cy="100" r="80" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="0.75" fill="none" />

              {/* Masked Earth Sphere Globe */}
              <g clipPath="url(#earth-clip)">
                {/* 1. Dynamic Night Shadow (Linear gradient overlay) */}
                <circle cx="100" cy="100" r="80" fill="url(#terminator-grad)" />
                
                {/* 2. Glowing Golden City Lights (Shifted & Wrapped, displayed only in dark night regions) */}
                {renderShiftedLayer(
                  <g fill="#ffd700" mask="url(#night-mask)">
                    {renderCityLights()}
                  </g>
                )}

                {/* 3. Globe Cyber Grid Overlay */}
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

                {/* 4. Dynamic Pulsing Selector Ring for Active City (Fixed X=100, vertical translation) */}
                <g transform={`translate(0, ${selectedLocation.mapY})`} className="globe-target-group">
                  <circle 
                    cx={100} 
                    cy={0} 
                    r="6" 
                    fill="none" 
                    stroke="#00f0ff" 
                    strokeWidth="1.5" 
                    className="target-ring" 
                  />
                  <circle 
                    cx={100} 
                    cy={0} 
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
