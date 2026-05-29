/**
 * Mars weather and rover photos API service using NASA APIs.
 */

const NASA_API_KEY = 'V2ZA6NxQWDpNY3gig5n5hcbDMVWN4fsGegtNf2Bn';

const FALLBACK_MARS_PHOTOS = [
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/25058_PIA23932-web.jpg',
    sol: 2840,
    earthDate: '2020-07-30',
    rover: 'Curiosity',
    camera: 'MAST',
    caption: 'Panorama of Gale Crater on Mars',
  },
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/26053_PIA24755-1200w.jpg',
    sol: 120,
    earthDate: '2021-06-20',
    rover: 'Perseverance',
    camera: 'NAVCAM_RIGHT',
    caption: 'Jezero Crater delta overlook',
  },
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/25640_PIA24419-web.jpg',
    sol: 10,
    earthDate: '2021-03-01',
    rover: 'Perseverance',
    camera: 'MAST_ZOOM_LEFT',
    caption: 'High resolution color view of Martian soil and rocks',
  },
];

export async function fetchMarsWeather() {
  try {
    const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mars API returned status: ${response.status}`);
    }

    const data = await response.json();
    const solKeys = data.sol_keys || [];

    if (solKeys.length > 0) {
      const latestSol = solKeys[solKeys.length - 1];
      const solData = data[latestSol];

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
    }

    throw new Error('No Sol data returned in InSight response');
  } catch (error) {
    console.warn('NASA InSight API fetch failed. Using simulated Mars weather:', error.message);

    const mockSol = Math.floor(3400 + Math.random() * 100).toString();
    const windDirections = [
      { point: 'N', deg: 0 }, { point: 'NE', deg: 45 }, { point: 'E', deg: 90 },
      { point: 'SE', deg: 135 }, { point: 'S', deg: 180 }, { point: 'SW', deg: 225 },
      { point: 'W', deg: 270 }, { point: 'NW', deg: 315 },
    ];
    const randomWind = windDirections[Math.floor(Math.random() * windDirections.length)];

    return {
      sol: mockSol,
      temperature: { avg: -58, min: -92, max: -14 },
      pressure: { avg: 742, min: 715, max: 768 },
      wind: {
        speed: parseFloat((3.5 + Math.random() * 8).toFixed(1)),
        direction: randomWind.point,
        directionDegrees: randomWind.deg,
      },
      season: 'Autumn',
      isFallback: true,
    };
  }
}

export async function fetchLatestMarsRoverPhoto(rover = 'curiosity') {
  const roverLower = rover.toLowerCase();

  try {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverLower}/latest_photos?api_key=${NASA_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mars Rover API status: ${response.status}`);
    }

    const data = await response.json();
    const photos = data.latest_photos || [];

    if (photos.length > 0) {
      let selectedPhoto = photos[0];
      for (const photo of photos) {
        if (photo.camera.name.includes('MAST') || photo.camera.name.includes('NAV')) {
          selectedPhoto = photo;
          break;
        }
      }

      return {
        imgSrc: selectedPhoto.img_src,
        sol: selectedPhoto.sol,
        earthDate: selectedPhoto.earth_date,
        rover: selectedPhoto.rover.name,
        camera: selectedPhoto.camera.full_name,
        caption: `Photo from ${selectedPhoto.rover.name} on sol ${selectedPhoto.sol}.`,
        isFallback: false,
      };
    }

    throw new Error(`No latest photos found for rover ${rover}`);
  } catch (error) {
    console.error(`Error fetching Mars Rover photos for ${rover}:`, error);
    const index = roverLower === 'perseverance' ? 1 : 0;
    return { ...(FALLBACK_MARS_PHOTOS[index] || FALLBACK_MARS_PHOTOS[2]), isFallback: true };
  }
}
