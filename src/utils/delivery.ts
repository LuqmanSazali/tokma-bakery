import config from '../config'
import type { DeliveryResult } from '../types'

export const BAKER_LOCATION = config.bakerLocation

// ── Haversine — used as fallback if OSRM fails ────────────────────────────────
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

// ── OSRM road distance + geometry ────────────────────────────────────────────
export interface OsrmResult {
  distanceKm: number
  routeCoords: [number, number][]
}

export async function getRoadRoute(
  customerLat: number,
  customerLng: number,
): Promise<OsrmResult> {
  const { lat, lng } = BAKER_LOCATION
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${lng},${lat};${customerLng},${customerLat}` +
    `?overview=full&geometries=geojson`

  const res  = await fetch(url)
  const data = await res.json()

  if (data.code === 'Ok' && data.routes?.[0]) {
    const route = data.routes[0]
    const routeCoords: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    )
    return { distanceKm: route.distance / 1000, routeCoords }
  }
  throw new Error('OSRM failed')
}

// ── Fee calculator ────────────────────────────────────────────────────────────
function calcFee(distanceKm: number): DeliveryResult {
  const { standardMaxKm, extendedMaxKm, ratePerKm, extendedMultiplier, minFee } = config.delivery

  if (distanceKm > extendedMaxKm) {
    return { distanceKm, fee: 0, zone: 'unavailable' }
  }
  if (distanceKm > standardMaxKm) {
    const fee = Math.max(minFee, distanceKm * ratePerKm * extendedMultiplier)
    return { distanceKm, fee: roundFee(fee), zone: 'extended' }
  }
  const fee = Math.max(minFee, distanceKm * ratePerKm)
  return { distanceKm, fee: roundFee(fee), zone: 'standard' }
}

export interface DeliveryResultWithRoute extends DeliveryResult {
  routeCoords: [number, number][]
}

// ── Main delivery calculator ──────────────────────────────────────────────────
export async function calculateDelivery(
  customerLat: number,
  customerLng: number,
): Promise<DeliveryResultWithRoute> {
  try {
    const { distanceKm, routeCoords } = await getRoadRoute(customerLat, customerLng)
    return { ...calcFee(distanceKm), routeCoords }
  } catch {
    const fallbackKm = haversineKm(
      BAKER_LOCATION.lat, BAKER_LOCATION.lng,
      customerLat, customerLng,
    )
    return {
      ...calcFee(fallbackKm),
      routeCoords: [
        [BAKER_LOCATION.lat, BAKER_LOCATION.lng],
        [customerLat, customerLng],
      ],
    }
  }
}

function roundFee(fee: number): number {
  return Math.ceil(fee * 2) / 2
}
