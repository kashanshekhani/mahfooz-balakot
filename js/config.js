export const CONFIG = {
  CARTO_API_KEY: '',
  CARTO_TILE_URL: '',
  OSM_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  MAP_CENTER: [34.5484, 73.3533],
  MAP_DEFAULT_ZOOM: 14,
  APP_NAME: 'Mahfooz Balakot'
};

export async function loadRuntimeConfig() {
  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      const serverConfig = await response.json();
      Object.assign(CONFIG, serverConfig);
    }
  } catch (err) {
  }
  return CONFIG;
}
