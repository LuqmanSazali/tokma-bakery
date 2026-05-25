import { useState, useEffect } from 'react'
import type { Product } from '../types'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}

const CATEGORY_STYLE: Record<string, { pill: string; price: string; btn: string }> = {
  cake:    { pill: 'bg-purple-500 text-white', price: 'bg-purple-500 text-white', btn: 'bg-purple-800 text-white' },
  bread:   { pill: 'bg-amber-500 text-white',  price: 'bg-amber-500 text-white',  btn: 'bg-amber-800 text-white'  },
  pastry:  { pill: 'bg-yellow-400 text-brown', price: 'bg-yellow-400 text-brown', btn: 'bg-yellow-600 text-white' },
  cookies: { pill: 'bg-red-500 text-white',    price: 'bg-red-500 text-white',    btn: 'bg-red-800 text-white'    },
}

const CATEGORY_EMOJI: Record<string, string> = {
  cake: '🎂', bread: '🍞', pastry: '🥐', cookies: '🍪',
}

const CATEGORY_LABEL: Record<string, string> = {
  cake: 'Cakes', bread: 'Breads', pastry: 'Pastries', cookies: 'Cookies',
}

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const style = CATEGORY_STYLE[product.category] ?? { pill: 'bg-primary text-white', price: 'bg-primary text-white', btn: 'bg-brown text-white' }
  const emoji = CATEGORY_EMOJI[product.category] ?? '🍽️'
  const label = CATEGORY_LABEL[product.category] ?? product.category
  const hasMultiple = product.images.length > 1

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg leading-none"
        >
          ×
        </button>

        {/* Image gallery */}
        <div className="relative aspect-[4/3] bg-cream overflow-hidden">
          <img
            key={imgIndex}
            src={product.images[imgIndex]}
            alt={`${product.name} photo ${imgIndex + 1}`}
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.src = `https://placehold.co/400x300/FFC800/3B1F0F?text=${encodeURIComponent(emoji + ' ' + product.name)}`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 ${style.pill} font-display text-sm px-3 py-1.5 rounded-full shadow-md`}>
              <span className="text-base">{emoji}</span>
              <span>{label}</span>
            </span>
            {product.limitedEdition && (
              <span className="ml-1.5 inline-flex items-center bg-accent text-white text-xs font-black px-2 py-1 rounded-full shadow">
                ⭐ Limited
              </span>
            )}
          </div>

          {/* Prev/Next arrows */}
          {hasMultiple && (
            <>
              <button onClick={() => setImgIndex(i => (i - 1 + product.images.length) % product.images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl">‹</button>
              <button onClick={() => setImgIndex(i => (i + 1) % product.images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl">›</button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {product.images.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`rounded-full transition-all ${i === imgIndex ? 'bg-white w-4 h-2' : 'bg-white/50 w-2 h-2'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-5">
          <h2 className="font-display text-brown text-2xl leading-tight mb-2">{product.name}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>

          {/* Price + Buttons */}
          <div className="flex items-center gap-2">
            <span className={`${style.price} font-display text-xl px-4 py-2.5 rounded-full shadow-md whitespace-nowrap flex-shrink-0`}>
              RM {product.price.toFixed(2)}
            </span>
            <button
              onClick={() => { onAddToCart(product); onClose() }}
              className="flex-1 bg-white border-2 border-gray-200 hover:border-secondary hover:bg-secondary/20 text-brown font-bold text-sm py-3 rounded-full min-h-[44px] active:scale-95 transition-all"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => { onBuyNow(product); onClose() }}
              className={`flex-1 ${style.btn} font-bold text-sm py-3 rounded-full min-h-[44px] active:scale-95 transition-all shadow`}
            >
              🛍️ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
