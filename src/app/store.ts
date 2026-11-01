import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'
import { catalogApi } from '../features/catalog/catalogApi'
import shopReducer from '../features/shop/shopSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
