import { MARKER_COLORS } from '../constants.js'

const LEGEND_ITEMS = [
  { type: 'shelter', label: 'מקלט' },
  { type: 'kindergarten', label: 'גן ילדים' },
  { type: 'park', label: 'גינה ציבורית' },
]

export function MapLegend() {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10, zIndex: 10,
      background: 'rgba(255,255,255,0.92)', borderRadius: 8,
      padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', gap: 5,
    }}>
      {LEGEND_ITEMS.map(({ type, label }) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{
            width: 14, height: 14, borderRadius: '50%',
            background: MARKER_COLORS[type], flexShrink: 0,
          }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
