import { useState } from 'react'
import type { Customer } from '../types'
import config from '../config'

interface CheckoutFormProps {
  customer: Customer
  onUpdate: (field: keyof Customer, value: string) => void
  /** Customer's pinned map coordinates for reverse geocoding */
  pinnedLocation?: [number, number] | null
}

export default function CheckoutForm({ customer, onUpdate, pinnedLocation }: CheckoutFormProps) {
  const [geocoding, setGeocoding] = useState(false)

  async function fillAddressFromPin() {
    const coords = pinnedLocation
    if (!coords) return

    setGeocoding(true)
    try {
      const [lat, lng] = coords
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } },
      )
      const data = await res.json()
      if (data.display_name) {
        onUpdate('address', data.display_name)
      }
    } catch {
      // silently fail — user can type manually
    } finally {
      setGeocoding(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
      <h2 className="font-display text-brown text-xl">👤 Your Info</h2>
      <p className="text-xs text-gray-400">Saved automatically for next time.</p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-brown">Full Name *</span>
        <input
          type="text"
          value={customer.name}
          onChange={e => onUpdate('name', e.target.value)}
          placeholder="e.g. Siti Aminah"
          className="border-2 border-gray-200 focus:border-primary rounded-xl px-3 py-2.5 text-sm outline-none transition-colors min-h-[44px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-brown">Phone Number *</span>
        <input
          type="tel"
          value={customer.phone}
          onChange={e => onUpdate('phone', e.target.value)}
          placeholder="e.g. 011-12345678"
          className="border-2 border-gray-200 focus:border-primary rounded-xl px-3 py-2.5 text-sm outline-none transition-colors min-h-[44px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-brown">Delivery Date *</span>
        <input
          type="date"
          value={customer.deliveryDate}
          onChange={e => onUpdate('deliveryDate', e.target.value)}
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          max={(() => {
            const d = new Date()
            d.setMonth(d.getMonth() + config.delivery.maxBookingMonths)
            return d.toISOString().split('T')[0]
          })()}
          className="border-2 border-gray-200 focus:border-primary rounded-xl px-3 py-2.5 text-sm outline-none transition-colors min-h-[44px]"
        />
      </label>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-brown">Delivery Address *</span>
          {/* Pin button — fills address from map pin */}
          <button
            type="button"
            onClick={fillAddressFromPin}
            disabled={!pinnedLocation || geocoding}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all min-h-[36px] ${
              pinnedLocation
                ? 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            title={pinnedLocation ? 'Fill address from map pin' : 'Pin your location on the map first'}
          >
            {geocoding ? (
              <span className="animate-spin">🌀</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            )}
            {geocoding ? 'Getting address...' : 'Use pin location'}
          </button>
        </div>
        <textarea
          value={customer.address}
          onChange={e => onUpdate('address', e.target.value)}
          placeholder={pinnedLocation ? 'Tap "Use pin location" or type manually' : 'Pin your location on the map below, or type here'}
          rows={3}
          className="border-2 border-gray-200 focus:border-primary rounded-xl px-3 py-2.5 text-sm outline-none transition-colors resize-none"
        />
      </div>
    </div>
  )
}
