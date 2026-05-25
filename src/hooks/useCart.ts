import { useReducer, useEffect } from 'react'
import type { CartItem, Product } from '../types'

const CART_KEY = 'tokma_cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'INCREMENT'; productId: string }
  | { type: 'DECREMENT'; productId: string }
  | { type: 'CLEAR' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.product.id === action.product.id)
      if (existing) {
        return state.map(i =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        )
      }
      return [...state, { product: action.product, quantity: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.product.id !== action.productId)
    case 'INCREMENT':
      return state.map(i =>
        i.product.id === action.productId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      )
    case 'DECREMENT':
      return state
        .map(i =>
          i.product.id === action.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter(i => i.quantity > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function useCart() {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return {
    items,
    totalItems,
    subtotal,
    addToCart: (product: Product) => dispatch({ type: 'ADD', product }),
    removeFromCart: (productId: string) => dispatch({ type: 'REMOVE', productId }),
    increment: (productId: string) => dispatch({ type: 'INCREMENT', productId }),
    decrement: (productId: string) => dispatch({ type: 'DECREMENT', productId }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }
}
