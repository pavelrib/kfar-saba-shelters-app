import { SHELTER_TYPES, SHELTER_SUBTYPES } from '../constants.js'

function formatDistance(meters) {
  if (meters === undefined || meters === null) return ''
  if (meters < 1000) return `${meters} מ׳`
  return `${(meters / 1000).toFixed(1)} ק"מ`
}

function AccessibilityRow({ label, value }) {
  if (value === null || value === undefined) return null
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
      <span>{value ? '✅' : '❌'}</span>
      <span>{label}</span>
    </div>
  )
}

export function InfoCard({ shelter, onClose }) {
  if (!shelter) return null

  return (
    <div style={{
      position: 'absolute', bottom: 'calc(var(--panel-height) + 10px)', right: 12, left: 12, zIndex: 20,
      background: '#fff', borderRadius: 12, padding: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', maxWidth: 400, margin: '0 auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{shelter.name}</div>
          <div style={{ color: '#555', fontSize: 14, marginTop: 2 }}>{shelter.address}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}
          aria-label="סגור"
        >×</button>
      </div>

      <img
        src={`https://maps.googleapis.com/maps/api/streetview?size=600x200&location=${shelter.lat},${shelter.lng}&fov=90&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
        alt={shelter.address}
        style={{ width: '100%', borderRadius: 8, marginTop: 10, display: 'block' }}
        onError={e => { e.target.style.display = 'none' }}
      />

      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          background: '#e8f0fe', color: '#1a73e8',
          borderRadius: 12, padding: '2px 10px', fontSize: 13,
        }}>
          {SHELTER_TYPES[shelter.type]}
        </span>
        {shelter.subtype && (
          <span style={{
            background: '#f5f5f5', color: '#333',
            borderRadius: 12, padding: '2px 10px', fontSize: 13,
          }}>
            {SHELTER_SUBTYPES[shelter.subtype]}
          </span>
        )}
        {shelter.distanceMeters !== undefined && (
          <span style={{
            background: '#e6f4ea', color: '#2e7d32',
            borderRadius: 12, padding: '2px 10px', fontSize: 13,
          }}>
            {formatDistance(shelter.distanceMeters)}
          </span>
        )}
      </div>

      {shelter.accessibility && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AccessibilityRow label="חניית נכים" value={shelter.accessibility.handicap_parking} />
          <AccessibilityRow label="כניסה נגישה" value={shelter.accessibility.accessible_entrance} />
          <AccessibilityRow label="שירותי נכים" value={shelter.accessibility.handicap_facilities} />
          <AccessibilityRow label="סימונים לעיוורים" value={shelter.accessibility.blind_markings} />
        </div>
      )}

      {shelter.nearbyShelterAddress && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
          מקלט סמוך: {shelter.nearbyShelterAddress}
        </div>
      )}

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block', marginTop: 14,
          background: '#1a73e8', color: '#fff',
          borderRadius: 8, padding: '10px 0',
          textAlign: 'center', fontWeight: 600, fontSize: 15,
          textDecoration: 'none',
        }}
      >
        🧭 נווט למקלט
      </a>
    </div>
  )
}
