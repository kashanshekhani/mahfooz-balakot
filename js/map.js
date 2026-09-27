// Leaflet Map Controller for Mahfooz Balakot
// Coordinates centered on Balakot, KP (34.5484, 73.3533)
// No long em dashes used.

import { CONFIG } from './config.js';

export class BalakotMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.map = null;
    this.markersLayer = null;
    this.activeFilter = 'all';
    this.routeLayer = null;
    this.currentCenter = CONFIG.MAP_CENTER || [34.5484, 73.3533];
    this.defaultZoom = CONFIG.MAP_DEFAULT_ZOOM || 14;
    this.onReportClick = options.onReportClick || null;
    this.onVerifyClick = options.onVerifyClick || null;
    this.isDashboard = options.isDashboard || false;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Destroy existing instance if any
    if (this.map) {
      this.map.remove();
    }

    const isMobile = window.innerWidth <= 768;

    // Initialize Leaflet Map
    this.map = L.map(this.containerId, {
      center: this.currentCenter,
      zoom: isMobile ? 13.5 : this.defaultZoom,
      zoomControl: !isMobile || !this.isDashboard,
      scrollWheelZoom: !this.isDashboard,
      attributionControl: true
    });

    // Add CARTO Basemaps raster tiles if configured, otherwise use OpenStreetMap
    const tileUrl = CONFIG.CARTO_TILE_URL || CONFIG.OSM_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = CONFIG.CARTO_TILE_URL
      ? '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';

    L.tileLayer(tileUrl, {
      attribution: attribution,
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Zoom control in custom clean position if enabled
    if (!isMobile || !this.isDashboard) {
      L.control.zoom({ position: 'topright' }).addTo(this.map);
    }

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);

    // Map click handler to trigger "Report Hazard Here"
    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (this.options.onMapClick) {
        this.options.onMapClick(lat, lng);
      }
    });

    // Invalidate size on load to avoid grey tile glitches
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);

    // Handle window resize / orientation change
    window.addEventListener('resize', () => {
      if (this.map) this.map.invalidateSize();
    });
  }

  invalidate() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 150);
    }
  }

  setFilter(filterType) {
    this.activeFilter = filterType;
  }

  createCustomIcon(category, type = 'hazard') {
    let bgClass = 'bg-navy';
    let iconSvg = '';

    if (category === 'unsafe_building') {
      bgClass = 'pin-danger';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else if (category === 'blocked_road' || category === 'landslide' || category === 'unsafe_bridge') {
      bgClass = 'pin-warning';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>';
    } else if (type === 'safezone') {
      bgClass = 'pin-safe';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    } else if (category === 'medical') {
      bgClass = 'pin-purple';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    } else if (category === 'water') {
      bgClass = 'pin-water';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>';
    } else if (category === 'food') {
      bgClass = 'pin-orange';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M6 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2"/><line x1="10" y1="2" x2="10" y2="8"/><line x1="14" y1="2" x2="14" y2="8"/></svg>';
    } else if (type === 'volunteer') {
      bgClass = 'pin-navy';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    } else {
      bgClass = 'pin-blue';
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><circle cx="12" cy="12" r="10"/></svg>';
    }

    const html = `
      <div class="custom-map-pin ${bgClass}">
        <div class="pin-inner">
          ${iconSvg}
        </div>
        <div class="pin-pulse"></div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-leaflet-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  }

  renderData(state) {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();
    const filter = this.activeFilter;
    const isMobile = window.innerWidth <= 768;
    const popupWidth = isMobile ? 260 : 300;

    // 1. Hazard Reports
    state.hazardReports.forEach((report) => {
      if (report.status === 'resolved') return;
      
      const isRoad = ['blocked_road', 'landslide', 'unsafe_bridge'].includes(report.category);
      const isBuilding = report.category === 'unsafe_building';
      
      if (filter !== 'all') {
        if (filter === 'unsafe' && !isBuilding) return;
        if (filter === 'roads' && !isRoad) return;
        if (filter !== 'unsafe' && filter !== 'roads') return;
      }

      const icon = this.createCustomIcon(report.category, 'hazard');
      const marker = L.marker([report.lat, report.lng], { icon: icon });

      const photoHtml = report.photoUrl 
        ? `<div class="popup-photo-wrap"><img src="${report.photoUrl}" alt="${report.title}" class="popup-photo" /></div>` 
        : '';

      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header">
            <span class="badge ${isBuilding ? 'badge-danger' : 'badge-orange'}">${report.category.replace('_', ' ').toUpperCase()}</span>
            <span class="popup-status ${report.status === 'verified' ? 'status-verified' : 'status-unverified'}">
              ${report.status === 'verified' ? '✓ Verified (' + report.verifiedCount + ')' : '• Pending'}
            </span>
          </div>
          ${photoHtml}
          <h4 class="popup-title">${report.title}</h4>
          <p class="popup-desc">${report.description}</p>
          <div class="popup-meta">
            <span>📍 ${report.locationName}</span>
            <span>🕒 ${report.createdAt}</span>
          </div>
          <div class="popup-actions">
            <button class="btn-popup-verify" data-id="${report.id}">
              👍 Verify (+1)
            </button>
            <button class="btn-popup-route" data-lat="${report.lat}" data-lng="${report.lng}" data-name="${report.title}">
              🧭 Avoid Area
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: popupWidth, minWidth: 240, className: 'mahfooz-popup' });
      this.markersLayer.addLayer(marker);
    });

    // 2. Safe Zones
    if (filter === 'all' || filter === 'safezones') {
      state.safeZones.forEach((sz) => {
        const icon = this.createCustomIcon('safezone', 'safezone');
        const marker = L.marker([sz.lat, sz.lng], { icon: icon });

        const popupContent = `
          <div class="map-popup-card safezone-card">
            <div class="popup-header">
              <span class="badge badge-safe">SAFE ZONE</span>
              <span class="popup-badge-green">${sz.availableSpace}</span>
            </div>
            <h4 class="popup-title">${sz.name}</h4>
            <p class="popup-desc">${sz.capacityNote}</p>
            <div class="popup-facilities">
              ${sz.facilities.map(f => `<span class="facility-pill">${f}</span>`).join('')}
            </div>
            <div class="popup-meta">
              <span>📍 ${sz.locationName}</span>
              <span>⛰️ ${sz.elevation}</span>
            </div>
            <div class="popup-actions">
              <button class="btn-popup-directions" data-lat="${sz.lat}" data-lng="${sz.lng}" data-name="${sz.name}">
                🚶 Walking Path (${sz.distance})
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: popupWidth, minWidth: 240, className: 'mahfooz-popup' });
        this.markersLayer.addLayer(marker);
      });
    }

    // 3. Resources (Water, Food, Medical)
    state.resources.forEach((res) => {
      if (filter !== 'all') {
        if (filter === 'water' && res.type !== 'water') return;
        if (filter === 'food' && res.type !== 'food') return;
        if (filter === 'medical' && res.type !== 'medical') return;
        if (!['water', 'food', 'medical'].includes(filter)) return;
      }

      const icon = this.createCustomIcon(res.type, 'resource');
      const marker = L.marker([res.lat, res.lng], { icon: icon });

      const badgeColor = res.type === 'medical' ? 'badge-purple' : (res.type === 'water' ? 'badge-water' : 'badge-orange');

      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header">
            <span class="badge ${badgeColor}">${res.type.toUpperCase()}</span>
            <span class="popup-status status-verified">✓ Verified</span>
          </div>
          <h4 class="popup-title">${res.name}</h4>
          <p class="popup-desc">${res.notes}</p>
          <div class="popup-meta">
            <span>📍 ${res.locationName}</span>
            <span>🕒 ${res.updatedAt}</span>
          </div>
          <div class="popup-actions">
            <button class="btn-popup-directions" data-lat="${res.lat}" data-lng="${res.lng}" data-name="${res.name}">
              📍 Navigate Here
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: popupWidth, minWidth: 240, className: 'mahfooz-popup' });
      this.markersLayer.addLayer(marker);
    });

    // Attach click events inside popups via document delegation
    this.attachPopupListeners();
  }

  attachPopupListeners() {
    setTimeout(() => {
      document.querySelectorAll('.btn-popup-verify').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.target.getAttribute('data-id');
          if (this.onVerifyClick) this.onVerifyClick(id);
        };
      });

      document.querySelectorAll('.btn-popup-directions').forEach(btn => {
        btn.onclick = (e) => {
          const lat = parseFloat(e.target.getAttribute('data-lat'));
          const lng = parseFloat(e.target.getAttribute('data-lng'));
          const name = e.target.getAttribute('data-name');
          this.drawWalkingRoute(lat, lng, name);
        };
      });
    }, 100);
  }

  drawWalkingRoute(targetLat, targetLng, targetName) {
    if (!this.map || !this.routeLayer) return;

    this.routeLayer.clearLayers();

    // User simulated start point (Balakot center)
    const userLat = 34.5478;
    const userLng = 73.3518;

    // Create path with intermediate walking waypoints
    const midLat = (userLat + targetLat) / 2 + 0.0008;
    const midLng = (userLng + targetLng) / 2;

    const routeCoords = [
      [userLat, userLng],
      [midLat, midLng],
      [targetLat, targetLng]
    ];

    // User position marker
    const userMarker = L.marker([userLat, userLng], {
      icon: L.divIcon({
        html: `<div class="user-position-marker"><div class="user-pulse"></div></div>`,
        className: 'user-pin-wrap',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).bindPopup('<b>Your Current Location</b><br>Balakot Center');

    const polyline = L.polyline(routeCoords, {
      color: '#2F6FE4',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    });

    this.routeLayer.addLayer(userMarker);
    this.routeLayer.addLayer(polyline);

    this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    if (window.showToast) {
      window.showToast(`Route mapped to ${targetName}. Follow safe mountain trail!`, 'info');
    }
  }

  centerOn(lat, lng, zoom = 16) {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  }

  recenter() {
    if (this.map) {
      this.map.flyTo(this.currentCenter, this.defaultZoom, { duration: 1.0 });
    }
  }
}
