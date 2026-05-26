import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import Doodles from '../components/Doodles'
import Footer from '../components/Footer'
import { PRODUCTS, CATEGORIES } from '../data/products'
import type { CategoryFilter } from '../data/products'
import type { Product } from '../types'

import type { SelectedOptionGroup } from '../types'

interface HomeProps {
  onAddToCart: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void
  onBuyNow: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  All: '✨', cake: '🎂', bread: '🍞', pastry: '🥐', cookies: '🍪', traditional: '🍚',
}

const CATEGORY_COLOR: Record<string, { active: string; inactive: string }> = {
  All:     { active: 'bg-primary text-white',          inactive: 'bg-white text-primary border-2 border-primary/30'         },
  cake:    { active: 'bg-pink text-white',             inactive: 'bg-white text-pink border-2 border-pink/30'               },
  bread:   { active: 'bg-amber-500 text-white',        inactive: 'bg-white text-amber-500 border-2 border-amber-300'        },
  pastry:  { active: 'bg-accent text-white',           inactive: 'bg-white text-accent border-2 border-accent/30'           },
  cookies:     { active: 'bg-purple-500 text-white',       inactive: 'bg-white text-purple-500 border-2 border-purple-300'      },
  traditional: { active: 'bg-green-600 text-white',        inactive: 'bg-white text-green-600 border-2 border-green-300'         },
}

export default function Home({ onAddToCart, onBuyNow }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const featured = PRODUCTS.filter(p => p.featured)
  const filtered  = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div className="relative">
      <Doodles />

      <main className="relative z-10 max-w-5xl mx-auto">

        {/* ── Hero Banner ─────────────────────────────── */}
        <section
          className="relative px-6 py-8 sm:py-10 text-center overflow-hidden sm:rounded-3xl sm:mx-4 sm:mt-4"
          style={{ backgroundImage: "url('/tokma-bakery/images/hero-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Subtle dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-white/20" />

          <div className="relative z-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              🏠 Homemade · Kajang
            </span>
            <h1 className="font-display text-brown text-4xl sm:text-5xl leading-tight mb-3 drop-shadow-sm">
              Freshly Baked<br />
              <span className="text-primary">with ❤️ Love</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
              Homemade goodies delivered to your door. Order via WhatsApp — easy & fast!
            </p>

            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {[
                { label: '🚗 Kajang delivery',  bg: '#FFDDC1', color: '#C1440E' },
                { label: '📲 WhatsApp order',   bg: '#E0D4F7', color: '#6B3FA0' },
                { label: '❤️ Made fresh daily', bg: '#FFD6E7', color: '#C2185B' },
              ].map(badge => (
                <span key={badge.label} className="text-xs font-bold px-4 py-2 rounded-full shadow-sm" style={{ backgroundColor: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="px-4 py-6">

          {/* ── Seasonal Specials ────────────────────────── */}
          {featured.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-2xl">🌟</span>
                <h2 className="font-display text-brown text-2xl tracking-wide">
                  Explore Our <span className="text-primary">Seasonal Specials</span>
                </h2>
                <span className="text-2xl">🌟</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Category filter ──────────────────────────── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm capitalize min-h-[44px] leading-none transition-all duration-200 shadow-sm
                  ${activeCategory === cat
                    ? `${CATEGORY_COLOR[cat]?.active ?? 'bg-primary text-white'} shadow-md`
                    : `${CATEGORY_COLOR[cat]?.inactive ?? 'bg-white text-brown border-2 border-gray-200'} active:scale-95`
                  }
                `}
              >
                <span>{CATEGORY_EMOJI[cat] ?? ''}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* ── Product grid ─────────────────────────────── */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No items in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          )}

          {/* ── Footer ───────────────────────────────────── */}
          <div className="text-center mt-8 mb-4">
            <div className="inline-block bg-primary text-white font-display text-lg px-8 py-3 rounded-full shadow-lg rotate-[-1deg]">
              🎉 HAPPINESS DELIVERED!
            </div>
          </div>
          <Footer />

        </div>
      </main>

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      )}
    </div>
  )
}
