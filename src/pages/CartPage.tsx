import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import {
  CloseBold,
  Minus,
  Plus,
  ShoppingBag,
} from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { products } from '../data/products'
import {
  decrementQuantity,
  incrementQuantity,
} from '../features/shop/shopSlice'

function currency(value: number) {
  return `$${value.toFixed(2)}`
}

function productPrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, ''))
}

export function CartPage() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.shop.cartItems)
  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find((candidate) => candidate.slug === item.slug)
    return product
      ? total + productPrice(product.price) * item.quantity
      : total
  }, 0)

  return (
    <div className="h-dvh overflow-hidden bg-surface font-mono text-primary">
      <main className="mx-auto flex h-full w-full max-w-[1200px] flex-col px-5 py-6 sm:px-10 sm:py-10 lg:px-14">
        <header className="flex items-center justify-between">
          <h1 className="text-xl uppercase sm:text-2xl">Shopping cart</h1>
          <ButtonLink
            to="/shop"
            color="secondary"
            variant="ghost"
            size="lg"
            aria-label="Close cart"
          >
            <CloseBold />
          </ButtonLink>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyMessage fill="none">
              <EmptyMessage.Icon size="md">
                <ShoppingBag />
              </EmptyMessage.Icon>
              <EmptyMessage.Title>Your cart is empty</EmptyMessage.Title>
              <EmptyMessage.Description>
                Choose a reminder to carry with you.
              </EmptyMessage.Description>
              <EmptyMessage.ActionRow>
                <ButtonLink to="/shop" color="primary">
                  Explore the collection
                </ButtonLink>
              </EmptyMessage.ActionRow>
            </EmptyMessage>
          </div>
        ) : (
          <>
            <section
              aria-label="Cart items"
              className="mt-12 flex-1 overflow-y-auto sm:mt-16"
            >
              <div className="space-y-10">
                {cartItems.map((item) => {
                  const product = products.find(
                    (candidate) => candidate.slug === item.slug,
                  )
                  if (!product) return null

                  const itemKey = `${item.slug}-${item.size}`
                  const actionPayload = { slug: item.slug, size: item.size }

                  return (
                    <article
                      key={itemKey}
                      className="grid grid-cols-[88px_minmax(0,1fr)] gap-5 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-start sm:gap-8"
                    >
                      <TextLink
                        to={`/shop/${product.slug}`}
                        underline={false}
                        aria-label={`View ${product.name}`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name.toLowerCase()}
                          className="aspect-square w-full object-contain"
                        />
                      </TextLink>

                      <div className="flex flex-col items-start">
                        <TextLink
                          to={`/shop/${product.slug}`}
                          underline={false}
                          className="text-base uppercase sm:text-xl"
                        >
                          {product.name} ({item.size})
                        </TextLink>

                        <div
                          className="mt-5 inline-flex items-center border border-default"
                          aria-label={`Quantity for ${product.name}`}
                        >
                          <Button
                            type="button"
                            color="secondary"
                            variant="ghost"
                            pill={false}
                            uniform
                            size="lg"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() => dispatch(decrementQuantity(actionPayload))}
                          >
                            <Minus />
                          </Button>
                          <span className="flex h-9 min-w-10 items-center justify-center border-x border-default px-3 text-base">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            color="secondary"
                            variant="ghost"
                            pill={false}
                            uniform
                            size="lg"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() => dispatch(incrementQuantity(actionPayload))}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>

                      <p className="col-start-2 text-base text-secondary sm:col-auto sm:text-xl">
                        {currency(productPrice(product.price) * item.quantity)}
                      </p>
                    </article>
                  )
                })}
              </div>
            </section>

            <footer className="pt-8">
              <div className="flex items-center justify-between border-b border-default pb-6 text-lg uppercase sm:text-xl">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <Button color="primary" size="2xl" block className="mt-8">
                Checkout
              </Button>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
