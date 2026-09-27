// Application Configuration
// Secrets and keys are strictly loaded from .env via the local server (/api/config)
// If running without a server, fallback to OpenStreetMap

export const CONFIG = {
  CARTO_API_KEY: '',
  CARTO_TILE_URL: '',
  OSM_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  MAP_CENTER: [34.5484, 73.3533],
  MAP_DEFAULT_ZOOM: 14,
  APP_NAME: 'Mahfooz Balakot'
};

// Dynamically load runtime configuration from .env via backend API
export async function loadRuntimeConfig() {
  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      const serverConfig = await response.json();
      Object.assign(CONFIG, serverConfig);
    }
  } catch (err) {
    // Running in static environment or offline; defaults will be used
  }
  return CONFIG;
}
