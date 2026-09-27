# ARCHITECTURE.md — Mahfooz Balakot

## 1. Constraints Driving This Architecture

- **Zero budget** → every service used must have a permanently free tier (not just a trial).
- **One-day build** → prefer tools with no backend-provisioning overhead.
- **No government dependency** → no reliance on official APIs, NDMA data feeds, or municipal servers. All data is community-generated.
- **Responsive, single codebase** → desktop sidebar + mobile bottom-nav from one component set.

## 2. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **React** (Vite) or plain HTML/CSS/JS | React speeds up building repeated components (cards, list items, nav) across 7+ screens; plain JS is fine if the team is more comfortable with it and time is extremely tight |
| Styling | **Tailwind CSS** | Fast to implement the exact color-token system and responsive breakpoints from DESIGN.md without writing custom CSS from scratch |
| Map | **Leaflet.js + OpenStreetMap tiles** | Free, no API key, no billing risk — unlike Google Maps JS API which requires a card on file |
| Backend / database | **Firebase (Spark free plan)** — Firestore + Firebase Auth (optional, can skip auth for MVP) | No server to manage, generous free real-time reads/writes, realtime listeners make "Community Status" and "Recent Activity" update live with almost no code |
| Media storage | **Firebase Storage (free tier)** | For hazard-report photo uploads |
| Hosting | **Vercel / Netlify / GitHub Pages (free)** | One-click deploy from a git repo, free HTTPS, custom subdomain |
| Icons | **Lucide / Heroicons (free, open-source)** | Matches the clean icon style in the mockups at no cost |

> **Fallback for extreme time pressure:** if Firebase setup eats too much hackathon time, ship the demo with a local JSON mock dataset (`data.js`) + `localStorage` for "I'm Safe" / hazard-report submissions so every core flow still visibly works live, and swap in Firestore post-demo. This is a legitimate, judge-transparent trade-off to state openly if used.

## 3. High-Level System Diagram (conceptual)

```
┌─────────────────────────────┐
│         Browser Client        │
│  (React + Tailwind, responsive)│
│                               │
│  Dashboard | Risk Map | Check-In │
│  Contacts | Volunteers | Prep  │
│  Reports & Updates            │
└───────────────┬───────────────┘
                │  Firestore SDK (realtime listeners)
                ▼
┌─────────────────────────────┐
│      Firebase (Free Tier)     │
│  • Firestore (reports, users, │
│    checkins, volunteers,      │
│    safezones)                 │
│  • Storage (hazard photos)    │
└─────────────────────────────┘
                ▲
                │ Leaflet + OSM tile requests (public, free)
                ▼
┌─────────────────────────────┐
│   OpenStreetMap Tile Servers  │
└─────────────────────────────┘
```

No custom backend server is required — the browser talks directly to Firebase's managed services and to public OSM tile servers. This keeps the entire system serverless, free, and deployable in hours.

## 4. Data Model

### `hazardReports`
```
{
  id: string,
  category: "unsafe_building" | "blocked_road" | "unsafe_bridge" | "fire_gas" | "other",
  description: string,
  photoUrl: string | null,
  lat: number,
  lng: number,
  reportedBy: string,        // display name or anonymous id
  status: "unverified" | "verified" | "resolved",
  createdAt: timestamp
}
```

### `safeZones`
```
{
  id: string,
  name: string,               // e.g. "Government High School"
  lat: number,
  lng: number,
  capacityNote: string | null,
  addedBy: string,
  createdAt: timestamp
}
```

### `resources` (water / food / medical)
```
{
  id: string,
  type: "water" | "food" | "medical",
  name: string,
  lat: number,
  lng: number,
  verified: boolean,
  createdAt: timestamp
}
```

### `volunteers`
```
{
  id: string,
  name: string,
  phone: string,
  role: "first_aid" | "driver" | "doctor" | "rescue" | "general",
  createdAt: timestamp
}
```

### `checkIns`
```
{
  id: string,
  userId: string,
  familyGroupId: string,      // links family members together for the "I'm Safe" family view
  status: "safe" | "unknown",
  updatedAt: timestamp
}
```

### `activityFeed` (derived/denormalized for the "Recent Community Activity" list)
```
{
  id: string,
  type: "report" | "volunteer_joined" | "resource_verified" | "checkin",
  summary: string,            // e.g. "Unsafe building reported near Main Bazaar"
  refId: string,               // points back to source doc
  createdAt: timestamp
}
```

## 5. Screen → Data Mapping

