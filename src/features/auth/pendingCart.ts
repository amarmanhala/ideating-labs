import type { AppDispatch } from '../../app/store'
import { cartApi } from '../shop/cartApi'
import { replaceCart } from '../shop/shopSlice'

const storageKey = 'ideating-labs:pending-cart:v1'
const maxAgeMs = 24 * 60 * 60 * 1000

export type PendingCartItem = {
  slug: string
  size: string
  quantity: number
  createdAt: number
}

function isPendingCartItem(value: unknown): value is PendingCartItem {
  if (!value || typeof value !== 'object') return false

  const item = value as Partial<PendingCartItem>
  return (
    typeof item.slug === 'string' &&
    item.slug.length > 0 &&
    typeof item.size === 'string' &&
    item.size.length > 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 99 &&
    typeof item.createdAt === 'number' &&
    Number.isFinite(item.createdAt)
  )
}

export function savePendingCartItem(
  item: Omit<PendingCartItem, 'createdAt'>,
) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({ ...item, createdAt: Date.now() }),
  )
}

export function consumePendingCartItem(): PendingCartItem | null {
  const rawValue = localStorage.getItem(storageKey)
  if (!rawValue) return null

  localStorage.removeItem(storageKey)

  try {
    const item: unknown = JSON.parse(rawValue)
    if (!isPendingCartItem(item)) return null
    if (Date.now() - item.createdAt > maxAgeMs) return null
    return item
  } catch {
    return null
  }
}

export async function restorePendingCart(dispatch: AppDispatch) {
  const item = consumePendingCartItem()
  if (!item) return false

  try {
    const cart = await dispatch(
      cartApi.endpoints.addCartItem.initiate({
        slug: item.slug,
        size: item.size,
        quantity: item.quantity,
      }),
    ).unwrap()
    dispatch(replaceCart(cart))
    return true
  } catch {
    savePendingCartItem(item)
    return false
  }
}
