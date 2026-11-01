import { Avatar } from '@openai/apps-sdk-ui/components/Avatar'
import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Menu } from '@openai/apps-sdk-ui/components/Menu'
import { ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logOut } from '../features/account/accountSlice'

export function SiteHeader({ showAccountLinks = false }: { showAccountLinks?: boolean }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const account = useAppSelector((state) => state.account)
  const cartCount = useAppSelector((state) =>
    state.shop.cartItems.reduce((total, item) => total + item.quantity, 0),
  )

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 pt-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:pt-4 lg:gap-x-10">
      <TextLink to="/" underline={false} className="heading-lg">
        Ideating Labs.
      </TextLink>

      <nav
        aria-label="Primary navigation"
        className="col-span-2 row-start-2 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end lg:gap-x-10"
      >
        <TextLink to="/shop" underline={false}>Shop</TextLink>
        <TextLink to="/about" underline={false}>About</TextLink>
        <TextLink to="/faq" underline={false}>FAQ</TextLink>
        {showAccountLinks && !account.isSignedIn && (
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

        {account.isSignedIn && (
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
                onSelect={() => {
                  dispatch(logOut())
                  navigate('/')
                }}
              >
                Log out
              </Menu.Item>
            </Menu.Content>
          </Menu>
        )}
      </div>
    </header>
  )
}
