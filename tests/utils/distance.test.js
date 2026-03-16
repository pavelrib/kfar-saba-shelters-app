import { describe, it, expect } from 'vitest'
import { haversineMeters } from '../../src/utils/distance.js'

describe('haversineMeters', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineMeters(32.1748, 34.9078, 32.1748, 34.9078)).toBe(0)
  })

  it('computes ~111 km per degree latitude', () => {
    const meters = haversineMeters(0, 0, 1, 0)
    expect(meters).toBeGreaterThan(110_000)
    expect(meters).toBeLessThan(112_000)
  })

  it('returns a positive value for two different Kfar Saba points', () => {
    const d = haversineMeters(32.1748, 34.9078, 32.1800, 34.9100)
    expect(d).toBeGreaterThan(500)
    expect(d).toBeLessThan(1000)
  })

  it('is symmetric', () => {
    const d1 = haversineMeters(32.1748, 34.9078, 32.18, 34.91)
    const d2 = haversineMeters(32.18, 34.91, 32.1748, 34.9078)
    expect(d1).toBeCloseTo(d2, 0)
  })
})
