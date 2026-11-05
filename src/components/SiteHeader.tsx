import { Avatar } from '@openai/apps-sdk-ui/components/Avatar'
import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Menu } from '@openai/apps-sdk-ui/components/Menu'
import { CloseBold, Menu as MenuIcon, ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
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
  const menuDialogRef = useRef<HTMLDialogElement>(null)
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

    const dialog = menuDialogRef.current
    const trigger = menuButtonRef.current
    const triggerBounds = trigger?.getBoundingClientRect()
    if (triggerBounds) {
      dialog?.style.setProperty('--menu-close-top', `${triggerBounds.top}px`)
      dialog?.style.setProperty('--menu-close-left', `${triggerBounds.left}px`)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()

    const desktopQuery = window.matchMedia('(min-width: 576px)')
    const closeOnResize = () => setMenuOpen(false)
    desktopQuery.addEventListener('change', closeOnResize)
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus()
      desktopQuery.removeEventListener('change', closeOnResize)
    }
  }, [menuOpen])

  const mobileLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/cart', label: `Cart (${cartCount})` },
    ...(account.status === 'anonymous'
      ? [{ to: '/login', label: 'Login' }, { to: '/signup', label: 'Sign Up' }]
      : []),
    ...(account.status === 'authenticated'
      ? [{ to: '/orders', label: 'Orders' }, { to: '/wishlist', label: 'Wishlist' }]
      : []),
  ]

  return (
    <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 pt-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5 sm:pt-4 lg:gap-x-10">
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
          aria-haspopup="dialog"
          aria-controls={menuId}
          className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseBold aria-hidden="true" className="size-5" /> : <MenuIcon aria-hidden="true" className="size-6" />}
        </button>
      </div>

      <dialog
        ref={menuDialogRef}
        id={menuId}
        aria-label="Navigation menu"
        className="mobile-navigation-panel fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-surface p-0 text-primary backdrop:bg-surface sm:hidden"
        onCancel={(event) => {
          event.preventDefault()
          setMenuOpen(false)
        }}
        onClose={() => setMenuOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          )
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
      >
        <div className="flex min-h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="h-11 shrink-0">
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute left-[var(--menu-close-left)] top-[var(--menu-close-top)] flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => setMenuOpen(false)}
            >
              <CloseBold aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mobile-navigation-links flex flex-1 flex-col py-8 text-3xl leading-tight">
            {mobileLinks.map((link, index) => (
              <TextLink
                key={link.to}
                to={link.to}
                underline={false}
                style={{ '--nav-order': index } as CSSProperties}
                className="flex min-h-14 items-center border-b border-default py-3"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </TextLink>
            ))}
            {account.status === 'authenticated' && (
              <button
                type="button"
                onClick={signOut}
                style={{ '--nav-order': mobileLinks.length } as CSSProperties}
                className="flex min-h-14 items-center border-b border-default py-3 text-left"
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </dialog>
    </header>
  )
}
