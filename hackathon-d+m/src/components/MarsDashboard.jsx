import { useState, useEffect } from 'react';
import { Thermometer, Wind, Compass, Camera, AlertTriangle } from 'lucide-react';

import marsMapImage from '../assets/mars_map.jpg';

const NASA_API_KEY = 'AaD540tNdp60rKSeCM6yef4BiheAgLgInWjivBYt';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;
const VIEWPORT_SIZE = 400;

const MarsGlobe = () => {
  const [rotationOffset, setRotationOffset] = useState(0);

  useEffect(() => {
    // Slowly rotate Mars constantly
    const updateRotation = () => {
      setRotationOffset(prev => {
        let next = prev - 0.5;
        if (next <= -MAP_WIDTH) return 0;
        return next;
      });
    };
    // Update frequently for smooth animation
    const interval = setInterval(updateRotation, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      width: VIEWPORT_SIZE, 
      height: VIEWPORT_SIZE, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: '0 0 80px var(--glow-mars)',
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
            left: rotationOffset + (tileOffset * MAP_WIDTH),
            top: (VIEWPORT_SIZE - MAP_HEIGHT) / 2,
            width: MAP_WIDTH,
            height: MAP_HEIGHT
          }}>
            <img src={marsMapImage} alt="Mars Satellite Map" style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              objectFit: 'fill',
              filter: 'brightness(1.1)'
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
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset -40px -40px 80px rgba(0,0,0,0.9), inset 15px 15px 40px rgba(255, 80, 40, 0.4)'
      }} />
    </div>
  );
};

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
        const res = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`);
        const data = await res.json();
        
        // InSight returns sol keys if data is available
        const solKeys = data.sol_keys || [];
        
        if (solKeys.length > 0) {
          const latestSol = solKeys[solKeys.length - 1];
          const latestData = data[latestSol];
          
          setWeatherData({
            temp: latestData.AT?.av || 'N/A',
            pressure: latestData.PRE?.av || 'N/A',
            windSpeed: latestData.HWS?.av || 'N/A',
            windDir: latestData.WD?.most_common?.compass_point || 'Unknown'
          });
        } else {
          throw new Error("No recent data from InSight");
        }
      } catch (err) {
        console.warn("InSight API failed or returned empty (lander retired). Using fallback data.", err);
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
        const photoRes = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`);
        const photoData = await photoRes.json();
        
        if (photoData.latest_photos && photoData.latest_photos.length > 0) {
          // Get a random photo from the latest batch
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
            <span style={{ fontSize: '0.8rem', color: '#ffb84d', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> Archivovaná Data
            </span>
          )}
        </div>

        {loadingWeather || !weatherData ? (
          <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
            Čekání na přenos z Marsu...
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
          <div className="loading" style={{ height: '250px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} />
        ) : roverPhoto ? (
          <div>
            <img src={roverPhoto.url} alt="Mars Rover" className="rover-image" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
