import { describe, it, expect } from 'vitest'
import { getNearestShelters } from '../../src/utils/nearest.js'

const makeShelter = (id, lat, lng) => ({ id, type: 'shelter', lat, lng, address: 'test' })

const shelters = [
  makeShelter('a', 32.1748, 34.9078),
  makeShelter('b', 32.1800, 34.9100),
  makeShelter('c', 32.1900, 34.9200),
  makeShelter('d', 32.1600, 34.9000),
  makeShelter('e', 32.2000, 34.9300),
  makeShelter('f', 32.1500, 34.8900),
]

const position = { lat: 32.1748, lng: 34.9078 }

describe('getNearestShelters', () => {
  it('returns the requested number of shelters', () => {
    expect(getNearestShelters(shelters, position, 3)).toHaveLength(3)
  })

  it('sorts results by ascending distance', () => {
    const result = getNearestShelters(shelters, position, 5)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].distanceMeters).toBeGreaterThanOrEqual(result[i - 1].distanceMeters)
    }
  })

  it('attaches distanceMeters to each result', () => {
    const result = getNearestShelters(shelters, position, 1)
    expect(result[0].distanceMeters).toBeDefined()
    expect(result[0].distanceMeters).toBeCloseTo(0, 0)
  })

  it('does not mutate the original array', () => {
    const copy = [...shelters]
    getNearestShelters(shelters, position, 3)
    expect(shelters).toEqual(copy)
  })

  it('handles n larger than available shelters', () => {
    expect(getNearestShelters(shelters, position, 100)).toHaveLength(shelters.length)
  })

  it('filters out shelters with null coordinates', () => {
    const withNull = [...shelters, { id: 'null', type: 'shelter', lat: null, lng: null }]
    const result = getNearestShelters(withNull, position, 10)
    expect(result.every(r => r.lat !== null)).toBe(true)
  })
})
