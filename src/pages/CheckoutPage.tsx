import { useState } from 'react'
import CheckoutForm from '../components/CheckoutForm'
import DeliveryMap from '../components/DeliveryMap'
import { buildWhatsAppUrl, buildBuyNowUrl } from '../utils/whatsapp'
import type { CartItem, Customer, DeliveryResult, Product } from '../types'

interface CheckoutPageProps {
  items: CartItem[]
  subtotal: number
  customer: Customer
  onUpdateCustomer: (field: keyof Customer, value: string) => void
  /** If set, this is a Buy Now single-item checkout */
  buyNowProduct?: Product
  onBack: () => void
  onOrderComplete: () => void
}

export default function CheckoutPage({
  items, subtotal, customer, onUpdateCustomer,
  buyNowProduct, onBack, onOrderComplete,
}: CheckoutPageProps) {
  const [delivery, setDelivery] = useState<DeliveryResult | null>(null)
  const [pinnedLocation, setPinnedLocation] = useState<[number, number] | null>(null)

  const isValid =
    customer.name.trim() !== '' &&
    customer.phone.trim() !== '' &&
    customer.address.trim() !== '' &&
    customer.deliveryDate.trim() !== '' &&
    delivery !== null &&
    delivery.zone !== 'unavailable'

  const total = subtotal + (delivery?.fee ?? 0)

  function handleOrder() {
    if (!delivery || !isValid) return

    let url: string
    if (buyNowProduct) {
      url = buildBuyNowUrl({ product: buyNowProduct, quantity: 1 }, customer, delivery, pinnedLocation)
    } else {
      url = buildWhatsAppUrl(items, customer, delivery, pinnedLocation)
    }

    window.open(url, '_blank')
    onOrderComplete()
  }

  const displayItems: CartItem[] = buyNowProduct
    ? [{ product: buyNowProduct, quantity: 1 }]
    : items

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 pb-40">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 bg-white text-primary font-bold text-sm mb-4 px-4 py-2 rounded-full shadow min-h-[44px] border-2 border-primary/20 active:scale-95 transition-all"
      >
        ← Back
      </button>

      <h1 className="font-display text-brown text-3xl mb-6">Checkout 🎀</h1>

      <div className="flex flex-col gap-5">
        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-display text-brown text-xl mb-3">🧾 Order Summary</h2>
          <div className="divide-y divide-gray-100">
            {displayItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center py-2 text-sm">
                <span className="text-brown">{product.name} × {quantity}</span>
                <span className="font-semibold text-primary">RM {(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mt-3 pt-2 border-t border-gray-200">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-brown">RM {subtotal.toFixed(2)}</span>
          </div>
          {delivery && delivery.zone !== 'unavailable' && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Delivery</span>
              <span className="font-bold text-brown">RM {delivery.fee.toFixed(2)}</span>
            </div>
          )}
          {delivery && delivery.zone !== 'unavailable' && (
            <div className="flex justify-between text-base mt-2 pt-2 border-t border-gray-200">
              <span className="font-bold text-brown">Total</span>
              <span className="font-bold text-primary text-lg">RM {total.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Customer form */}
        <CheckoutForm customer={customer} onUpdate={onUpdateCustomer} pinnedLocation={pinnedLocation} />

        {/* Delivery map */}
        <DeliveryMap onDeliveryChange={setDelivery} onLocationChange={setPinnedLocation} />
      </div>

      {/* Sticky order button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg" style={{ zIndex: 1000 }}>
        <div className="max-w-2xl mx-auto">
          {!isValid && (
            <p className="text-xs text-gray-400 text-center mb-2">
              {!delivery
                ? '👆 Pin your location on the map above'
                : delivery.zone === 'unavailable'
                  ? '⚠️ Delivery not available in your area'
                  : '📝 Please fill in your name, phone, address & delivery date'}
            </p>
          )}
          <button
            onClick={handleOrder}
            disabled={!isValid}
            className={`
              w-full font-display text-lg py-4 rounded-2xl min-h-[44px] transition-all flex items-center justify-center gap-2
              ${isValid
                ? 'text-white shadow-md active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            style={isValid ? { backgroundColor: '#25D366' } : {}}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
            Order via WhatsApp
          </button>
        </div>
      </div>
    </main>
  )
}
