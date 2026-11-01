import type { CartItem } from './shopSlice'

const cartStorageVersion = 1

function getCartStorageKey(userId: string) {
  return `ideating-labs:cart:${userId}:v${cartStorageVersion}`
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false

  const item = value as Partial<CartItem>
  return (
    typeof item.slug === 'string' &&
    item.slug.length > 0 &&
    typeof item.size === 'string' &&
    item.size.length > 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
}

export function loadCart(userId: string): CartItem[] {
  try {
    const storedCart = localStorage.getItem(getCartStorageKey(userId))
    if (!storedCart) return []

    const parsed: unknown = JSON.parse(storedCart)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isCartItem)
  } catch {
    return []
  }
}

export function saveCart(userId: string, cartItems: CartItem[]) {
  try {
    localStorage.setItem(getCartStorageKey(userId), JSON.stringify(cartItems))
  } catch {
    // Keep the in-memory cart usable when browser storage is unavailable.
  }
}
