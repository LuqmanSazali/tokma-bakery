import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import { GestureHandling } from 'leaflet-gesture-handling'
import config from '../config'
import { BAKER_LOCATION, calculateDelivery } from '../utils/delivery'
import type { DeliveryResult } from '../types'
import type { DeliveryResultWithRoute } from '../utils/delivery'

// Enable gesture handling (use Ctrl+scroll to zoom, prevents page zoom conflict)
L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

// Fix default leaflet marker icons (broken in Vite builds)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const bakerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface DeliveryMapProps {
  onDeliveryChange: (result: DeliveryResult | null) => void
  onLocationChange?: (coords: [number, number] | null) => void
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

type GpsStatus = 'loading' | 'granted' | 'denied' | 'idle'

export default function DeliveryMap({ onDeliveryChange, onLocationChange }: DeliveryMapProps) {
  const [customerPos, setCustomerPos]   = useState<[number, number] | null>(null)
  const [result, setResult]             = useState<DeliveryResult | null>(null)
  const [routeCoords, setRouteCoords]   = useState<[number, number][]>([])
  const [gpsStatus, setGpsStatus]       = useState<GpsStatus>('idle')
  const [calculating, setCalculating]   = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)

  // ── Auto-detect GPS on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return
    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setGpsStatus('granted')
        updateLocation(latitude, longitude)
        // Pan map to customer location
        mapRef.current?.flyTo([latitude, longitude], 15, { duration: 1.5 })
      },
      () => setGpsStatus('denied'),
      { timeout: 8000 },
    )
  }, [])

  async function updateLocation(lat: number, lng: number) {
    setCustomerPos([lat, lng])
    onLocationChange?.([lat, lng])
    setCalculating(true)
    onDeliveryChange(null)
    const delivery: DeliveryResultWithRoute = await calculateDelivery(lat, lng)
    setResult(delivery)
    setRouteCoords(delivery.routeCoords)
    setCalculating(false)
    onDeliveryChange(delivery)
  }

  function handleMapClick(lat: number, lng: number) {
    updateLocation(lat, lng)
  }

  const zoneBg: Record<string, string> = {
    standard:    'bg-accent/20 border-accent text-accent',
    extended:    'bg-secondary/30 border-secondary text-brown',
    unavailable: 'bg-red-100 border-red-400 text-red-600',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 pb-2">
        <h2 className="font-display text-brown text-xl">📍 Delivery Location</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {gpsStatus === 'loading' && '📡 Detecting your location...'}
          {gpsStatus === 'granted' && '✅ Location detected — tap to adjust if needed'}
          {gpsStatus === 'denied'  && '📍 GPS blocked — tap the map to pin your location'}
          {gpsStatus === 'idle'    && 'Tap on the map to pin your location'}
        </p>
      </div>

      {/* GPS loading banner */}
      {gpsStatus === 'loading' && (
        <div className="mx-4 mb-2 bg-secondary/20 text-brown text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2">
          <span className="animate-spin">🌀</span> Getting your GPS location...
        </div>
      )}

      {/* Map */}
      <div className="h-[300px] md:h-[400px] relative" style={{ zIndex: 1 }}>
        <MapContainer
          center={[BAKER_LOCATION.lat, BAKER_LOCATION.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          touchZoom={true}
          scrollWheelZoom={false}
          {...{ gestureHandling: true } as object}
          scrollWheelZoom={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Baker marker */}
          <Marker position={[BAKER_LOCATION.lat, BAKER_LOCATION.lng]} icon={bakerIcon}>
            <Popup>🍞 {config.bakery.name} ({config.bakery.location})</Popup>
          </Marker>
          {/* Road route line */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: '#FF4500',
                weight: 3,
                dashArray: '8, 6',
                opacity: 0.85,
              }}
            />
          )}
          {/* Customer marker */}
          {customerPos && (
            <Marker position={customerPos} draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = (e.target as L.Marker).getLatLng()
                  updateLocation(lat, lng)
                },
              }}
            >
              <Popup>📍 Your location — drag to adjust</Popup>
            </Marker>
          )}
          <ClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>

      {/* Delivery info */}
      <div className="p-4 pt-3">
        {calculating ? (
          <div className="flex items-center justify-center gap-2 text-sm text-brown py-2">
            <span className="animate-spin">🌀</span> Calculating road distance...
          </div>
        ) : result === null ? (
          <p className="text-sm text-gray-400 text-center py-2">
            👆 Tap the map to see delivery fee
          </p>
        ) : result.zone === 'unavailable' ? (
          <div className={`border-2 rounded-xl p-3 text-sm font-semibold ${zoneBg.unavailable}`}>
            ⚠️ Sorry, we don't deliver to this area ({result.distanceKm.toFixed(1)} km away).
            Our service area is within 15 km of Kajang.
          </div>
        ) : (
          <div className={`border-2 rounded-xl p-3 text-sm ${zoneBg[result.zone]}`}>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {result.zone === 'extended' ? '⚠️ Extended zone' : '✅ Within delivery area'}
              </span>
              <span className="font-bold text-base">RM {result.fee.toFixed(2)}</span>
            </div>
            <p className="text-xs mt-1 opacity-75">
              Distance: {result.distanceKm.toFixed(1)} km
              {result.zone === 'extended' && ' · Surcharge applied for distance > 5 km'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
