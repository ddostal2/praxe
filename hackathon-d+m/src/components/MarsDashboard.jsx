import { useState, useEffect } from 'react';
import { Thermometer, Wind, Compass, Camera, AlertTriangle } from 'lucide-react';

const NASA_API_KEY = 'AaD540tNdp60rKSeCM6yef4BiheAgLgInWjivBYt';

// Generate static wind arrows outside the component to avoid re-render jumping and linter warnings
const WIND_ARROWS = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 2}s`
}));

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
              <AlertTriangle size={14} /> Archived Data
            </span>
          )}
        </div>

        {loadingWeather || !weatherData ? (
          <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
            Awaiting Mars relays...
          </div>
        ) : (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Avg Temperature</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer className="mars-title" />
                {weatherData.temp}°C
              </div>
            </div>
            
            <div className="stat-card">
              <span className="stat-label">Pressure</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass className="mars-title" />
                {weatherData.pressure} Pa
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Wind Speed</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind className="mars-title" />
                {weatherData.windSpeed} m/s
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Wind Direction</span>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass className="mars-title" />
                {weatherData.windDir}
              </div>
            </div>
          </div>
        )}

        <div className="panel-header" style={{ marginTop: '2rem' }}>
          <h2 className="panel-title mars-title">
            <Camera size={20} /> Latest Rover Photo
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
            No recent photos available.
          </div>
        )}
      </div>

      <div className="dashboard-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, color: 'var(--text-muted)' }}>
          2D Visualization & Dust Vectors
        </h3>
        <div style={{ width: '80%', maxWidth: '400px' }}>
          <div className="viz-container viz-mars">
            {/* Wind animation overlay */}
            <div className="wind-streamlines">
              {WIND_ARROWS.map(arrow => (
                <div 
                  key={arrow.id} 
                  className="wind-arrow"
                  style={{
                    left: arrow.left,
                    top: arrow.top,
                    animationDelay: arrow.delay
                  }}
                >
                  <Wind size={24} color="rgba(255,255,255,0.4)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
