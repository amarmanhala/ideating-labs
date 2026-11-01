import { ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useAppSelector } from '../app/hooks'

export function SiteHeader() {
  const cartCount = useAppSelector((state) =>
    state.shop.cartItems.reduce((total, item) => total + item.quantity, 0),
  )

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 pt-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:pt-4 lg:gap-x-10">
      <TextLink to="/" underline={false} className="heading-lg">
        Ideating Labs.
      </TextLink>

      <nav
        aria-label="Primary navigation"
        className="col-span-2 row-start-2 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end lg:gap-x-10"
      >
        <TextLink to="/shop" underline={false}>Shop</TextLink>
        <TextLink to="/#about" underline={false}>About</TextLink>
        <TextLink to="/faq" underline={false}>FAQ</TextLink>
      </nav>

      <TextLink
        to="/cart"
        underline={false}
        aria-label={`Cart (${cartCount} items)`}
        className="col-start-2 row-start-1 inline-flex min-h-11 items-center gap-1.5 sm:col-start-3 sm:min-h-0"
      >
        <ShoppingBag aria-hidden="true" className="size-5 sm:hidden" />
        <span className="hidden sm:inline">Cart</span>
        <span>({cartCount})</span>
      </TextLink>
    </header>
  )
}
