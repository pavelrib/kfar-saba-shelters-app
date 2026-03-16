# Shelters Map — Design Document
**Date:** 2026-03-16
**Scope:** Kfar Saba public shelter finder — web app for Android and Mac

---

## Overview

A React + Vite Progressive Web App (PWA) that shows the nearest emergency shelters to the user's current GPS location. All shelter data is static, pre-geocoded, and bundled as a JSON file. No backend required.

---

## Data Sources

Three Excel files provided by the city of Kfar Saba:

| File | Sheet | Content | Records |
|------|-------|---------|---------|
| `1649079120.3396.xlsx` | מקלטים | Shelters with accessibility info | ~64 |
| `1773318192.1368.xlsx` | גנ"י פתוחים | Kindergartens open as protected spaces | ~168 |
| `1773571225.7082.xlsx` | GIS | Parks with nearby shelter references | ~37 |

### Data Model

Each record in `public/shelters.json`:

```json
{
  "id": "string",
  "type": "shelter | kindergarten | park",
  "subtype": "underground | above_ground | security_room | null",
  "name": "string (Hebrew)",
  "address": "string (Hebrew)",
  "lat": 32.1234,
  "lng": 34.9078,
  "accessibility": {
    "handicap_parking": true,
    "accessible_entrance": true,
    "handicap_facilities": true,
    "blind_markings": true
  }
}
```

---

## Data Pipeline (One-Time, Run Locally)

A Node.js script at `scripts/geocode.js`:

1. Reads all three Excel files using `xlsx` library
2. Merges and deduplicates records
3. Appends "כפר סבא, ישראל" to each Hebrew address
4. Calls the Google Maps Geocoding API to resolve lat/lng
5. Outputs `public/shelters.json`

Re-run this script whenever the source data changes, then redeploy.

---

## Architecture

**Fully static PWA — no backend.**

```
Browser (Android / Mac)
    ↓
Vercel CDN (static files)
    ├── index.html + React bundle
    ├── public/shelters.json  (pre-geocoded, ~250 records)
    └── service worker (offline cache)
         ↓
Google Maps JavaScript API (map tiles + rendering)
         ↓
Browser Geolocation API (user GPS)
```

Distance calculation: Haversine formula, client-side.

---

## UI/UX

**Main screen:**
- Full-screen Google Map centered on Kfar Saba
- On load: request GPS location, place "you are here" marker
- All shelters rendered as map markers with 3 distinct icons by type:
  - Shield icon → shelters (מקלטים)
  - Building icon → kindergartens (גני ילדים)
  - Tree icon → parks (גינות)
- Bottom panel: 5 nearest shelters sorted by distance (meters)

**Tap marker or list item:**
- Info card showing: name, address, type, subtype, distance, accessibility details

**GPS denied:**
- Map defaults to Kfar Saba city center
- Nearest list hidden; prompt shown to enable location

**Language:** Hebrew, RTL layout throughout.

---

## Project Structure

```
shelters_map/
├── public/
│   └── shelters.json          # pre-geocoded shelter data
├── scripts/
│   └── geocode.js             # one-time data pipeline
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Map.jsx            # Google Map with markers
│   │   ├── ShelterList.jsx    # bottom panel — nearest 5
│   │   └── InfoCard.jsx       # tap-to-open detail card
│   └── main.jsx
├── vite.config.js             # PWA plugin config
└── index.html
```

---

## PWA & Deployment

- **Installable** on Android (Add to Home Screen) and Mac (Chrome/Safari)
- **Offline support** via service worker: caches app shell + `shelters.json`
- **Hosting:** Vercel — auto-deploys on push to `main`
- **Google Maps API key:** stored as Vercel environment variable `VITE_GOOGLE_MAPS_API_KEY`
- Key restricted to the production domain in Google Cloud Console

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React 18 + Vite |
| PWA | `vite-plugin-pwa` |
| Map | `@react-google-maps/api` |
| Geocoding (script) | `@googlemaps/google-maps-services-js` |
| Excel parsing (script) | `xlsx` |
| Hosting | Vercel |
