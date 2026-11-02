import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'
import { catalogApi } from '../features/catalog/catalogApi'
import { paymentApi } from '../features/orders/paymentApi'
import { cartApi } from '../features/shop/cartApi'
import shopReducer from '../features/shop/shopSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(catalogApi.middleware)
      .concat(paymentApi.middleware)
      .concat(cartApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
