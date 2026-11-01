import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'
import { catalogApi } from '../features/catalog/catalogApi'
import { saveCart } from '../features/shop/cartPersistence'
import shopReducer, {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  type CartItem,
} from '../features/shop/shopSlice'

const cartPersistence = createListenerMiddleware()

cartPersistence.startListening({
  matcher: isAnyOf(
    addToCart,
    clearCart,
    decrementQuantity,
    incrementQuantity,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as {
      account: { status: string; userId: string | null }
      shop: { cartItems: CartItem[] }
    }

    if (state.account.status === 'authenticated' && state.account.userId) {
      saveCart(state.account.userId, state.shop.cartItems)
    }
  },
})

export const store = configureStore({
  reducer: {
    account: accountReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(cartPersistence.middleware)
      .concat(catalogApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
