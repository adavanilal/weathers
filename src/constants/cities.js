export const API_KEY = "b8b969778b291dfb7a094d1c8ad2bd93";

// Top hubs for live API fetching
export const DEFAULT_POPULAR_CITIES = [
  'Delhi',
  'Mumbai',
  'Hyderabad',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'London',
  'Tokyo',
  'New York',
  'Dubai'
];

export const mapConditionToIconType = (cond) => {
  const c = (cond || '').toLowerCase();
  if (c.includes('thunder')) return 'thunder';
  if (c.includes('heavy') || (c.includes('rain') && c.includes('extreme'))) return 'heavy-rain';
  if (c.includes('rain')) return 'rain';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('snow')) return 'snow';
  if (c.includes('clear') || c.includes('sun')) return 'sun';
  if (c.includes('cloud') && c.includes('sun')) return 'sun-cloud';
  return 'cloud';
};

// Map Tile URLs (Free, reliable, no watermarks, no API keys needed)
export const getTileUrl = (layerType) => {
  switch (layerType) {
    case 'dark':
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    case 'satellite':
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    case 'streets':
    default:
      return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  }
};
