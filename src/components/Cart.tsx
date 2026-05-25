import type { CartItem } from '../types'

interface CartProps {
  items: CartItem[]
  subtotal: number
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onClose: () => void
}

export default function Cart({
  items, subtotal,
  onIncrement, onDecrement, onRemove,
  onCheckout, onClose,
}: CartProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40" onClick={onClose}>
      {/* Drawer panel */}
      <div
        className="mt-auto bg-cream rounded-t-3xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
          <h2 className="font-display text-brown text-xl">🛒 Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto flex-1 px-4 py-2 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🍽️</p>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 py-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-secondary/20 flex-shrink-0"
                  onError={e => {
                    e.currentTarget.src = `https://placehold.co/56x56/FFD93D/5C3D2E?text=🍞`
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brown text-sm truncate">{product.name}</p>
                  <p className="text-primary text-sm font-bold">RM {product.price.toFixed(2)}</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDecrement(product.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 text-brown font-bold flex items-center justify-center active:scale-90 transition-transform"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-brown">{quantity}</span>
                  <button
                    onClick={() => onIncrement(product.id)}
                    className="w-8 h-8 rounded-full bg-secondary text-brown font-bold flex items-center justify-center active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemove(product.id)}
                  className="text-red-400 text-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={`Remove ${product.name}`}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200 bg-white rounded-b-3xl">
            <div className="flex justify-between text-brown font-bold text-base mb-3">
              <span>Subtotal</span>
              <span className="text-primary">RM {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-primary text-white font-display text-lg py-3.5 rounded-2xl min-h-[44px] active:scale-95 transition-transform shadow-md"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
