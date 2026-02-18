export interface QuakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    title: string;
    type: string;
    depth?: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [lon, lat, depth]
  };
}

interface USGSResponse {
  features: QuakeFeature[];
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

interface OpenMeteoResponse {
  current_weather: CurrentWeather;
}

const USGS_URL =
  'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=50';

export async function fetchQuakes(): Promise<QuakeFeature[]> {
  const res = await fetch(USGS_URL);
  if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
  const data: USGSResponse = await res.json();
  return data.features;
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data: OpenMeteoResponse = await res.json();
  return data.current_weather;
}

export function weatherCodeToLabel(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight showers',
    81: 'Moderate showers',
    82: 'Violent showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ hail',
    99: 'Thunderstorm w/ heavy hail',
  };
  return map[code] ?? `Code ${code}`;
}