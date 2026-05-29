import { useState, useEffect } from 'react';
import { Thermometer, Wind, Droplets, MapPin, Clock, Search } from 'lucide-react';
import earthMapImage from '../assets/earth_map.jpg';

const MAJOR_CITIES = [
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773 },
  { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
  { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  { name: 'Oslo', lat: 59.9139, lon: 10.7522 },
  { name: 'Prague', lat: 50.0755, lon: 14.4378 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { name: 'Lisbon', lat: 38.7223, lon: -9.1393 },
  { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
  { name: 'Toronto', lat: 43.6510, lon: -79.3470 },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { name: 'Bogota', lat: 4.7110, lon: -74.0721 },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'Rome', lat: 41.9028, lon: 12.4964 },
  { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
  { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
  { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Perth', lat: -31.9505, lon: 115.8605 },
  { name: 'Dakar', lat: 14.7167, lon: -17.4677 },
  { name: 'Muscat', lat: 23.5859, lon: 58.4059 },
  { name: 'Lima', lat: -12.0464, lon: -77.0428 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
  { name: 'Tunis', lat: 36.8065, lon: 10.1815 },
  { name: 'Addis Ababa', lat: 9.0300, lon: 38.7400 },
  { name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Athens', lat: 37.9838, lon: 23.7275 },
  { name: 'Kyiv', lat: 50.4501, lon: 30.5234 },
  { name: 'Helsinki', lat: 60.1695, lon: 24.9354 },
  { name: 'Belgrade', lat: 44.8125, lon: 20.4612 },
  { name: 'Riga', lat: 56.9496, lon: 24.1052 },
  { name: 'Tehran', lat: 35.6892, lon: 51.3890 },
  { name: 'Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
  { name: 'Tbilisi', lat: 41.7151, lon: 44.8271 },
  { name: 'Luanda', lat: -8.8147, lon: 13.2302 },
  { name: 'Panama City', lat: 8.9824, lon: -79.5199 },
  { name: 'Caracas', lat: 10.4806, lon: -66.9036 },
  { name: 'Havana', lat: 23.1136, lon: -82.3666 },
  { name: 'Santo Domingo', lat: 18.4861, lon: -69.9312 },
  { name: 'La Paz', lat: -16.4897, lon: -68.1193 },
  { name: 'Miami', lat: 25.7617, lon: -80.1918 },
  { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
  { name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
  { name: 'Houston', lat: 29.7604, lon: -95.3698 },
  { name: 'Denver', lat: 39.7392, lon: -104.9903 },
  { name: 'Las Vegas', lat: 36.1699, lon: -115.1398 },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'Wellington', lat: -41.2865, lon: 174.7762 }
];

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;
const VIEWPORT_SIZE = 400;

const SatelliteGlobe = ({ activeCity }) => {
  const [sunLon, setSunLon] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate UTC decimal hours (e.g., 14.5 for 14:30)
      const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
      // At UTC 12:00, the sun is exactly at prime meridian (lon 0).
      // Earth rotates 15 degrees per hour. Sun appears to move West (negative longitude).
      let lon = -(utcHours - 12) * 15;
      
      // Normalize to -180 .. +180
      if (lon < -180) lon += 360;
      if (lon > 180) lon -= 360;
      
      setSunLon(lon);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Map Real Lat/Lon to exact Map Pixels
  const getMapCoords = (lat, lon) => {
    const x = ((lon + 180) / 360) * MAP_WIDTH;
    const y = ((90 - lat) / 180) * MAP_HEIGHT;
    return { x, y };
  };

  // Determine if a coordinate is in the dark
  const isNight = (cityLon) => {
    let delta = Math.abs(cityLon - sunLon);
    if (delta > 180) delta = 360 - delta;
    return delta > 90; // > 90 degrees away from the sun is night time
  };

  let panX;
  let panY;
  let activeCoords = null;

  if (activeCity && activeCity.lat && activeCity.lon) {
    activeCoords = getMapCoords(activeCity.lat, activeCity.lon);
    // Center the target coordinate in the viewport
    panX = VIEWPORT_SIZE / 2 - activeCoords.x;
    // Prevent panning past the North (0) or South (MAP_HEIGHT) poles to avoid empty space
    panY = Math.min(0, Math.max(VIEWPORT_SIZE - MAP_HEIGHT, VIEWPORT_SIZE / 2 - activeCoords.y));
  } else {
    // Default Atlantic-centric view (approx Lon -30, Lat 0) if no city is selected
    const centerCoords = getMapCoords(0, -30);
    panX = VIEWPORT_SIZE / 2 - centerCoords.x;
    panY = VIEWPORT_SIZE / 2 - centerCoords.y;
  }

  // Calculate position of the daylight center (the sun)
  const sunX = ((sunLon + 180) / 360) * MAP_WIDTH;
  
  // The shadow gradient has "daylight" (transparent) precisely in the center.
  // We shift it so its center aligns with sunX.
  const shadowBgPosition = sunX - (MAP_WIDTH / 2);

  const shadowGradient = `linear-gradient(to right, 
    rgba(0,10,30,0.85) 0%, 
    rgba(0,10,30,0.85) 23%, 
    transparent 27%, 
    transparent 73%, 
    rgba(0,10,30,0.85) 77%, 
    rgba(0,10,30,0.85) 100%)`;

  return (
    <div style={{ 
      width: VIEWPORT_SIZE, 
      height: VIEWPORT_SIZE, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: '0 0 80px var(--glow-earth)',
      backgroundColor: '#000'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: `translate(${panX}px, ${panY}px)`,
        transition: 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}>
        {/* Render 3 identical tiles side-by-side to allow infinite horizontal wrapping across the Date Line */}
        {[-1, 0, 1].map(tileOffset => (
          <div key={tileOffset} style={{
            position: 'absolute',
            left: tileOffset * MAP_WIDTH,
            top: 0,
            width: MAP_WIDTH,
            height: MAP_HEIGHT
          }}>
            <img src={earthMapImage} alt="Satellite Map" style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              objectFit: 'fill',
              filter: 'contrast(1.3) brightness(0.8)'
            }} />
            
            {/* Real-time Dynamic Shadow Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: shadowGradient,
              backgroundSize: '100% 100%',
              backgroundPosition: `${shadowBgPosition}px 0`,
              pointerEvents: 'none'
            }} />

            {/* Render 25 Major City Lights dynamically toggled by day/night cycle */}
            {MAJOR_CITIES.map((city, idx) => {
              const { x, y } = getMapCoords(city.lat, city.lon);
              const night = isNight(city.lon);
              const delay = (idx * 0.13) % 2; // Staggered blinking
              return (
                <div key={city.name} style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 3,
                  height: 3,
                  backgroundColor: '#fde047',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: night ? 1 : 0,
                  boxShadow: '0 0 4px 1px #fde047',
                  animation: night ? `pulse-light 3s ease-in-out infinite` : 'none',
                  animationDelay: `${delay}s`,
                  transition: 'opacity 1s ease'
                }} />
              );
            })}

            {/* Active City Radar Pinpoint (rendered on all tiles to maintain wrapping effect) */}
            {activeCoords && (
               <div style={{
                 position: 'absolute',
                 left: activeCoords.x,
                 top: activeCoords.y,
                 width: 6,
                 height: 6,
                 backgroundColor: '#f43f5e',
                 borderRadius: '50%',
                 transform: 'translate(-50%, -50%)'
               }}>
                 <div className="animate-radar-ping" style={{
                   position: 'absolute',
                   top: '50%',
                   left: '50%',
                   width: '100%',
                   height: '100%',
                   borderRadius: '50%',
                   border: '2px solid #f43f5e'
                 }} />
               </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 3D Atmospheric and Shading Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset -40px -40px 80px rgba(0,0,0,0.9), inset 15px 15px 40px rgba(77, 166, 255, 0.4)'
      }} />
    </div>
  );
};

export default function EarthDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ name: 'Prague', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchError('');
    try {
      const query = searchQuery.trim().replace(/\s+/g, ' ');
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setSearchError('City not found (check spelling)');
        setLoading(false);
        return;
      }
      const sortedResults = geoData.results.sort((a, b) => (b.population || 0) - (a.population || 0));
      const { name, latitude, longitude, country, timezone } = sortedResults[0];
      setCurrentLocation({ name: `${name}, ${country || 'Unknown'}`, lat: latitude, lon: longitude, timezone });
      setSearchQuery('');
    } catch (err) {
      console.error("Geocoding failed:", err);
      setSearchError('Search failed');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const { lat, lon } = currentLocation;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`);
        const data = await res.json();
        const currentHour = new Date().toISOString().slice(0, 14) + '00';
        const humIndex = data.hourly?.time?.findIndex(t => t.startsWith(currentHour.slice(0, 13))) || 0;
        const humidity = data.hourly?.relative_humidity_2m[humIndex] || 50;
        setWeatherData({
          temp: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          windDir: data.current_weather.winddirection,
          code: data.current_weather.weathercode,
          humidity
        });
      } catch (err) {
        console.error("Failed to fetch Earth weather:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [currentLocation]);

  useEffect(() => {
    const updateTime = () => {
      try {
        if (currentLocation.timezone) {
          setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: currentLocation.timezone }));
        } else {
          setCurrentTime(new Date().toLocaleTimeString());
        }
      } catch {
        // Fallback if timezone is invalid
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  return (
    <div className="dashboard">
      <div className="dashboard-panel">
        <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <h2 className="panel-title earth-title">
              <MapPin size={20} /> {currentLocation.name}
            </h2>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-main)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  outline: 'none'
                }}
              />
              <button type="submit" className="control-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                <Search size={18} />
              </button>
            </form>
          </div>
          {searchError && <span style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{searchError}</span>}
        </div>

        {loading || !weatherData ? (
          <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Receiving telemetry...</div>
        ) : (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Temperature</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer className="earth-title" />
                {weatherData.temp}°C
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Wind Speed</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind className="earth-title" />
                {weatherData.windSpeed} km/h
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Humidity</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets className="earth-title" />
                {weatherData.humidity}%
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Local Time</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock className="earth-title" />
                {currentTime}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, color: 'var(--text-muted)' }}>
          Earth Visualization
        </h3>
        <div style={{ width: '80%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
          <SatelliteGlobe activeCity={currentLocation} />
        </div>
      </div>
    </div>
  );
}
