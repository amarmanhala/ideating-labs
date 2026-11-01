import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AccountState = {
  isSignedIn: boolean
  name: string
  email: string
}

const initialState: AccountState = {
  isSignedIn: false,
  name: '',
  email: '',
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{ name: string; email: string }>,
    ) => {
      state.isSignedIn = true
      state.name = action.payload.name
      state.email = action.payload.email
    },
    logOut: () => initialState,
  },
})

export const { signIn, logOut } = accountSlice.actions
export default accountSlice.reducer
