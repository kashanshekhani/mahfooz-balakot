# Mahfooz Balakot (محفوظ بالاکوٹ)

### Community Earthquake Preparedness & Real-Time Emergency Response Network
**Tagline:** *Together We Are Mahfooz* | *Safer Community, Stronger Tomorrow*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](http://localhost:5173)
[![Region: Balakot, KPK](https://img.shields.io/badge/Region-Balakot%2C%20KPK%20Pakistan-orange.svg)](#)
[![RTL Support](https://img.shields.io/badge/RTL-Urdu%20%7C%20Pashto-brightgreen.svg)](#)
[![Zero Budget](https://img.shields.io/badge/Architecture-Zero%20Budget%20%2F%20Serverless-purple.svg)](#)

---

## 1. Overview

Balakot, located in the Mansehra District of Khyber Pakhtunkhwa, sits directly on active Himalayan seismic fault lines and was the epicenter of the devastating 7.6 magnitude earthquake in October 2005. Two decades later, the valley remains situated in a high-seismic-risk red zone with rugged topography, landslide-prone transit corridors, and limited municipal resources.

**Mahfooz Balakot** is a lightweight, community-owned web platform engineered to transform the residents of Balakot into a self-organizing safety and mutual-aid network. It delivers real-time hazard mapping, one-tap family check-ins, verified safe assembly zones, emergency responder directories, and household preparedness checklists: all operating with zero reliance on government infrastructure or municipal budgets.

---

## 2. Core Capabilities & Modules

### Real-Time Community Dashboard
- **Color-Coded Status Banner:** Dynamic community advisory banner (Normal: Green / Alert: Red) with live simulation toggles and manual refresh.
- **Quick Action Grid:** High-contrast, touch-optimized action cards:
  - **Report Hazard** (Alert Red)
  - **I am Safe** (Safe Green)
  - **Find Safe Zone** (Accent Blue)
  - **Emergency Help** (Emergency Purple)
- **Live Community Metrics:** Real-time counters tracking Unsafe Buildings, Blocked Roads, Safe Zones, Water Sources, and Active Volunteers.
- **Embedded Interactive Map Preview:** Geospatial snapshot of Balakot with category filters and interactive markers.
- **Resilience Panel:** "Our Home, Our Responsibility" card anchoring the platform emotionally with authentic imagery and civic pride.
- **Recent Activity Feed:** Reverse-chronological timeline logging verified safe check-ins, road clearances, and hazard notices.

### Interactive Risk & Resource Map (Leaflet.js + CARTO Basemaps)
- **High-Accuracy Geospatial Center:** Centered on Balakot, KP (`34.5484° N, 73.3533° E`).
- **CARTO Voyager Basemaps:** Vector-styled raster tiles powered by CARTO Basemaps API key with seamless fallback to OpenStreetMap.
- **Custom Visual Markers:**
  - Unsafe Buildings & Structural Cracks (Red pin with pulsing beacon)
  - Blocked Roads & Hillside Landslides (Orange pin with hazard badge)
  - Verified Safe Assembly Zones (Green pin with safety shield)
  - Medical Clinics & Paramedic Posts (Purple pin with emergency cross)
  - Clean Drinking Water Points (Blue pin with water droplet)
  - Food & Supply Relief Stations (Amber pin with ration icon)
- **Interactive Popup Cards:** Complete details including damage photos, calculated distance, walking route polylines, and community verification upvotes (`+1`).
- **Neighborhood Search & Recenter:** Rapid search across Balakot localities (Garlat, Main Bazaar, Sangar, Hasamabad, Kaghan Road).

### Safe Check-In ("I am Safe")
- **One-Tap Status Confirmation:** Large circular CTA with instant timestamping and geographic coordinates recording.
- **Family & Household Circle:** Real-time monitoring of family members, recording battery levels, last-seen locations, and timestamped statuses.
- **WhatsApp Shareable Broadcast:** Single-tap generation of pre-formatted WhatsApp status messages for family groups and diaspora relatives.

### Crowdsourced Hazard Reporting
- **Multi-Category Damage Reporting:** Damaged Building, Blocked Road, Landslide, Unsafe Bridge, Gas/Electrical Hazard, or Other.
- **Urgency Classification:** High, Medium, and Low priority triage.
- **Photo Evidence Simulation:** Visual hazard preview and landmark description inputs.
- **Instant Propagation:** Submissions update local state, map markers, and community feeds immediately.

### Emergency Contacts & Responders Directory
- **Direct Local Directory:** Categorized tabs for Local Doctors, 4x4 Mountain Drivers, First Aid Responders, and Rescue Personnel.
- **One-Touch Communication:** Direct click-to-call (`tel:`) and direct WhatsApp messaging (`wa.me`).
- **Emergency Hotline Modal:** Instant access to Rescue 1122, Edhi Emergency 115, Balakot Police Station, and DHQ Trauma Desk.

### Verified Safe Assembly Zones
- **Geographic Safety Verification:** Directory of open grounds verified safe from building collapses and Kunhar River flash surges (Govt High School Ground, Sangar Hill Ridge, Balakot Sports Ground, Hasamabad Meadow).
- **Capacity & Facility Indicators:** Elevation data, tent capacity, clean water availability, and solar backup lighting.
- **Walking Path Simulation:** Visual navigation polylines guiding users to the nearest assembly zone.

### Volunteer & Responder Network
- **Community Registration:** Simple onboarding form for local residents to register specialized skills (First Aid, 4x4 Off-Road Transport, Search & Rescue, Heavy Equipment, Medical).
- **Live Responder Roster:** Searchable and filterable directory of active community volunteers ready to deploy.

### Household Preparedness & Survival Guides
- **10-Point Readiness Checklist:** Interactive checklist with progress percentage bar, completed item counters, and achievement badges.
- **3-Stage Himalayan Earthquake Guide:** Clear protocols for Before (Securing homes), During (Drop, Cover, Hold On), and After (Evacuation & Gas checks).
- **Printable Pocket Emergency Card:** Single-sheet offline guide formatted for grab bags and physical wallets.

### Multilingual & True RTL Support
- **Tri-Lingual Engine:** Native support for **English**, **Urdu (اردو)**, and **Pashto (پښتو)**.
- **Authentic Typography:** Web-font integration for Nastaliq script (`Noto Nastaliq Urdu`) and Pashto typography (`Baloo Bhaijaan 2`).
- **Bi-Directional Layout Mirroring:** Complete CSS RTL transformations for sidebar, navigation, cards, forms, and icons.

---

## 3. Design System & Color Tokens

The visual language follows a calm, authoritative, and humanist aesthetic designed to reduce panic during emergencies while remaining functional in bright daylight and low-connectivity environments.

| CSS Variable | Hex Code | Purpose & Semantic Usage |
|---|---|---|
| `--navy-primary` | `#1B2A4A` | Sidebar background, primary brand headers, high-contrast text |
| `--navy-dark` | `#101B30` | Top header background and modal backdrops |
| `--blue-accent` | `#2F6FE4` | Primary call-to-action buttons, links, active navigation items |
| `--red-alert` | `#E0433D` | Hazard reporting, unsafe structures, emergency hotlines |
| `--green-safe` | `#2FA84F` | Safety confirmation, safe assembly zones, completed checklists |
| `--purple-help` | `#7C5CE0` | Medical directory, doctor contacts, trauma assistance |
| `--orange-supply` | `#F0973B` | Blocked roads, landslides, food & relief supply stations |
| `--water-blue` | `#3DA5D9` | Verified clean drinking water points |
| `--bg-light` | `#F5F7FB` | Application canvas and page body background |
| `--surface-white` | `#FFFFFF` | Content cards, data tables, and interactive sheets |

---

## 4. Architecture & Technical Stack

```
                     +----------------------------------------------------+
                     |                 Client Browser                     |
                     |  (HTML5 + Vanilla CSS3 + ES6 JavaScript Modules)   |
                     +-------------------------+--------------------------+
                                               |
         +--------------------+----------------+--------------------+
         |                    |                                     |
+--------v--------+  +--------v--------+                   +--------v--------+
|  State Engine   |  |   Map Service   |                   |  i18n & Assets  |
|  (localStorage) |  |   (Leaflet.js)  |                   | (EN / UR / PS)  |
+-----------------+  +--------+--------+                   +-----------------+
                              |
                     +--------v--------+
                     |  CARTO Voyager  |
                     |  Basemaps API   |
                     +-----------------+
```

- **Frontend Core:** Pure HTML5, Vanilla CSS3 (Custom Properties), and Modular ES6 JavaScript. Zero heavy framework lock-in.
- **Mapping Engine:** Leaflet.js v1.9.4 integrated with CARTO Voyager Raster Tiles and OpenStreetMap fallback.
- **Reactive State Management:** Observer-based state store with instant `localStorage` persistence, enabling complete offline continuity across browser refreshes.
- **Typography:** Google Fonts (`Plus Jakarta Sans`, `Outfit`, `Noto Nastaliq Urdu`, `Baloo Bhaijaan 2`).
- **Icons & Graphics:** Clean SVG vectors and high-definition local imagery.
- **Local Server:** Zero-dependency Node.js ESM server with automatic port-conflict resolution (`port + 1`).

---

## 5. Project Directory Structure

```
mahfooz-balakot/
├── .env                      # Environment variables & CARTO API keys
├── .env.example              # Template environment file
├── index.html                # Main semantic application markup (all 8 views & modals)
├── package.json              # Project scripts and package configuration
├── server.js                 # Zero-dependency Node.js static ESM server
├── README.md                 # Complete system documentation
├── PRD.md                    # Product Requirements Document
├── ARCHITECTURE.md           # Architecture and technical specification
├── DESIGN.md                 # Design guidelines and token specifications
├── assets/                   # Vector icons & visual media
│   ├── balakot_landscape.jpg # Panoramic photograph of Balakot valley
│   ├── hazard_crack.jpg      # Structural damage reference photograph
│   └── favicon.svg           # Vector mountain & shield favicon
├── css/                      # Modular style system
│   ├── main.css              # Core tokens, reset, typography, responsive shell
│   ├── components.css        # Action cards, metrics track, bottom sheets, modals
│   ├── map.css               # Leaflet pins, pulsing animations, popup cards
│   └── rtl.css               # Right-to-left layout rules for Urdu & Pashto
└── js/                       # Modular ES6 JavaScript architecture
    ├── config.js             # Client configuration, CARTO URL generator & fallback
    ├── data.js               # Initial seed dataset (Balakot geography & emergency data)
    ├── i18n.js               # Localization strings dictionary (EN, UR, PS)
    ├── map.js                # Leaflet map controller, routing polyline & search
    ├── state.js              # Reactive state store & localStorage sync
    └── app.js                # App router, modal controller, bottom sheets & toasts
```

---

## 6. Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- Modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari)

### Quick Start & Local Execution

1. **Open your terminal and navigate to the project folder:**
   ```powershell
   cd "c:\Users\kashan\OneDrive - Habib University\Projects\mahfooz-balakot"
   ```

2. **Verify Environment Setup:**
   A configured `.env` file is included with active CARTO Basemap credentials:
   ```env
   CARTO_API_KEY=cb1_406e_1_357cb530ade75c46104dfb50
   PORT=5173
   ```

3. **Start the Web Server:**
   You can launch the server using any of the following standard commands:

   *Using standard npm script:*
   ```powershell
   npm run dev
   ```

   *If Windows PowerShell restricts execution scripts (`npm.ps1`), use:*
   ```powershell
   npm.cmd run dev
   ```

   *Or run directly via Node.js:*
   ```powershell
   node server.js
   ```

4. **Access the Application:**
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 7. Responsive Layout & Mobile Parity

Mahfooz Balakot is designed from the ground up with contextual responsive ergonomics:

- **Desktop Experience (>= 769px):**
  - Fixed left sidebar navigation with persistent brand identity and language switcher.
  - Top status header with live advisory indicator and quick action buttons.
  - Multi-column dashboard with side-by-side metric counters, interactive map preview, and community feeds.
- **Mobile Experience (<= 768px):**
  - Fixed mobile topbar with live status badge and language selector.
  - Swipeable metric counter carousel for quick thumb gestures.
  - High-touch 2x2 grid for emergency quick actions.
  - Full-height sub-pages with dedicated back-navigation headers.
  - Bottom-sheet modals (`.bottom-sheet`) featuring drag-handle bars for natural thumb reach.
  - Fixed 5-tab bottom navigation bar: **Home**, **Map**, **Check-In**, **Contacts**, and **More** (triggering the drawer for Safe Zones, Volunteers, and Preparedness).

---

## 8. Data Persistence & Privacy

- **Local-First Architecture:** All user check-ins, hazard reports, volunteer registrations, and checklist progress are stored locally on the device via `localStorage`.
- **Zero Account Wall:** No mandatory logins, passwords, or personal identity verifications required to access emergency help, view hazard maps, or confirm safety.
- **Privacy by Default:** Contact numbers and family circle entries remain in the user's local browser storage unless explicitly shared via direct WhatsApp broadcast links.

---

## 9. Future Roadmap

1. **Progressive Web App (PWA) Offline Engine:** Service worker caching for map tiles and survival guides during total network blackouts.
2. **SMS Relay Bridge:** Direct GSM/SMS fallback allowing check-in updates and hazard reporting without active mobile data.
3. **Local Mesh Sync:** Peer-to-peer Wi-Fi Direct and Bluetooth mesh synchronization between community volunteers.
4. **Regional Expansion:** Extending coverage to adjacent high-risk seismic zones including Muzaffarabad, Bagh, Battagram, and Kaghan.

---

## 10. License

This project is open-source and distributed under the [MIT License](LICENSE).

Developed with civic commitment for the safety and resilience of the community of Balakot.