| Screen | Reads | Writes |
|---|---|---|
| Dashboard | `activityFeed`, counts from `hazardReports`/`safeZones`/`resources`/`volunteers` | — |
| Risk Map | `hazardReports`, `safeZones`, `resources`, `volunteers` (as map pins) | new `hazardReports` doc (via Report Hazard flow) |
| Report Hazard | — | `hazardReports`, triggers `activityFeed` entry |
| Safe Check-In | `checkIns` (filtered by `familyGroupId`) | own `checkIns` doc |
| Emergency Contacts | `volunteers` (filtered by role) | — |
| Volunteers (Join) | — | new `volunteers` doc |
| Find Safe Zone | `safeZones` | — |
| Preparedness | static/local checklist content + per-user progress (localStorage or `users/{id}/checklist`) | checklist item toggles |
| Reports & Updates | `activityFeed`, `hazardReports` | — |

## 6. Component Architecture (Frontend)

```
src/
  components/
    layout/
      SidebarNav.jsx        // desktop
      BottomNav.jsx         // mobile
      TopBar.jsx
    dashboard/
      StatusBanner.jsx
      QuickActions.jsx
      CommunityReportsPanel.jsx
      PreparednessWidget.jsx
      ActivityFeed.jsx
    map/
      RiskMap.jsx           // Leaflet wrapper
      MapFilterChips.jsx
      MapLegend.jsx
    checkin/
      SafeCheckInCard.jsx
      FamilyMemberList.jsx
    contacts/
      ContactsTabs.jsx
      ContactCard.jsx
    volunteers/
      VolunteerForm.jsx
    preparedness/
      ChecklistCard.jsx
      GuideTabs.jsx          // Before / During / After
    reportHazard/
      HazardCategoryPicker.jsx
      PhotoUpload.jsx
  pages/
    Dashboard.jsx
    RiskMap.jsx
    SafeCheckIn.jsx
    EmergencyContacts.jsx
    Volunteers.jsx
    Preparedness.jsx
    ReportsUpdates.jsx
  lib/
    firebase.js              // init + config
    useFirestoreCollection.js  // shared realtime-listener hook
  App.jsx                     // routing + responsive layout switch
```

Routing: a simple client-side router (React Router) with routes matching the sidebar/bottom-nav items 1:1. The same `<App>` shell renders `<SidebarNav>` above `md` breakpoint and `<BottomNav>` below it — no separate mobile app.

## 7. Build & Deploy Plan (One Day)

1. **Hour 0–1:** Scaffold Vite + React + Tailwind; set up Firebase project (free) and Firestore collections above; seed with mock data matching the mockups (12 unsafe buildings, 8 safe zones, 34 volunteers, etc.) so the demo looks alive immediately.
2. **Hour 1–4:** Build layout shell (SidebarNav/BottomNav/TopBar) + Dashboard screen end-to-end.
3. **Hour 4–7:** Build Risk Map (Leaflet + pin categories + filters) and Report Hazard flow (writes to Firestore, appears on map + activity feed live).
4. **Hour 7–9:** Build Safe Check-In, Emergency Contacts, Volunteers screens.
5. **Hour 9–11:** Build Preparedness + Reports & Updates + language toggle (Urdu/Pashto strings via a simple i18n JSON dictionary).
6. **Hour 11–12:** Responsive QA pass on mobile breakpoints against the provided mockups.
7. **Hour 12–13:** Deploy to Vercel/Netlify, test live link on a phone.
8. **Hour 13–14:** Polish, rehearse demo script (Report Hazard → live on map → live in feed → I'm Safe → family sees update).

## 8. Security & Abuse Considerations (stated, not necessarily built in v1)

- Firestore security rules restrict writes to sane rate limits and required fields (prevents spam).
- No PII beyond name/phone is stored; phone numbers are only shown for opted-in Volunteers/Contacts.
- v1 has no formal verification of self-reported hazards/volunteers — this is explicitly framed to judges as a "community trust + future moderation roadmap" item, not a hidden gap.

## 9. Why This Architecture Fits the Constraints

- **$0 cost:** Firebase Spark, Leaflet/OSM, Vercel/Netlify, and open-source icon sets are all permanently free at hackathon/early-adoption scale.
- **No government dependency:** every data source is either community-submitted (Firestore) or open-source public infrastructure (OpenStreetMap) — nothing routes through an official agency.
- **Fast to build:** serverless managed services mean zero DevOps; a small team can realistically ship all 7 screens, responsive, in one day.
- **Credible to scale later:** if the project continues past the hackathon, this stack scales to real usage before any paid tier is required.
