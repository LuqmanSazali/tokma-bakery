import { useReducer, useEffect } from 'react'
import type { CartItem, Product, SelectedOptionGroup } from '../types'
import { calcItemPrice } from '../utils/product'

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

// Unique key — same product with different options = different cart entries
export function cartKey(item: CartItem): string {
  const opts = item.selectedOptions
    ?.map(g => `${g.name}:${g.items.slice().sort().join(',')}`)
    .sort()
    .join('|') ?? ''
  return `${item.product.id}__${opts}`
}

type CartAction =
  | { type: 'ADD'; product: Product; selectedOptions?: SelectedOptionGroup[] }
  | { type: 'REMOVE'; key: string }
  | { type: 'INCREMENT'; key: string }
  | { type: 'DECREMENT'; key: string }
  | { type: 'CLEAR' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const newItem: CartItem = {
        product: action.product,
        quantity: 1,
        selectedOptions: action.selectedOptions,
      }
      const key = cartKey(newItem)
      const existing = state.find(i => cartKey(i) === key)
      if (existing) {
        return state.map(i => cartKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...state, newItem]
    }
    case 'REMOVE':
      return state.filter(i => cartKey(i) !== action.key)
    case 'INCREMENT':
      return state.map(i => cartKey(i) === action.key ? { ...i, quantity: i.quantity + 1 } : i)
    case 'DECREMENT':
      return state
        .map(i => cartKey(i) === action.key ? { ...i, quantity: i.quantity - 1 } : i)
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
  const subtotal = items.reduce((sum, i) =>
    sum + calcItemPrice(i.product, i.selectedOptions) * i.quantity, 0)

  return {
    items,
    totalItems,
    subtotal,
    cartKey,
    addToCart: (product: Product, selectedOptions?: SelectedOptionGroup[]) =>
      dispatch({ type: 'ADD', product, selectedOptions }),
    removeFromCart: (key: string) => dispatch({ type: 'REMOVE', key }),
    increment: (key: string) => dispatch({ type: 'INCREMENT', key }),
    decrement: (key: string) => dispatch({ type: 'DECREMENT', key }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }
}
