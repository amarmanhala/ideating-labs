import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useAppSelector } from '../app/hooks'

export function SiteHeader() {
  const cartCount = useAppSelector((state) =>
    state.shop.cartItems.reduce((total, item) => total + item.quantity, 0),
  )

  return (
    <header className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start sm:justify-between sm:pt-4">
      <TextLink to="/" underline={false} className="heading-lg">
        Ideating Labs.
      </TextLink>

      <nav
        aria-label="Primary navigation"
        className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end lg:gap-x-10"
      >
        <TextLink to="/#studio" underline={false}>Studio</TextLink>
        <TextLink to="/shop" underline={false}>Shop</TextLink>
        <TextLink to="/#archive" underline={false}>Archive</TextLink>
        <TextLink to="/#about" underline={false}>About</TextLink>
        <TextLink to="/#faq" underline={false}>FAQ</TextLink>
        <TextLink to="/cart" underline={false}>Cart ({cartCount})</TextLink>
      </nav>
    </header>
  )
}
