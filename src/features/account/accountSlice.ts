import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthStatus = 'initializing' | 'authenticated' | 'anonymous'

type AccountState = {
  status: AuthStatus
  userId: string | null
  name: string
  email: string
}

const initialState: AccountState = {
  status: 'initializing',
  userId: null,
  name: '',
  email: '',
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAuthenticated: (
      state,
      action: PayloadAction<{ userId: string; name: string; email: string }>,
    ) => {
      state.status = 'authenticated'
      state.userId = action.payload.userId
      state.name = action.payload.name
      state.email = action.payload.email
    },
    setAnonymous: () => ({ ...initialState, status: 'anonymous' as const }),
  },
})

export const { setAnonymous, setAuthenticated } = accountSlice.actions
export default accountSlice.reducer
