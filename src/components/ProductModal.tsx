import { useState, useEffect } from 'react'
import type { Product, SelectedOptionGroup } from '../types'
import { calcItemPrice } from '../utils/product'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void
  onBuyNow: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void
}

const CATEGORY_STYLE: Record<string, { pill: string; price: string; btn: string }> = {
  cake:        { pill: 'bg-purple-500 text-white', price: 'bg-purple-500 text-white', btn: 'bg-purple-800 text-white' },
  bread:       { pill: 'bg-amber-500 text-white',  price: 'bg-amber-500 text-white',  btn: 'bg-amber-800 text-white'  },
  pastry:      { pill: 'bg-yellow-400 text-brown', price: 'bg-yellow-400 text-brown', btn: 'bg-yellow-600 text-white' },
  cookies:     { pill: 'bg-red-500 text-white',    price: 'bg-red-500 text-white',    btn: 'bg-red-800 text-white'    },
  traditional: { pill: 'bg-green-600 text-white',  price: 'bg-green-600 text-white',  btn: 'bg-green-800 text-white'  },
}

const CATEGORY_EMOJI: Record<string, string> = {
  cake: '🎂', bread: '🍞', pastry: '🥐', cookies: '🍪', traditional: '🍚',
}

const CATEGORY_LABEL: Record<string, string> = {
  cake: 'Cakes', bread: 'Breads', pastry: 'Pastries', cookies: 'Cookies', traditional: 'Traditional',
}

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  const [imgIndex, setImgIndex] = useState(0)
  // selectedOptions: { [groupName]: string[] }
  const [selections, setSelections] = useState<Record<string, string[]>>({})

  const style = CATEGORY_STYLE[product.category] ?? { pill: 'bg-primary text-white', price: 'bg-primary text-white', btn: 'bg-brown text-white' }
  const emoji = CATEGORY_EMOJI[product.category] ?? '🍽️'
  const label = CATEGORY_LABEL[product.category] ?? product.category
  const hasMultiple = product.images.length > 1
  const isUnavailable = product.status === 'coming_soon' || product.status === 'out_of_stock'

  // Build SelectedOptionGroup[] from selections state
  function buildSelectedOptions(): SelectedOptionGroup[] | undefined {
    const result = Object.entries(selections)
      .filter(([, items]) => items.length > 0)
      .map(([name, items]) => ({ name, items }))
    return result.length > 0 ? result : undefined
  }

  // Calculate live price with selected add-ons
  const selectedOptions = buildSelectedOptions()
  const livePrice = calcItemPrice(product, selectedOptions)

  // Check all required/min groups are satisfied
  const requiredUnmet = product.options?.some(g => {
    const count = selections[g.name]?.length ?? 0
    if (g.min !== undefined) return count < g.min
    if (g.required) return count === 0
    return false
  }) ?? false

  function toggleItem(groupName: string, label: string, multiple: boolean, max?: number) {
    setSelections(prev => {
      const current = prev[groupName] ?? []
      if (multiple) {
        if (current.includes(label)) {
          return { ...prev, [groupName]: current.filter(x => x !== label) }
        }
        if (max !== undefined && current.length >= max) return prev  // at limit, ignore
        return { ...prev, [groupName]: [...current, label] }
      } else {
        return { ...prev, [groupName]: current[0] === label ? [] : [label] }
      }
    })
  }

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

  function formatPrice(): string {
    if (product.price === 0) return 'Contact'
    if (livePrice !== product.price) return `RM ${livePrice.toFixed(2)}`
    return `RM ${product.price.toFixed(2)}`
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up max-h-[90vh] flex flex-col"
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
        <div className="relative aspect-[4/3] bg-cream overflow-hidden flex-shrink-0">
          <img
            key={imgIndex}
            src={product.images[imgIndex]}
            alt={`${product.name} photo ${imgIndex + 1}`}
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.src = `https://placehold.co/400x300/E5E7EB/9CA3AF?text=No+Image`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Status overlay */}
          {isUnavailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-brown font-display text-lg px-5 py-2 rounded-full shadow-lg">
                {product.status === 'coming_soon' ? '🔜 Coming Soon' : '❌ Out of Stock'}
              </span>
            </div>
          )}

          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 ${style.pill} font-display text-sm px-3 py-1.5 rounded-full shadow-md`}>
              <span className="text-base">{emoji}</span>
              <span>{label}</span>
            </span>
          </div>

          {/* Limited Edition ribbon */}
          {product.limitedEdition && (
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden z-10 pointer-events-none">
              <div className="absolute bg-red-500 text-white text-[10px] font-black tracking-widest py-1 w-32 text-center shadow-md"
                style={{ top: '18px', right: '-22px', transform: 'rotate(45deg)' }}>
                LIMITED
              </div>
            </div>
          )}

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

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-5">
          <h2 className="font-display text-brown text-2xl leading-tight mb-2">{product.name}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>

          {/* Generic option groups */}
          {product.options?.map(group => (
            <div key={group.name} className="mb-4">
              <p className="text-sm font-semibold text-brown mb-2">
                {group.name}
                <span className="text-gray-400 font-normal ml-1">
                  {group.multiple
                    ? (() => {
                        const count = selections[group.name]?.length ?? 0
                        const min = group.min, max = group.max
                        if (min && max && min === max) return `(pick exactly ${min} · ${count}/${min} chosen)`
                        if (min && max) return `(pick ${min}–${max} · ${count} chosen)`
                        if (min) return `(pick at least ${min} · ${count}/${min} chosen)`
                        if (max) return `(pick up to ${max}${count > 0 ? ` · ${count}/${max} chosen` : ''})`
                        return '(multiple)'
                      })()
                    : '(pick one)'}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map(item => {
                  const selected = (selections[group.name] ?? []).includes(item.label)
                  const atMax = group.max !== undefined && (selections[group.name]?.length ?? 0) >= group.max && !selected
                  return (
                    <button
                      key={item.label}
                      onClick={() => toggleItem(group.name, item.label, group.multiple ?? false, group.max)}
                      disabled={atMax}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-1 ${
                        selected
                          ? 'bg-primary text-white border-primary active:scale-95'
                          : atMax
                            ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-white text-brown border-gray-200 hover:border-primary active:scale-95'
                      }`}
                    >
                      {item.label}
                      {item.price != null && (
                        <span className={`${selected ? 'text-white/80' : 'text-primary'} font-normal`}>
                          +RM {item.price.toFixed(2)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Price + Buttons */}
          {requiredUnmet && (
            <p className="text-xs text-red-400 font-semibold mt-2 mb-1">
              ⚠️ Please select an option before proceeding
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className={`${style.price} font-display text-xl px-4 py-2.5 rounded-full shadow-md whitespace-nowrap flex-shrink-0`}>
              {formatPrice()}
            </span>
            {!isUnavailable ? (
              <>
                <button
                  onClick={() => { onAddToCart(product, buildSelectedOptions()); onClose() }}
                  disabled={requiredUnmet}
                  className={`flex-1 border-2 font-bold text-sm py-3 rounded-full min-h-[44px] transition-all ${requiredUnmet ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-secondary hover:bg-secondary/20 text-brown active:scale-95'}`}
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => { onBuyNow(product, buildSelectedOptions()); onClose() }}
                  disabled={requiredUnmet}
                  className={`flex-1 font-bold text-sm py-3 rounded-full min-h-[44px] transition-all shadow ${requiredUnmet ? 'bg-gray-200 text-gray-300 cursor-not-allowed' : `${style.btn} active:scale-95`}`}
                >
                  🛍️ Buy Now
                </button>
              </>
            ) : (
              <div className="flex-1 text-center text-sm text-gray-400 font-semibold py-3">
                {product.status === 'coming_soon' ? 'Available soon — check back later!' : 'Currently unavailable'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
