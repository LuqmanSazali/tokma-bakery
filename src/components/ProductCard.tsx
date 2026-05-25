import { useState } from 'react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
  onViewDetails: (product: Product) => void
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

export default function ProductCard({ product, onAddToCart, onBuyNow, onViewDetails }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const style = CATEGORY_STYLE[product.category] ?? { pill: 'bg-primary text-white', price: 'bg-primary text-white', btn: 'bg-brown text-white' }
  const emoji = CATEGORY_EMOJI[product.category] ?? '🍽️'
  const label = CATEGORY_LABEL[product.category] ?? product.category
  const hasMultiple = product.images.length > 1

  function nextImage(e: React.MouseEvent) {
    e.stopPropagation()
    setImgIndex(i => (i + 1) % product.images.length)
  }
  function prevImage(e: React.MouseEvent) {
    e.stopPropagation()
    setImgIndex(i => (i - 1 + product.images.length) % product.images.length)
  }

  return (
    <div
      className="group relative bg-white/95 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] shadow-lg cursor-pointer"
      onClick={() => onViewDetails(product)}
    >

      {/* ── Category pill ─────────────────────────── */}
      <div className="absolute top-3 left-3 z-10">
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

      {/* ── Product image ─────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          key={imgIndex}
          src={product.images[imgIndex]}
          alt={`${product.name} photo ${imgIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => {
            e.currentTarget.src = `https://placehold.co/400x300/FFC800/3B1F0F?text=${encodeURIComponent(emoji + ' ' + product.name)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Prev/Next arrows */}
        {hasMultiple && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">‹</button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">›</button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setImgIndex(i) }}
                className={`rounded-full transition-all ${i === imgIndex ? 'bg-white w-4 h-2' : 'bg-white/50 w-2 h-2'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Name & description ─────────────────────── */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-display text-brown text-lg leading-tight">{product.name}</h3>
        <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{product.description}</p>
      </div>

      {/* ── Price + Buttons ────────────────────────── */}
      <div className="flex items-center gap-2 px-3 pb-4 pt-1 mt-auto">
        <span className={`${style.price} font-display text-lg px-4 py-2 rounded-full shadow-md whitespace-nowrap flex-shrink-0`}>
          RM {product.price.toFixed(2)}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onAddToCart(product) }}
          className="flex-1 bg-white border-2 border-gray-200 hover:border-secondary hover:bg-secondary/20 text-brown font-bold text-xs py-2.5 rounded-full min-h-[44px] active:scale-95 transition-all whitespace-nowrap"
        >
          🛒 Add
        </button>
        <button
          onClick={e => { e.stopPropagation(); onBuyNow(product) }}
          className={`flex-1 ${style.btn} font-bold text-xs py-2.5 rounded-full min-h-[44px] active:scale-95 transition-all shadow whitespace-nowrap`}
        >
          ⚡ Buy Now
        </button>
      </div>
    </div>
  )
}
