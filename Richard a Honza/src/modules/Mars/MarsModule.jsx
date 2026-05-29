import { useCallback, useEffect, useState } from 'react';
import {
  Thermometer,
  Wind,
  Gauge,
  Compass,
  Radio,
  RefreshCw,
  AlertTriangle,
  Camera,
  Orbit,
} from 'lucide-react';
import '../Earth/EarthModule.css';
import {
  DEFAULT_MARS_ROVER_IMAGE,
  fetchMarsWeather,
  fetchRoverImage,
} from './utils/marsApi.js';
import MarsWindVisual from './components/MarsWindVisual.jsx';
import './MarsModule.css';

const SEASON_LABELS = {
  winter: 'Severní zima',
  spring: 'Severní jaro',
  summer: 'Severní léto',
  autumn: 'Severní podzim',
};

const WIND_DIRECTIONS_CZ = {
  N: 'Severní',
  NNE: 'Severoseverovýchodní',
  NE: 'Severovýchodní',
  ENE: 'Východoseverovýchodní',
  E: 'Východní',
  ESE: 'Východojihovýchodní',
  SE: 'Jihovýchodní',
  SSE: 'Jihojihovýchodní',
  S: 'Jižní',
  SSW: 'Jihojihozápadní',
  SW: 'Jihozápadní',
  WSW: 'Západojihozápadní',
  W: 'Západní',
  WNW: 'Západoseverozápadní',
  NW: 'Severozápadní',
  NNW: 'Severoseverozápadní',
};

function formatSeason(season) {
  if (!season) return 'Neznámé období';
  const key = season.toLowerCase();
  return SEASON_LABELS[key] ?? season;
}

function translateWindDirection(direction) {
  if (!direction) return '—';
  return WIND_DIRECTIONS_CZ[direction] ?? direction;
}

function translateWindDirectionLower(direction) {
  const full = translateWindDirection(direction);
  if (full === '—') return full;
  return full.charAt(0).toLowerCase() + full.slice(1);
}

function formatRoverOverlay(photo) {
  const rover = photo?.rover ?? 'Curiosity';
  const sol = photo?.sol ?? 2840;

  if (photo?.isFallback) {
    return `${rover} — SOL ${sol} — archiv`;
  }

  return `${rover} — SOL ${sol}`;
}

