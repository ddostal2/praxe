/**
 * Mars weather and rover photos API service using NASA APIs.
 */

const NASA_API_KEY = 'V2ZA6NxQWDpNY3gig5n5hcbDMVWN4fsGegtNf2Bn';

// Beautiful high-quality NASA Mars landscape photos to use as fallback
const FALLBACK_MARS_PHOTOS = [
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/25058_PIA23932-web.jpg',
    sol: 2840,
    earthDate: '2020-07-30',
    rover: 'Curiosity',
    camera: 'MAST',
    caption: 'Panorama of Gale Crater on Mars'
  },
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/26053_PIA24755-1200w.jpg',
    sol: 120,
    earthDate: '2021-06-20',
    rover: 'Perseverance',
    camera: 'NAVCAM_RIGHT',
    caption: 'Jezero Crater delta overlook'
  },
  {
    imgSrc: 'https://mars.nasa.gov/system/resources/detail_files/25640_PIA24419-web.jpg',
    sol: 10,
    earthDate: '2021-03-01',
    rover: 'Perseverance',
    camera: 'MAST_ZOOM_LEFT',
    caption: 'High resolution color view of Martian soil and rocks'
  }
];

/**
 * Fetches the latest Martian weather data from NASA's InSight API.
 * Since the InSight lander is retired, we attempt to fetch actual historical data
 * from the API and fall back to highly realistic simulated current Mars weather if offline.
 * 
 * @returns {Promise<Object>} Formatted Mars weather data
 */
export async function fetchMarsWeather() {
  try {
    const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mars API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract sol keys (e.g. ['1019', '1020', ...])
    const solKeys = data.sol_keys || [];
    
    if (solKeys.length > 0) {
      // Get the latest sol data
      const latestSol = solKeys[solKeys.length - 1];
      const solData = data[latestSol];
      
      // Parse InSight temperature, pressure, wind
      return {
        sol: latestSol,
        temperature: {
          avg: solData.AT ? Math.round(solData.AT.av) : -63,
          min: solData.AT ? Math.round(solData.AT.mn) : -95,
          max: solData.AT ? Math.round(solData.AT.mx) : -12
        },
        pressure: {
          avg: solData.PRE ? Math.round(solData.PRE.av) : 750,
          min: solData.PRE ? Math.round(solData.PRE.mn) : 710,
          max: solData.PRE ? Math.round(solData.PRE.mx) : 790
        },
        wind: {
          speed: solData.HWS ? Number(solData.HWS.av.toFixed(1)) : 5.2,
          direction: solData.WD && solData.WD.most_common ? solData.WD.most_common.compass_point : 'WNW',
          directionDegrees: solData.WD && solData.WD.most_common ? solData.WD.most_common.compass_degrees : 292.5
        },
        season: solData.Season || 'Winter',
        isFallback: false
      };
    } else {
      throw new Error('No Sol data returned in InSight response');
    }
  } catch (error) {
    console.warn('NASA InSight API fetch failed or returned empty data. Using simulated realistic Mars weather:', error.message);
    
    // Generate realistic Mars weather data for a mock current Sol (e.g. around Sol 3450 for curiosity/perseverance)
    const mockSol = Math.floor(3400 + Math.random() * 100).toString();
    
    // Wind directions map degrees to compass points
    const windDirections = [
      { point: 'N', deg: 0 }, { point: 'NNE', deg: 22.5 }, { point: 'NE', deg: 45 }, { point: 'ENE', deg: 67.5 },
      { point: 'E', deg: 90 }, { point: 'ESE', deg: 112.5 }, { point: 'SE', deg: 135 }, { point: 'SSE', deg: 157.5 },
      { point: 'S', deg: 180 }, { point: 'SSW', deg: 202.5 }, { point: 'SW', deg: 225 }, { point: 'WSW', deg: 247.5 },
      { point: 'W', deg: 270 }, { point: 'WNW', deg: 292.5 }, { point: 'NW', deg: 315 }, { point: 'NNW', deg: 337.5 }
    ];
    const randomWind = windDirections[Math.floor(Math.random() * windDirections.length)];
    
    return {
      sol: mockSol,
      temperature: {
        avg: -58,
        min: -92,
        max: -14
      },
      pressure: {
        avg: 742,
        min: 715,
        max: 768
      },
      wind: {
        speed: parseFloat((3.5 + Math.random() * 8).toFixed(1)), // 3.5 to 11.5 m/s
        direction: randomWind.point,
        directionDegrees: randomWind.deg
      },
      season: 'Autumn',
      isFallback: true
    };
  }
}

/**
 * Fetches the latest photos from Mars Rovers (Curiosity, Perseverance).
 * 
 * @param {string} rover - Name of the rover ('curiosity' or 'perseverance')
 * @returns {Promise<Object>} Formatted photo data
 */
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
      // Find a photo that is not from an engineering camera if possible, or just the first one
      // Preferred cameras: Mastcam (MAST/MAST_ZOOM) or Navigation (NAVCAM)
      let selectedPhoto = photos[0];
      for (const p of photos) {
        if (p.camera.name.includes('MAST') || p.camera.name.includes('NAV')) {
          selectedPhoto = p;
          break;
        }
      }
      
      return {
        imgSrc: selectedPhoto.img_src,
        sol: selectedPhoto.sol,
        earthDate: selectedPhoto.earth_date,
        rover: selectedPhoto.rover.name,
        camera: selectedPhoto.camera.full_name,
        caption: `Fotografie pořízená vozítkem ${selectedPhoto.rover.name} kamerou ${selectedPhoto.camera.name} na solu ${selectedPhoto.sol}.`,
        isFallback: false
      };
    } else {
      throw new Error(`No latest photos found for rover ${rover}`);
    }
  } catch (error) {
    console.error(`Error fetching Mars Rover photos for ${rover}:`, error);
    
    // Choose a fallback photo based on requested rover
    const index = roverLower === 'perseverance' ? 1 : 0;
    const fallback = FALLBACK_MARS_PHOTOS[index] || FALLBACK_MARS_PHOTOS[2];
    
    return {
      ...fallback,
      isFallback: true
    };
  }
}
