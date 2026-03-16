import { useState, useEffect } from 'react'
import { useGeolocation } from './hooks/useGeolocation.js'
import { getNearestShelters } from './utils/nearest.js'
import { Map } from './components/Map.jsx'
import { ShelterList } from './components/ShelterList.jsx'
import { InfoCard } from './components/InfoCard.jsx'
import { GpsPrompt } from './components/GpsPrompt.jsx'
import { NEAREST_COUNT } from './constants.js'

export default function App() {
  const [allShelters, setAllShelters] = useState([])
  const [dataError, setDataError] = useState(null)
  const [selected, setSelected] = useState(null)
  const { position, error: gpsError } = useGeolocation()

  useEffect(() => {
    fetch('/shelters.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => { if (!data.length) throw new Error('הקובץ ריק'); setAllShelters(data) })
      .catch(err => { console.error('Failed to load shelters:', err); setDataError('לא ניתן לטעון את נתוני המקלטים') })
  }, [])

  const nearest = position
    ? getNearestShelters(allShelters, position, NEAREST_COUNT)
    : []

  const handleSelect = shelter => setSelected(shelter)
  const handleClose = () => setSelected(null)

  if (dataError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#c62828', fontSize: 16 }}>{dataError}</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 'var(--panel-height)' }}>
        <Map
          shelters={allShelters}
          position={position}
          onMarkerClick={handleSelect}
        />
      </div>

      {gpsError && <GpsPrompt message={gpsError} />}

      {selected && (
        <InfoCard shelter={selected} onClose={handleClose} />
      )}

      {nearest.length > 0 && (
        <ShelterList
          shelters={nearest}
          onSelect={handleSelect}
          selectedId={selected?.id}
        />
      )}
    </div>
  )
}
