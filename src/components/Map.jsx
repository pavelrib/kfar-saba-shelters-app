import React from 'react'
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
  kindergarten: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  park: 'M12 3L5 14h4v7h6v-7h4z',
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

export function ShelterMap({ shelters, position, onMarkerClick }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  const hasCenteredRef = React.useRef(false)
  const mapRef = React.useRef(null)

  const onLoad = React.useCallback(map => {
    mapRef.current = map
  }, [])

  // Pan to user location only on first GPS fix
  React.useEffect(() => {
    if (position && mapRef.current && !hasCenteredRef.current) {
      mapRef.current.panTo(position)
      mapRef.current.setZoom(15)
      hasCenteredRef.current = true
    }
  }, [position])

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ fontSize: 16, color: '#555' }}>טוען מפה...</span>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      defaultCenter={KFAR_SABA_CENTER}
      defaultZoom={14}
      options={MAP_OPTIONS}
      onLoad={onLoad}
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
