import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'
import { Client } from '@googlemaps/google-maps-services-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Configuration ──────────────────────────────────────────────────────────
// Set these in scripts/.env (copy from scripts/.env.example)
const EXCEL_FILES = {
  shelters: process.env.EXCEL_SHELTERS,
  kindergartens: process.env.EXCEL_KINDERGARTENS,
  parks: process.env.EXCEL_PARKS,
}
const OUTPUT_PATH = path.resolve(__dirname, '../public/shelters.json')
const CITY_SUFFIX = ', כפר סבא, ישראל'
// ───────────────────────────────────────────────────────────────────────────

const client = new Client({})

async function geocodeAddress(address) {
  const fullAddress = address + CITY_SUFFIX
  try {
    const res = await client.geocode({
      params: { address: fullAddress, key: process.env.GOOGLE_MAPS_API_KEY, language: 'he' },
    })
    if (res.data.results.length > 0) {
      const { lat, lng } = res.data.results[0].geometry.location
      return { lat, lng }
    }
    console.warn(`  No result for: ${fullAddress}`)
    return null
  } catch (e) {
    console.error(`  Error geocoding "${fullAddress}":`, e.message)
    return null
  }
}

function normalizeSubtype(hebrewType) {
  const map = {
    'מקלט תת קרקעי': 'underground',
    'מקלט עילי': 'above_ground',
    'מיגונית': 'security_room',
    'מכסה': 'cover',
  }
  return map[hebrewType] || null
}

function parseShelters() {
  const wb = XLSX.readFile(EXCEL_FILES.shelters)
  const ws = wb.Sheets['מקלטים']
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null })
  return rows
    .filter(r => r['כתובת'])
    .map(r => ({
      id: `shelter-${r["מס' מקלט"]}`,
      type: 'shelter',
      subtype: normalizeSubtype(r['סוג מקלט']),
      name: `מקלט ${r["מס' מקלט"]}`,
      address: String(r['כתובת']).trim(),
      accessibility: {
        handicap_parking: r['חניית נכים'] === '+' || r['חניית נכים'] === 'קיים',
        accessible_entrance: r['כניסה נגישה'] === '+' || r['כניסה נגישה'] === 'קיים',
        handicap_facilities: r['שרותי נכים'] === '+' || r['שרותי נכים'] === 'קיים',
        blind_markings: r['סימונים לעיוורים'] === '+' || r['סימונים לעיוורים'] === 'קיים',
      },
    }))
}

function parseKindergartens() {
  const wb = XLSX.readFile(EXCEL_FILES.kindergartens)
  const sheetName = wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  // Row 1 is a title, row 2 is actual headers
  const rows = XLSX.utils.sheet_to_json(ws, { range: 1, defval: null })
  return rows
    .filter(r => r['כתובת הגן'] && r['שם גן'])
    .map((r, i) => ({
      id: `kindergarten-${i + 1}`,
      type: 'kindergarten',
      subtype: null,
      name: String(r['שם גן']).trim(),
      address: String(r['כתובת הגן']).trim(),
      accessibility: null,
    }))
}

function parseParks() {
  const wb = XLSX.readFile(EXCEL_FILES.parks)
  const ws = wb.Sheets['GIS']
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null })
  return rows
    .filter(r => r['כתובת גן'] && r['שם גן'])
    .map((r, i) => ({
      id: `park-${i + 1}`,
      type: 'park',
      subtype: normalizeSubtype(r['סוג מקלט']) || null,
      name: String(r['שם גן']).trim(),
      address: String(r['כתובת גן']).trim(),
      nearbyShelterAddress: r['כתובת מקלט'] ? String(r['כתובת מקלט']).trim() : null,
      accessibility: null,
    }))
}

async function main() {
  const missing = ['GOOGLE_MAPS_API_KEY', 'EXCEL_SHELTERS', 'EXCEL_KINDERGARTENS', 'EXCEL_PARKS']
    .filter(k => !process.env[k])
  if (missing.length > 0) {
    console.error('Missing required env vars in scripts/.env:', missing.join(', '))
    console.error('Copy scripts/.env.example to scripts/.env and fill in values.')
    process.exit(1)
  }
  for (const [key, filePath] of Object.entries(EXCEL_FILES)) {
    if (!fs.existsSync(filePath)) {
      console.error(`Excel file not found for ${key}: ${filePath}`)
      process.exit(1)
    }
  }

  console.log('Parsing Excel files...')
  const shelters = parseShelters()
  const kindergartens = parseKindergartens()
  const parks = parseParks()
  const all = [...shelters, ...kindergartens, ...parks]
  console.log(`  ${shelters.length} shelters, ${kindergartens.length} kindergartens, ${parks.length} parks`)
  console.log(`  Total: ${all.length} records`)

  console.log('\nGeocoding addresses (this may take a minute)...')
  const results = []
  for (const record of all) {
    process.stdout.write(`  [${results.length + 1}/${all.length}] ${record.address}`)
    const coords = await geocodeAddress(record.address)
    if (coords) {
      results.push({ ...record, lat: coords.lat, lng: coords.lng })
      process.stdout.write(' ✓\n')
    } else {
      results.push({ ...record, lat: null, lng: null })
      process.stdout.write(' ✗ (skipped)\n')
    }
    // Respect rate limit
    await new Promise(r => setTimeout(r, 100))
  }

  const valid = results.filter(r => r.lat !== null)
  const skipped = results.filter(r => r.lat === null)
  console.log(`\nGeocoded: ${valid.length} OK, ${skipped.length} failed`)
  if (skipped.length > 0) {
    console.log('Failed addresses:')
    skipped.forEach(r => console.log(`  ${r.id}: ${r.address}`))
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(valid, null, 2), 'utf-8')
  console.log(`\nWrote ${valid.length} records to ${OUTPUT_PATH}`)
}

main().catch(err => { console.error(err); process.exit(1) })
