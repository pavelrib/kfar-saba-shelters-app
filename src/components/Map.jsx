import React from 'react'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import { KFAR_SABA_CENTER } from '../constants.js'

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

function shelterIcon(type, subtype) {
  let url
  if (type === 'kindergarten') {
    url = '/icons/kindergarten.png'
  } else if (subtype === 'underground') {
    url = '/icons/shelter-underground.png'
  } else {
    url = '/icons/shelter-above.png'
  }
  return {
    url,
    scaledSize: new window.google.maps.Size(52, 52),
    anchor: new window.google.maps.Point(26, 26),
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
          icon={shelterIcon(s.type, s.subtype)}
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
