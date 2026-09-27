# PRD.md — Mahfooz Balakot
### Community Earthquake Preparedness & Response Network
**Tagline:** *Together We Are Mahfooz*

---

## 1. Problem Statement

Balakot, Khyber Pakhtunkhwa, sits on two active fault lines (the Balakot–Bagh fault) and was the epicenter of the 2005 earthquake that killed an estimated 73,000–80,000 people and destroyed roughly 80% of the town's housing. Two decades later:

- Reconstruction remains incomplete — as of 2025, dozens of schools and hospitals in the area are still non-functional or unbuilt, and roads remain in poor condition.
- Balakot is still officially considered a high-seismic-risk "red zone."
- There is **no citizen-level tool** for real-time hazard reporting, shelter/safe-zone discovery, family check-ins, or emergency coordination. Residents currently rely entirely on word of mouth during and after a disaster.
- Reconstruction and disaster-management efforts have historically been slow, bureaucratic, and government-led (ERRA) — this leaves a gap for a **community-run, citizen-owned** layer that doesn't depend on state capacity or funding.

**Core insight:** the people of Balakot don't need to be told a disaster is likely — they need a fast, free, always-available way to look out for each other before, during, and after one.

---

## 2. Vision

A lightweight, community-owned web platform that turns the residents of Balakot into a self-organizing safety network — mapping hazards and safe zones in real time, letting families confirm they're safe, connecting people to local volunteers and medical help, and building household-level earthquake preparedness — with zero reliance on government infrastructure or budget.

---

## 3. Goals & Objectives

| Goal | Objective |
|---|---|
| Situational awareness | Give residents a live, crowdsourced map of hazards and safe resources |
| Family reassurance | Let people mark themselves "Safe" instantly and let relatives see it |
| Faster response | Surface verified local volunteers, doctors, and drivers in one place |
| Preparedness | Nudge every household toward a basic earthquake-readiness checklist |
| Trust without authority | Make the platform credible through community verification, not official certification |
| Zero cost, zero dependency | Build and run entirely on free tools, with no reliance on any government body |

---

## 4. Target Users / Personas

1. **Local Resident (primary)** — lives in Balakot, wants to check community status, report hazards, mark family safe, find help fast.
2. **Community Volunteer** — first-aid trained locals, drivers with vehicles, rescue-capable individuals who register to be discoverable during emergencies.
3. **Visiting Family Member (diaspora)** — relatives living outside Balakot who check the app after hearing about a tremor to see if their family has checked in safe.
4. **Local Health Worker / Doctor** — listed in Emergency Contacts as a point of medical help.

---

## 5. Scope

### In Scope (Hackathon MVP — matches current UI)
- **Dashboard** — community status banner, quick actions (Report Hazard / I'm Safe / Find Safe Zone / Emergency Help), live counters (unsafe buildings, blocked roads, safe zones, water sources, volunteers), recent activity feed, preparedness checklist widget
- **Risk Map** — interactive map with filterable pins: Unsafe Buildings, Safe Zones, Medical, Water, Food/Supply, Volunteers/Drivers
- **Safe Check-In ("I'm Safe")** — one-tap status update + visibility into family members' status and last-updated time
- **Community Reports** — running log of hazard reports, verified water sources, check-ins, with counts
- **Report Hazard** — categorized reporting (Damaged Building, Blocked Road, Unsafe Bridge, Fire/Gas Leak, Other) with photo upload
- **Emergency Contacts** — tabbed directory (Volunteers / Doctors / Drivers) with click-to-call
- **Find Safe Zone** — nearest safe zone by distance/time with directions, list of alternates
- **Volunteers** — registration form (name, phone, skill/role) to join the responder network
- **Preparedness** — earthquake-readiness checklist with progress tracker, before/during/after guidance, quick tips
- **Language Selection** — Urdu / Pashto toggle
- **Responsive design** — full desktop sidebar layout + mobile bottom-nav layout (already designed)

### Out of Scope (for hackathon / v1)
- Real-time push notifications / SMS alerts
- Verified government/NDMA data integration
- Offline-first functionality (PWA caching) — noted as a fast-follow
- Payment or monetization features
- Native mobile apps (web-responsive only)
- Automated seismic sensor integration

---

## 6. Key User Stories

- *As a resident,* I want to tap "I'm Safe" after a tremor so my family isn't worried.
- *As a resident,* I want to report a damaged building in two taps so others avoid it.
- *As a family member outside Balakot,* I want to see my relatives' safety status without calling anyone.
- *As a volunteer,* I want to register my skills once so I'm discoverable when needed.
- *As a resident during a crisis,* I want to find the nearest safe zone with walking directions.
- *As a household,* I want a simple checklist so I know what "being prepared" actually means.
- *As a non-Urdu-fluent reader,* I want to switch the interface language to Pashto or Urdu.

---

## 7. Success Metrics (Hackathon Judging Lens)

| Metric | Why it matters |
|---|---|
| Working demo of all 7 core screens (desktop + mobile) | Shows technical completion |
| At least 1 full user flow demoed live (Report Hazard → appears on map → appears in Reports) | Proves the core loop works |
| Clear "no government / no budget" narrative | Matches hackathon constraints directly |
| Judges can articulate the problem back in one sentence | Strength of problem framing |
| Visual polish matching the provided UI | Differentiator vs. other teams |

---

## 8. Constraints

- **One-day build window** — MVP must be achievable by a small team in ~10–14 hours.
- **Zero budget** — every tool, API, and hosting service used must be free-tier.
- **No government reliance** — no dependency on official APIs, NDMA/ERRA data, or municipal infrastructure. All data is community-sourced and community-moderated.
- **Must be responsive** — one codebase, works on both desktop and mobile (as designed).

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| No real user data on demo day | Pre-seed the map/reports with realistic mock data (as shown in the mockups) |
| Crowdsourced reports could be false/malicious | Community-moderator role + simple flag/verify system (post-hackathon) |
| Free-tier backend limits | Firebase Spark plan is generous enough for a demo and early real usage |
| Judges question "who verifies volunteers/doctors" | Be upfront: v1 is self-reported + community flagging; formal verification is a stated roadmap item, not a blocker |

---

## 10. Roadmap (Post-Hackathon, if continued)

1. Add offline caching (PWA) so the app works with no signal after a quake
2. SMS fallback for check-ins (via free-tier Twilio trial or community relay)
3. Community moderator roles to verify hazard reports
4. Partner with local mosques/community centers as physical "safe zone" anchors
5. Expand to neighboring quake-risk towns (Muzaffarabad, Bagh)
