import { useEffect, type ReactNode } from 'react'
import { useAppDispatch } from '../app/hooks'
import {
  setAnonymous,
  setAuthenticated,
} from '../features/account/accountSlice'
import { accountFromUser } from '../features/auth/user'
import { loadCart } from '../features/shop/cartPersistence'
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

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return

      const user = error ? null : data.session?.user
      if (user) {
        dispatch(replaceCart(loadCart(user.id)))
        dispatch(setAuthenticated(accountFromUser(user)))
      } else {
        dispatch(setAnonymous())
        dispatch(clearCart())
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      const user = session?.user
      if (user) {
        dispatch(replaceCart(loadCart(user.id)))
        dispatch(setAuthenticated(accountFromUser(user)))
      } else {
        dispatch(setAnonymous())
        dispatch(clearCart())
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [dispatch])

  return children
}
