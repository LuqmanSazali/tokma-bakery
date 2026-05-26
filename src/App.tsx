import { useState } from 'react'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import Home from './pages/Home'
import CheckoutPage from './pages/CheckoutPage'
import { useCart } from './hooks/useCart'
import { useCustomer } from './hooks/useCustomer'
import type { Product, SelectedOptionGroup } from './types'

type Page = 'home' | 'checkout'

export default function App() {
  const cart = useCart()
  const { customer, updateField } = useCustomer()
  const [page, setPage] = useState<Page>('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [buyNowProduct, setBuyNowProduct] = useState<Product | undefined>()
  const [buyNowOptions, setBuyNowOptions] = useState<SelectedOptionGroup[] | undefined>()

  function handleBuyNow(product: Product, selectedOptions?: SelectedOptionGroup[]) {
    setBuyNowProduct(product)
    setBuyNowOptions(selectedOptions)
    setCartOpen(false)
    setPage('checkout')
  }

  function handleCheckout() {
    setBuyNowProduct(undefined)
    setCartOpen(false)
    setPage('checkout')
  }

  function handleOrderComplete() {
    cart.clearCart()
    setBuyNowProduct(undefined)
    setBuyNowOptions(undefined)
    setPage('home')
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FFF5E6' }}>
      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/tokma-bakery/images/pattern.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '600px auto',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* All content above pattern */}
      <div className="relative" style={{ zIndex: 1 }}>
      <Navbar
        totalItems={cart.totalItems}
        onCartClick={() => { if (page !== 'checkout') setCartOpen(true) }}
      />

      {page === 'home' && (
        <Home
          onAddToCart={(p, opts) => cart.addToCart(p, opts)}
          onBuyNow={handleBuyNow}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage
          items={cart.items}
          subtotal={buyNowProduct ? buyNowProduct.price : cart.subtotal}
          customer={customer}
          onUpdateCustomer={updateField}
          buyNowProduct={buyNowProduct}
          buyNowOptions={buyNowOptions}
          onBack={() => setPage('home')}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <Cart
          items={cart.items}
          subtotal={cart.subtotal}
          cartKey={cart.cartKey}
          onIncrement={cart.increment}
          onDecrement={cart.decrement}
          onRemove={cart.removeFromCart}
          onCheckout={handleCheckout}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Mobile sticky cart bar (shown on home when cart has items) */}
      {page === 'home' && cart.totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:hidden z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-white font-display text-base py-3.5 rounded-2xl shadow-xl flex items-center justify-between px-5 active:scale-95 transition-transform"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {cart.totalItems} item{cart.totalItems > 1 ? 's' : ''}
            </span>
            <span>View Cart 🛒</span>
            <span className="font-bold">RM {cart.subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
      </div> {/* end z-index wrapper */}
    </div>
  )
}
