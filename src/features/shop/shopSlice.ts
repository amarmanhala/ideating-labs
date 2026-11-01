import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProductCategory } from '../../types/catalog'

export type ShopCategory = 'All' | ProductCategory

export type CartItem = {
  slug: string
  size: string
  quantity: number
}

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    category: 'All' as ShopCategory,
    cartItems: [] as CartItem[],
  },
  reducers: {
    setCategory: (state, action: PayloadAction<ShopCategory>) => {
      state.category = action.payload
    },
    addToCart: (
      state,
      action: PayloadAction<{ slug: string; size: string; quantity: number }>,
    ) => {
      const quantity = Math.max(1, Math.floor(action.payload.quantity))
      const existingItem = state.cartItems.find(
        (item) =>
          item.slug === action.payload.slug && item.size === action.payload.size,
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cartItems.push({ ...action.payload, quantity })
      }
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ slug: string; size: string }>,
    ) => {
      const item = state.cartItems.find(
        (cartItem) =>
          cartItem.slug === action.payload.slug &&
          cartItem.size === action.payload.size,
      )
      if (item) item.quantity += 1
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ slug: string; size: string }>,
    ) => {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) =>
          cartItem.slug === action.payload.slug &&
          cartItem.size === action.payload.size,
      )
      if (itemIndex < 0) return

      if (state.cartItems[itemIndex].quantity === 1) {
        state.cartItems.splice(itemIndex, 1)
      } else {
        state.cartItems[itemIndex].quantity -= 1
      }
    },
    clearCart: (state) => {
      state.cartItems = []
    },
  },
})

export const {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  setCategory,
} = shopSlice.actions
export default shopSlice.reducer
