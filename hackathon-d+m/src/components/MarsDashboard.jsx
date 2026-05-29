import { useState, useEffect } from 'react';
import { Thermometer, Wind, Compass, Camera, AlertTriangle } from 'lucide-react';
import marsMapImage from '../assets/mars_map.jpg';
import { getGlobeGlowShadow, getGlobeInsetShadow } from '../utils/globeStyles';
import { useGlobeRotation } from '../utils/useGlobeRotation';


const NASA_API_KEY = 'AaD540tNdp60rKSeCM6yef4BiheAgLgInWjivBYt';
const MAP_WIDTH = 1000;
const DEFAULT_SIZE = 400;
const ROTATION_SPEED = 0.5;
const ROTATION_INTERVAL_MS = 50;

/**
 * MarsGlobe component visualizing the rotating Mars surface with 3D atmospheric glow.
 *
 * @component
 * @param {Object} props
 * @param {number} [props.size=400] - Render diameter size of the globe in pixels.
 * @param {'default'|'compare'} [props.variant='default'] - Visual layout variant.
 */
export const MarsGlobe = ({ size = DEFAULT_SIZE, variant = 'default' }) => {
  // Use standard rotation hook
  const rotationOffset = useGlobeRotation(ROTATION_SPEED, MAP_WIDTH, ROTATION_INTERVAL_MS);

  const currentMapWidth = size * 2.5;
  const currentMapHeight = size * 1.25;
  const scaledRotationOffset = rotationOffset * (currentMapWidth / MAP_WIDTH);

  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: getGlobeGlowShadow(size, 'var(--glow-mars)'),
      backgroundColor: '#000'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
        {/* Render tiles to wrap horizontally */}
        {[0, 1, 2].map(tileOffset => (
          <div key={tileOffset} style={{
            position: 'absolute',
            left: scaledRotationOffset + (tileOffset * currentMapWidth),
            top: (size - currentMapHeight) / 2,
            width: currentMapWidth,
            height: currentMapHeight
          }}>
            <img src={marsMapImage} alt="Mars Satellite Map" style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              objectFit: 'fill',
              filter: variant === 'compare' ? 'brightness(1.25) contrast(1.1)' : 'brightness(1.1)'
            }} />
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
        boxShadow: getGlobeInsetShadow(size, 'rgba(255, 80, 40, 0.4)', variant),
      }} />
    </div>
  );
};

/**
 * Main MarsDashboard component loading Insight lander weather telemetry,
 * real-time Rover photographs from NASA's Curiosity rover, and rendering
 * the simulated 3D Mars globe.
 *
 * @component
 */
export default function MarsDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [roverPhoto, setRoverPhoto] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchMarsData = async () => {
      // 1. Fetch InSight Weather Data
      setLoadingWeather(true);
      try {
        const weatherUrl = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
        const res = await fetch(weatherUrl);
        const data = await res.json();
        
        // InSight returns sol keys if data is available
        const solKeys = data.sol_keys || [];
        
        if (solKeys.length > 0) {
          const latestSol = solKeys[solKeys.length - 1];
          const latestData = data[latestSol];
          
          setWeatherData({
            temp: latestData.AT?.av || 'Nedostupné',
            pressure: latestData.PRE?.av || 'Nedostupné',
            windSpeed: latestData.HWS?.av || 'Nedostupné',
            windDir: latestData.WD?.most_common?.compass_point || 'Neznámo'
          });
        } else {
          throw new Error("No recent data from InSight");
        }
      } catch (err) {
        console.warn(
          "InSight API failed or returned empty (lander retired). Using fallback data.", 
          err
        );
        setUsingFallback(true);
        // Fallback realistic data
        setWeatherData({
          temp: -63.5,
          pressure: 715.4,
          windSpeed: 18.2,
          windDir: 'NW'
        });
      } finally {
        setLoadingWeather(false);
      }

      // 2. Fetch Latest Rover Photo
      setLoadingPhoto(true);
      try {
        const photoUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`;
        const photoRes = await fetch(photoUrl);
        const photoData = await photoRes.json();
        
        if (photoData.latest_photos && photoData.latest_photos.length > 0) {
          // Get the first photo from the latest batch
          const photo = photoData.latest_photos[0];
          setRoverPhoto({
            url: photo.img_src,
            camera: photo.camera.full_name,
            date: photo.earth_date,
            sol: photo.sol
          });
        }
      } catch (err) {
        console.error("Failed to fetch Mars Rover photo:", err);
      } finally {
        setLoadingPhoto(false);
      }
    };

    fetchMarsData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-panel">
        <div className="panel-header">
          <h2 className="panel-title mars-title">
            Elysium Planitia (InSight)
          </h2>
          {usingFallback && (
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#ffb84d', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}>
              <AlertTriangle size={14} /> Archivovaná Data
            </span>
          )}
        </div>

        {loadingWeather || !weatherData ? (
          <div className="stat-grid">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className="stat-card skeleton-box" 
                style={{ height: '88px', border: '1px solid transparent' }} 
              />
            ))}
          </div>
        ) : (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Průměrná Teplota</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer className="mars-title" />
                {weatherData.temp}°C
              </div>
            </div>
            
            <div className="stat-card">
              <span className="stat-label">Tlak</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass className="mars-title" />
                {weatherData.pressure} Pa
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Rychlost Větru</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind className="mars-title" />
                {weatherData.windSpeed} m/s
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Směr Větru</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass className="mars-title" />
                {weatherData.windDir}
              </div>
            </div>
          </div>
        )}

        <div className="panel-header" style={{ marginTop: '2rem' }}>
          <h2 className="panel-title mars-title">
            <Camera size={20} /> Nejnovější Fotografie Roveru
          </h2>
        </div>

        {loadingPhoto ? (
          <div 
            className="skeleton-box" 
            style={{ height: '350px', width: '100%', borderRadius: '12px', marginTop: '1rem' }} 
          />
        ) : roverPhoto ? (
          <div>
            <img src={roverPhoto.url} alt="Mars Rover" className="rover-image" />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem', 
              color: 'var(--text-muted)', 
              fontSize: '0.85rem' 
            }}>
              <span>Curiosity • {roverPhoto.camera}</span>
              <span>Sol {roverPhoto.sol}</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Žádné nedávné fotografie nejsou k dispozici.
          </div>
        )}
      </div>

      <div className="dashboard-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, color: 'var(--text-muted)' }}>
          Satelitní Pohled
        </h3>
        <MarsGlobe />
      </div>
    </div>
  );
}