export default function MarsModule() {
  const [weather, setWeather] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [roverImageUrl, setRoverImageUrl] = useState(DEFAULT_MARS_ROVER_IMAGE);

  const loadRoverImage = useCallback(async () => {
    const result = await fetchRoverImage();
    setRoverImageUrl(result.imageUrl);
    setPhoto({
      rover: result.rover,
      sol: result.sol,
      earthDate: result.earthDate,
      caption: result.caption,
      isFallback: result.isFallback,
    });
  }, []);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const weatherData = await fetchMarsWeather();
      setWeather(weatherData);
      await loadRoverImage();
    } catch (err) {
      console.error('Mars module data error:', err);
      setError(err.message || 'Nepodařilo se načíst marsovská data.');
      setRoverImageUrl(DEFAULT_MARS_ROVER_IMAGE);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadRoverImage]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      await loadData();
      if (!isMounted) return;
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    loadData();
  };

  const handlePhotoError = () => {
    setRoverImageUrl(DEFAULT_MARS_ROVER_IMAGE);
    setPhoto((prev) => ({
      rover: prev?.rover ?? 'Curiosity',
      sol: prev?.sol ?? 2840,
      earthDate: prev?.earthDate ?? '2020-07-30',
      caption: 'Archivní snímek Marsu',
      isFallback: true,
    }));
  };

  const getTelemetryStatus = () => {
    if (loading || refreshing) return { text: 'PŘIPOJOVÁNÍ...', color: '#ffd700' };
    if (error) return { text: 'CHYBA SPOJENÍ', color: '#ef4444' };
    if (weather?.isFallback || photo?.isFallback) {
      return { text: 'ARCHIV / FALLBACK', color: '#ffb74d' };
    }
    return { text: 'ONLINE / OK', color: '#86efac' };
  };

  const telemetry = getTelemetryStatus();
  const wind = weather?.wind;
  const usingFallback = weather?.isFallback || photo?.isFallback;
  const windDirectionCz = translateWindDirection(wind?.direction);
  const windDirectionCzLower = translateWindDirectionLower(wind?.direction);
  const photoCaption = photo?.earthDate ? `NASA — ${photo.earthDate}` : (photo?.caption ?? '');

  return (
    <div className="earth-container mars-container">
      <header className="earth-header">
        <h1 className="earth-title">
          <span>🔴</span> MODUL MARS
        </h1>

        <div className="search-control-panel">
          <div className="search-form-row">
            <div className="search-input-wrapper">
              <Orbit size={18} className="search-input-icon" />
              <input
                type="text"
                className="search-input"
                value={
                  loading
                    ? 'Načítání telemetrie InSight & Curiosity...'
                    : weather
                      ? `Elysium Planitia · Sol ${weather.sol} · ${formatSeason(weather.season)}`
                      : 'Mars — telemetrie nedostupná'
                }
                readOnly
                aria-label="Aktuální marsovská stanice"
              />
            </div>
            <button
              type="button"
              className="search-btn"
              onClick={handleRefresh}
              disabled={loading || refreshing}
            >
              {refreshing ? (
                <div className="search-btn-spinner" />
              ) : (
                <>
                  <RefreshCw size={16} /> Obnovit data
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="earth-content">
        <section className="earth-data-column">
          <div className="glass-card location-info-card">
            <div className="location-title-row">
              <div className="location-name-container">
                <h2 className="location-name">🔴 Elysium Planitia</h2>
                <span className="location-country">
                  NASA InSight · Gale / Jezero (rover)
                </span>
              </div>

              <div className="clock-container">
                <span className="clock-label">Poslední sol</span>
                <span className="clock-time">{weather ? weather.sol : '—'}</span>
                <span className="timezone-tag">
                  {usingFallback ? 'Simulovaná / archivní data' : 'Živá NASA telemetrie'}
                </span>
              </div>
            </div>

            <div className="location-coordinates mars-coords-row">
              <div className="coord-tag">
                <strong>Stanice:</strong> 4.5°N, 135.6°E
              </div>
              <div className="coord-tag">
                <strong>Rover:</strong> {photo?.rover ?? 'Curiosity'}
              </div>
            </div>

            <figure className="mars-rover-photo-card">
              <div className="mars-rover-photo-frame">
                <img
                  src={roverImageUrl}
                  alt="Mars Rover"
                  className="mars-rover-photo"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handlePhotoError}
                />
                <div className="mars-rover-photo-overlay">
                  <Camera size={14} />
                  <span>{formatRoverOverlay(photo)}</span>
                </div>
              </div>
              <figcaption className="mars-rover-caption">{photoCaption}</figcaption>
            </figure>

            <h3 className="weather-panel-title">
              <Compass size={18} /> ATMOSFÉRICKÁ DATA
            </h3>

            {loading ? (
              <div className="weather-overview">
                <Wind size={56} className="weather-large-icon animate-pulse" />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">--</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text">Připojování k InSight...</span>
                </div>
              </div>
            ) : error ? (
              <div className="weather-overview">
                <AlertTriangle size={56} className="weather-large-icon mars-error-icon" />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">--</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text mars-error-text">Chyba spojení</span>
                </div>
              </div>
            ) : (
              <div className="weather-overview">
                <Thermometer size={56} className="weather-large-icon" />
                <div className="temperature-main">
                  <div>
                    <span className="temp-val">{weather.temperature.avg}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <span className="weather-desc-text">
                    Průměrná teplota · {formatSeason(weather.season)}
                  </span>
                </div>
              </div>
            )}

            <div className="weather-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box">
                  <Thermometer size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Teplota (min / max)</span>
                  <span className="metric-value">
                    {loading || error || !weather
                      ? '-- °C'
                      : `${weather.temperature.min} / ${weather.temperature.max} °C`}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box">
                  <Gauge size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Atmosférický tlak</span>
                  <span className="metric-value">
                    {loading || error || !weather
                      ? '-- Pa'
                      : `${weather.pressure.avg} Pa`}
                  </span>
                </div>
              </div>

              <div className="metric-card mars-metric-card mars-wind-metric-card">
                <div className="metric-icon-box">
                  <Wind size={20} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Vítr (rychlost / směr)</span>
                  <span className="metric-value mars-wind-value">
                    {loading || error || !wind
                      ? '-- m/s'
                      : `${wind.speed} m/s · ${windDirectionCz}`}
                  </span>
                </div>
              </div>

              <div className="metric-card mars-metric-card">
                <div className="metric-icon-box">
                  <Radio size={20} style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="metric-data">
                  <span className="metric-label">Telemetrický stav</span>
                  <span
                    className="metric-value"
                    style={{ color: telemetry.color, fontWeight: 800 }}
                  >
                    {telemetry.text}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mars-retry-row">
                <button type="button" className="retry-btn" onClick={handleRefresh}>
                  Opakovat spojení
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="earth-visual-column">
          <MarsWindVisual
            windSpeed={wind?.speed ?? 5}
            windDirectionDegrees={wind?.directionDegrees ?? 270}
            loading={loading}
          />

          <div className="terminator-info-box">
            <span>
              Senzorický log: Větrný tok simulován pro{' '}
              {windDirectionCzLower} směr ({wind?.directionDegrees ?? '—'}°) při rychlosti{' '}
              <strong>{wind?.speed ?? '—'} m/s</strong>.
              {usingFallback
                ? ' Data pocházejí z archivního fallbacku (sonda InSight ukončila aktivní činnost v prosinci 2022 kvůli zaprášení solárních panelů).'
                : ' Data pocházejí z NASA InSight API.'}{' '}
              Animace proudnic reaguje na intenzitu větru v reálném čase.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
