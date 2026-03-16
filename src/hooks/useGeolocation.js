import { useState, useEffect } from 'react'

/**
 * Returns { position, error, loading }
 * position: { lat, lng } or null
 * error: string or null
 * loading: boolean
 */
export function useGeolocation() {
  const [state, setState] = useState({ position: null, error: null, loading: true })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ position: null, error: 'הדפדפן אינו תומך באיתור מיקום', loading: false })
      return
    }

    const onSuccess = geo => {
      setState({
        position: { lat: geo.coords.latitude, lng: geo.coords.longitude },
        error: null,
        loading: false,
      })
    }

    const onError = err => {
      setState({
        position: null,
        error: err.code === 1 ? 'גישה למיקום נדחתה' : 'לא ניתן לאתר מיקום',
        loading: false,
      })
    }

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}
