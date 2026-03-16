import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import { KFAR_SABA_CENTER, MARKER_COLORS } from '../constants.js'

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
}

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
}

// SVG paths for distinct icons per shelter type (Material Design)
const ICON_SVG = {
  shelter: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  kindergarten: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
  park: 'M17 8C8 10 5.9 16.17 3.82 20.58L5.71 21.5c.19-.38.39-.7.58-1.1A10.42 10.42 0 007 21.5c2 0 4.11-.5 6-1.5a11.25 11.25 0 006 1.5c.5 0 1.02-.05 1.5-.14C21.77 18 21 15.22 21 12c0-.71-.05-1.39-.13-2.05A10.57 10.57 0 0017 8z',
}

function shelterIcon(type) {
  const color = MARKER_COLORS[type]
  const svgPath = ICON_SVG[type] || ICON_SVG.shelter
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${color}"/><path d="${svgPath}" fill="white" transform="scale(0.7) translate(5.14, 5.14)"/></svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(36, 36),
    anchor: new window.google.maps.Point(18, 18),
  }
}

function youAreHereIcon() {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: '#1a73e8',
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 3,
    scale: 8,
  }
}

export function Map({ shelters, position, onMarkerClick }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ fontSize: 16, color: '#555' }}>טוען מפה...</span>
      </div>
    )
  }

  const center = position || KFAR_SABA_CENTER

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center}
      zoom={position ? 15 : 14}
      options={MAP_OPTIONS}
    >
      {shelters.map(s => (
        <MarkerF
          key={s.id}
          position={{ lat: s.lat, lng: s.lng }}
          icon={shelterIcon(s.type)}
          title={s.name}
          onClick={() => onMarkerClick(s)}
        />
      ))}

      {position && (
        <MarkerF
          position={position}
          icon={youAreHereIcon()}
          title="המיקום שלך"
          zIndex={1000}
        />
      )}
    </GoogleMap>
  )
}
