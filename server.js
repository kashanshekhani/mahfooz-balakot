import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const env = {};
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            env[key] = val;
          }
        }
      });
    }
  } catch (err) {
    console.warn('[Notice] Could not load .env file:', err.message);
  }
  return env;
}

const envVars = loadEnv();
let initialPort = process.env.PORT || envVars.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createServer(port) {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    if (reqUrl === '/api/config') {
      const currentEnv = loadEnv();
      const publicConfig = {
        CARTO_API_KEY: currentEnv.CARTO_API_KEY || '',
        CARTO_TILE_URL: currentEnv.CARTO_TILE_URL || '',
        MAP_CENTER: [
          parseFloat(currentEnv.MAP_CENTER_LAT) || 34.5484,
          parseFloat(currentEnv.MAP_CENTER_LNG) || 73.3533
        ],
        MAP_DEFAULT_ZOOM: parseInt(currentEnv.MAP_DEFAULT_ZOOM, 10) || 14,
        APP_NAME: 'Mahfooz Balakot'
      };

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(publicConfig));
      return;
    }

    if (reqUrl === '/') reqUrl = '/index.html';

    const filePath = path.join(__dirname, reqUrl);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n[Notice] Port ${port} is busy. Trying port ${port + 1}...`);
      createServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`  Mahfooz Balakot - Community Safety Network`);
    console.log(`  Ready: http://localhost:${port}`);
    console.log(`==================================================\n`);
  });
}

createServer(Number(initialPort));
