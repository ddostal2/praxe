/**
 * NASA InSight weather + Mars Rover Photos API with realistic fallbacks.
 */

const NASA_API_KEY = 'DEMO_KEY';

export const INSIGHT_URL = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
export const ROVER_PHOTOS_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`;

/** Primary fallback — verified Wikimedia HTTPS Mars image. */
export const DEFAULT_MARS_ROVER_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg';

export function getSecureUrl(url) {
  if (!url) return null;
  return url.replace(/^http:\/\//i, 'https://');
}

/** Extract image URL from NASA API response (latest_photos or photos). */
export function extractRoverImageUrl(data) {
  let rawUrl = null;

  if (data?.latest_photos?.length > 0) {
    rawUrl = data.latest_photos[0].img_src;
  } else if (data?.photos?.length > 0) {
    rawUrl = data.photos[0].img_src;
  }

  return rawUrl ? getSecureUrl(rawUrl) : null;
}

/** Extract rover metadata from NASA API response. */
export function extractRoverPhotoMeta(data) {
  const photo =
    data?.latest_photos?.[0] ?? data?.photos?.[0] ?? null;

  if (!photo) {
    return {
      rover: 'Curiosity',
      sol: 2840,
      earthDate: '2020-07-30',
      caption: 'Archivní snímek Marsu',
      isFallback: true,
    };
  }

  return {
    rover: photo.rover?.name ?? 'Curiosity',
    sol: photo.sol ?? '—',
    earthDate: photo.earth_date ?? null,
    caption: `Snímek ${photo.rover?.name ?? 'Curiosity'} · sol ${photo.sol ?? '—'}`,
    isFallback: false,
  };
}

function buildFallbackWeather() {
  return {
    sol: '3421',
    temperature: { avg: -61, min: -95, max: -11 },
    pressure: { avg: 745, min: 718, max: 772 },
    wind: {
      speed: 6.8,
      direction: 'WNW',
      directionDegrees: 292.5,
    },
    season: 'Northern Winter',
    isFallback: true,
  };
}

export async function fetchMarsWeather() {
  try {
    const response = await fetch(INSIGHT_URL);

    if (!response.ok) {
      throw new Error(`InSight API status: ${response.status}`);
    }

    const data = await response.json();
    const solKeys = data.sol_keys || [];

    if (solKeys.length === 0) {
      throw new Error('InSight API returned no sol_keys');
    }

    const latestSol = solKeys[solKeys.length - 1];
    const solData = data[latestSol];

    const hasAtmosData =
      solData?.AT?.av != null || solData?.PRE?.av != null || solData?.HWS?.av != null;

    if (!hasAtmosData) {
      throw new Error('InSight sol payload is empty (mission ended)');
    }

    return {
      sol: latestSol,
      temperature: {
        avg: solData.AT ? Math.round(solData.AT.av) : -63,
        min: solData.AT ? Math.round(solData.AT.mn) : -95,
        max: solData.AT ? Math.round(solData.AT.mx) : -12,
      },
      pressure: {
        avg: solData.PRE ? Math.round(solData.PRE.av) : 750,
        min: solData.PRE ? Math.round(solData.PRE.mn) : 710,
        max: solData.PRE ? Math.round(solData.PRE.mx) : 790,
      },
      wind: {
        speed: solData.HWS ? Number(solData.HWS.av.toFixed(1)) : 5.2,
        direction: solData.WD?.most_common?.compass_point ?? 'WNW',
        directionDegrees: solData.WD?.most_common?.compass_degrees ?? 292.5,
      },
      season: solData.Season || 'Winter',
      isFallback: false,
    };
  } catch (error) {
    console.warn('NASA InSight fetch failed, using Mars fallback weather:', error.message);
    return buildFallbackWeather();
  }
}

/**
 * Fetch rover photo — returns secure image URL + metadata.
 * Always resolves to a valid HTTPS URL (never undefined).
 */
export async function fetchRoverImage() {
  try {
    const response = await fetch(ROVER_PHOTOS_URL);

    if (!response.ok) {
      throw new Error(`Rover Photos API status: ${response.status}`);
    }

    const data = await response.json();
    const secureUrl = extractRoverImageUrl(data);
    const meta = extractRoverPhotoMeta(data);

    if (secureUrl) {
      return { imageUrl: secureUrl, ...meta, isFallback: false };
    }

    return {
      imageUrl: DEFAULT_MARS_ROVER_IMAGE,
      rover: 'Curiosity',
      sol: 2840,
      earthDate: '2020-07-30',
      caption: 'Archivní snímek Marsu',
      isFallback: true,
    };
  } catch (error) {
    console.error('Mars Rover image fetch failed:', error);
    return {
      imageUrl: DEFAULT_MARS_ROVER_IMAGE,
      rover: 'Curiosity',
      sol: 2840,
      earthDate: '2020-07-30',
      caption: 'Archivní snímek Marsu',
      isFallback: true,
    };
  }
}
