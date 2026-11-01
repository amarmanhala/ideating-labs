import { useEffect, type ReactNode } from 'react'
import { useAppDispatch } from '../app/hooks'
import {
  setAnonymous,
  setAuthenticated,
} from '../features/account/accountSlice'
import { accountFromUser } from '../features/auth/user'
import { cartApi } from '../features/shop/cartApi'
import { clearCart, replaceCart } from '../features/shop/shopSlice'
import { supabase } from '../lib/supabase'

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!supabase) {
      dispatch(setAnonymous())
      return
    }

    let active = true

    const authenticate = async (user: Parameters<typeof accountFromUser>[0]) => {
      dispatch(setAuthenticated(accountFromUser(user)))
      try {
        const cart = await dispatch(
          cartApi.endpoints.getCart.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ).unwrap()
        if (active) dispatch(replaceCart(cart))
      } catch {
        if (active) dispatch(clearCart())
      }
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return

      const user = error ? null : data.session?.user
      if (user) {
        void authenticate(user)
      } else {
        dispatch(setAnonymous())
        dispatch(clearCart())
        dispatch(cartApi.util.resetApiState())
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      const user = session?.user
      if (user) {
        void authenticate(user)
      } else {
        dispatch(setAnonymous())
        dispatch(clearCart())
        dispatch(cartApi.util.resetApiState())
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [dispatch])

  return children
}
