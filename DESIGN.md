# DESIGN.md — Mahfooz Balakot

## 1. Brand Identity

- **Name:** Mahfooz Balakot (mahfooz = "safe/protected" in Urdu)
- **Tagline:** "Together We Are Mahfooz" / "Safer Community, Stronger Tomorrow"
- **Logo mark:** a mountain silhouette (representing Balakot's Kaghan-valley geography) inside/beside a shield-with-heart icon — communicating protection + community care, not officialdom.
- **Tone:** calm, reassuring, dignified — never alarmist. Copy leans toward clarity and reassurance ("Community Status: Normal," "Let your family know you're safe") rather than fear-based language.

## 2. Color System

| Token | Hex (approx.) | Usage |
|---|---|---|
| `--navy-primary` | #1B2A4A | Sidebar background, headers, primary text |
| `--blue-accent` | #2F6FE4 | Primary actions, links, active nav state, "Find Safe Zone" |
| `--red-alert` | #E0433D | Hazard/danger actions ("Report Hazard," unsafe buildings) |
| `--green-safe` | #2FA84F | Safety confirmations ("I'm Safe," Safe Zones, checklist done) |
| `--purple-help` | #7C5CE0 | Emergency Help / medical actions |
| `--orange-supply` | #F0973B | Food/supply markers |
| `--water-blue` | #3DA5D9 | Water source markers |
| `--bg-light` | #F5F7FB | Page background |
| `--surface-white` | #FFFFFF | Cards |
| `--text-muted` | #6B7280 | Secondary text, timestamps |

**Principle:** color is functional, not decorative. Every accent color maps to exactly one meaning system-wide (red = danger, green = safety, blue = navigation/info, purple = medical/help, orange = supplies). This consistency is what lets users scan the Risk Map instantly without reading labels.

## 3. Typography

- **Primary typeface:** a clean, humanist sans-serif (e.g., Inter, Segoe UI, or system font stack) for strong legibility on both desktop and small mobile screens.
- **Urdu/Pashto typeface:** a Nastaliq-compatible web font (e.g., Noto Nastaliq Urdu) loaded conditionally when the language toggle is set to Urdu/Pashto, with right-to-left layout mirroring.
- **Scale:** large, confident headers for status banners (18–24px); body copy 14–16px; timestamps/meta text 12px muted gray.

## 4. Layout System

### Desktop
- Fixed left sidebar (navy) — logo, primary nav (Dashboard, Risk Map, Safe Check-In, Emergency Contacts, Volunteers, Preparedness, Reports & Updates), sign-off tagline anchored at bottom.
- Main content area on a light gray canvas with white cards, generous padding, rounded corners (8–12px radius), soft shadows for elevation.
- Top bar: location context ("Balakot, Khyber Pakhtunkhwa"), notifications bell, user identity.
- Two-column dashboard: map + quick actions on the left (wide), Community Reports + Preparedness + hero image on the right (narrow rail).

### Mobile
- Header collapses to a compact bar with logo + notification icon.
- Bottom tab bar replaces the sidebar: Home, Map, Check-In, Contacts, More — the 5 highest-frequency actions get permanent thumb-reach access.
- Content stacks vertically in single-column cards; quick-action buttons become a 2×2 grid instead of a 4-across row.
- Full-screen sub-pages (Report Hazard, Find Safe Zone, Join Volunteer, Preparedness Guide) use a back-arrow header pattern instead of nested navigation.

**Responsive rule:** one shared component library; layout switches at a single breakpoint (~768px), no separate "mobile app" codebase.

## 5. Core Components

| Component | Behavior |
|---|---|
| **Status Banner** | Color-coded (green = Normal, would shift to amber/red if incidents active); shows last-updated timestamp with manual refresh |
| **Quick Action Buttons** | 4 fixed actions (Report Hazard, I'm Safe, Find Safe Zone, Emergency Help), color-coded per system above, always above the fold |
| **Risk Map** | Leaflet map, pin clustering by category, filter chips (All/Unsafe/Safe Zones/Medical/Water/Food), legend overlay, zoom controls |
| **Community Reports List** | Icon + label + count, tappable to filter map/list by that category |
| **Preparedness Checklist** | Checkbox list with progress bar (e.g., "2/5"), link to full guide |
| **Emergency Contacts Directory** | Tabbed (Volunteers/Doctors/Drivers), avatar + name + role + phone + call icon |
| **Recent Activity Feed** | Timestamped, icon-coded log entries, reverse chronological |
| **Safe Check-In Card** | Big single CTA ("Mark as Safe"), status + timestamp, family member list with individual statuses |
| **Volunteer Registration Form** | Name, phone, skill/role dropdown, single-column mobile-friendly form |

## 6. Iconography

Consistent icon-per-category system used across map pins, report lists, and buttons:
- ⚠️ Unsafe Building — red triangle
- 🌲 Safe Zone — green tree/shield
- ➕ Medical — purple cross
- 💧 Water Source — blue droplet
- 🍽 Food/Supply — orange plate
- 🚐 Volunteers/Drivers — dark transport icon

Icons are never used alone for critical meaning — always paired with a text label for accessibility.

## 7. Accessibility & Inclusivity

- **Multilingual by design:** language selector (Urdu / Pashto) is a first-class settings screen, not an afterthought — critical since literacy and language preference vary across the community.
- **High contrast:** status colors (red/green) meet WCAG AA contrast against white/light backgrounds.
- **Low-literacy friendly:** heavy reliance on icons + color coding means the app is usable even for residents with limited reading ability.
- **Large tap targets:** all primary buttons sized for one-handed mobile use, important during stressful/emergency situations.

## 8. Visual Differentiation (Why this UI wins)

- Feels like a **calm safety utility**, not a government portal or a generic disaster-news app — warm imagery of Balakot itself (the "Our Home, Our Responsibility" panel) roots the product emotionally in place.
- Consistent color-to-meaning system across every screen means judges can understand the map/reports at a glance without narration.
- Desktop and mobile aren't just "shrunk" versions of each other — navigation patterns are re-thought for context (sidebar vs. bottom tabs), showing real responsive design thinking, not just a resize.
