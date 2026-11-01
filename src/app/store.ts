import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'
import shopReducer from '../features/shop/shopSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    shop: shopReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
