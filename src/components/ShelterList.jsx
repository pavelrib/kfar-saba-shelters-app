import { MARKER_COLORS } from '../constants.js'

function formatDistance(meters) {
  const m = Math.round(meters)
  if (m < 1000) return `${m} מ׳`
  return `${(m / 1000).toFixed(1)} ק"מ`
}

const TYPE_EMOJI = { shelter: '🛡️', kindergarten: '🏫', park: '🌳' }

export function ShelterList({ shelters, onSelect, selectedId }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, right: 0, left: 0,
      height: 'var(--panel-height)',
      background: '#fff',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.12)',
      overflowX: 'auto', overflowY: 'hidden',
      display: 'flex', alignItems: 'stretch',
      padding: '12px 8px',
      gap: 8,
      zIndex: 5,
    }}>
      {shelters.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          style={{
            minWidth: 140, maxWidth: 160,
            flex: '0 0 auto',
            background: selectedId === s.id ? '#e8f0fe' : '#f8f9fa',
            border: `2px solid ${selectedId === s.id ? MARKER_COLORS[s.type] : '#e0e0e0'}`,
            borderRadius: 10, padding: '10px 12px',
            cursor: 'pointer', textAlign: 'right',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <div style={{ fontSize: 20 }}>{TYPE_EMOJI[s.type]}</div>
          <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{s.address}</div>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: MARKER_COLORS[s.type], marginTop: 'auto',
          }}>
            {formatDistance(s.distanceMeters)}
          </div>
        </button>
      ))}
    </div>
  )
}
