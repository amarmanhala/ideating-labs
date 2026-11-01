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
    clearCart: (state) => {
      state.cartItems = []
    },
    replaceCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload
    },
  },
})

export const {
  clearCart,
  replaceCart,
  setCategory,
} = shopSlice.actions
export default shopSlice.reducer
