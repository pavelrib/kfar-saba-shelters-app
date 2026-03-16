import { haversineMeters } from './distance.js'

export function getNearestShelters(shelters, position, n) {
  return shelters
    .filter(s => s.lat !== null && s.lng !== null)
    .map(s => ({
      ...s,
      distanceMeters: Math.round(haversineMeters(position.lat, position.lng, s.lat, s.lng)),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, n)
}
