import { Avatar } from '@openai/apps-sdk-ui/components/Avatar'
import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Menu } from '@openai/apps-sdk-ui/components/Menu'
import { CloseBold, Menu as MenuIcon, ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setAnonymous } from '../features/account/accountSlice'
import { paymentApi } from '../features/orders/paymentApi'
import { cartApi } from '../features/shop/cartApi'
import { clearCart } from '../features/shop/shopSlice'
import { supabase } from '../lib/supabase'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const account = useAppSelector((state) => state.account)
  const cartCount = useAppSelector((state) =>
    state.shop.cartItems.reduce((total, item) => total + item.quantity, 0),
  )

  const signOut = () => {
    void supabase?.auth.signOut()
    dispatch(clearCart())
    dispatch(cartApi.util.resetApiState())
    dispatch(paymentApi.util.resetApiState())
    dispatch(setAnonymous())
    setMenuOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const desktopQuery = window.matchMedia('(min-width: 576px)')
    const closeOnResize = () => setMenuOpen(false)
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    desktopQuery.addEventListener('change', closeOnResize)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
      desktopQuery.removeEventListener('change', closeOnResize)
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 pt-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5 sm:pt-4 lg:gap-x-10">
      <TextLink to="/" underline={false} className="heading-lg">
        Ideating Labs.
      </TextLink>

      <nav
        aria-label="Primary navigation"
        className="col-start-2 row-start-1 hidden min-w-0 flex-wrap items-center gap-x-5 gap-y-2 sm:flex sm:justify-end lg:gap-x-10"
      >
        <TextLink to="/shop" underline={false}>Shop</TextLink>
        <TextLink to="/about" underline={false}>About</TextLink>
        <TextLink to="/faq" underline={false}>FAQ</TextLink>
        {account.status === 'anonymous' && (
          <div className="flex items-center gap-2">
            <ButtonLink to="/login" color="secondary" variant="outline" size="sm">
              Login
            </ButtonLink>
            <ButtonLink to="/signup" color="primary" size="sm">
              Sign Up
            </ButtonLink>
          </div>
        )}
      </nav>

      <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 sm:col-start-3">
        <TextLink
          to="/cart"
          underline={false}
          aria-label={`Cart (${cartCount} items)`}
          className="inline-flex min-h-11 items-center gap-1.5 sm:min-h-0"
        >
          <ShoppingBag aria-hidden="true" className="size-5 sm:hidden" />
          <span className="hidden sm:inline">Cart</span>
          <span>({cartCount})</span>
        </TextLink>

        {account.status === 'authenticated' && (
          <div className="hidden sm:block">
            <Menu modal>
              <Menu.Trigger>
                <Button
                  type="button"
                  color="secondary"
                  variant="ghost"
                  size="lg"
                  uniform
                  aria-label="Open account menu"
                >
                  <Avatar name={account.name} size={28} />
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth={180}>
                <Menu.Link to="/orders">Orders</Menu.Link>
                <Menu.Link to="/wishlist">Wishlist</Menu.Link>
                <Menu.Separator />
                <Menu.Item
                  onSelect={signOut}
                >
                  Log out
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </div>
        )}

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseBold aria-hidden="true" className="size-5" /> : <MenuIcon aria-hidden="true" className="size-6" />}
        </button>
      </div>

      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full z-30 mt-3 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-default bg-surface p-4 shadow-lg sm:hidden [&>a]:flex [&>a]:min-h-11 [&>a]:items-center"
        onClick={(event) => {
          if ((event.target as Element).closest('a')) setMenuOpen(false)
        }}
        onBlur={(event) => {
          if (!headerRef.current?.contains(event.relatedTarget)) setMenuOpen(false)
        }}
      >
        <TextLink to="/shop" underline={false}>Shop</TextLink>
        <TextLink to="/about" underline={false}>About</TextLink>
        <TextLink to="/faq" underline={false}>FAQ</TextLink>
        <TextLink to="/cart" underline={false}>Cart ({cartCount})</TextLink>
        {account.status === 'anonymous' && (
          <>
            <TextLink to="/login" underline={false}>Login</TextLink>
            <TextLink to="/signup" underline={false}>Sign Up</TextLink>
          </>
        )}
        {account.status === 'authenticated' && (
          <>
            <TextLink to="/orders" underline={false}>Orders</TextLink>
            <TextLink to="/wishlist" underline={false}>Wishlist</TextLink>
            <button type="button" onClick={signOut} className="flex min-h-11 items-center">
              Log out
            </button>
          </>
        )}
      </nav>
    </header>
  )
}
