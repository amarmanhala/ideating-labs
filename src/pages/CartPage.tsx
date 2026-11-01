import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash,
} from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { useGetProductsQuery } from '../features/catalog/catalogApi'
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useSetCartItemQuantityMutation,
} from '../features/shop/cartApi'
import { replaceCart } from '../features/shop/shopSlice'
import { formatPrice } from '../utils/currency'

export function CartPage() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.shop.cartItems)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError: isCartError,
    refetch: refetchCart,
  } = useGetCartQuery()
  const [setCartItemQuantity, { isLoading: isSettingQuantity }] =
    useSetCartItemQuantityMutation()
  const [removeCartItem, { isLoading: isRemovingItem }] =
    useRemoveCartItemMutation()

  useEffect(() => {
    if (serverCart) dispatch(replaceCart(serverCart))
  }, [dispatch, serverCart])
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(undefined, {
    skip: isCartLoading || cartItems.length === 0,
  })
  const productsBySlug = new Map(
    products.map((product) => [product.slug, product]),
  )
  const subtotal = cartItems.reduce((total, item) => {
    const product = productsBySlug.get(item.slug)
    return product
      ? total + product.priceMinor * item.quantity
      : total
  }, 0)
  const itemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )
  const isUpdating = isSettingQuantity || isRemovingItem

  async function updateQuantity(
    item: (typeof cartItems)[number],
    quantity: number,
  ) {
    setUpdateError(null)
    try {
      const cart =
        quantity === 0
          ? await removeCartItem({ slug: item.slug, size: item.size }).unwrap()
          : await setCartItemQuantity({ ...item, quantity }).unwrap()
      dispatch(replaceCart(cart))
    } catch {
      setUpdateError('We couldn’t update your cart. Please try again.')
    }
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col overflow-y-auto py-6 sm:py-10 lg:overflow-hidden">
        {isCartLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CatalogLoading label="Loading your cart…" />
          </div>
        ) : isCartError ? (
          <div className="flex flex-1 items-center justify-center">
            <CatalogError onRetry={refetchCart} />
          </div>
        ) : cartItems.length === 0 ? (
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
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CatalogLoading label="Loading your cart…" />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <CatalogError onRetry={refetch} />
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <section
              aria-label="Cart items"
              className="min-h-0 lg:overflow-y-auto lg:pr-4"
            >
              {updateError && (
                <Alert
                  color="danger"
                  title="Cart not updated"
                  description={updateError}
                  className="mb-4"
                />
              )}
              <div className="divide-y divide-default border-y border-default">
                {cartItems.map((item) => {
                  const product = productsBySlug.get(item.slug)
                  if (!product) return null

                  const itemKey = `${item.slug}-${item.size}`
                  return (
                    <article
                      key={itemKey}
                      className="grid grid-cols-[96px_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-start sm:gap-8 sm:py-8"
                    >
                      <TextLink
                        to={`/shop/${product.slug}`}
                        underline={false}
                        aria-label={`View ${product.name}`}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name.toLowerCase()}
                          className="aspect-square w-full object-contain"
                        />
                      </TextLink>

                      <div className="flex min-w-0 flex-col items-start">
                        <TextLink
                          to={`/shop/${product.slug}`}
                          underline={false}
                          className="wrap-anywhere font-mono text-base uppercase sm:text-lg"
                        >
                          {product.name}
                        </TextLink>
                        <p className="mt-2 text-sm text-secondary">
                          {product.category} · Size {item.size}
                        </p>

                        <div
                          className="mt-5 inline-flex items-center rounded-lg border border-default"
                          aria-label={`Quantity for ${product.name}`}
                        >
                          <Button
                            type="button"
                            color="secondary"
                            variant="ghost"
                            pill={false}
                            uniform
                            size="lg"
                            disabled={isUpdating}
                            aria-label={
                              item.quantity === 1
                                ? `Remove ${product.name} from cart`
                                : `Decrease ${product.name} quantity`
                            }
                            onClick={() =>
                              void updateQuantity(item, item.quantity - 1)
                            }
                          >
                            {item.quantity === 1 ? <Trash /> : <Minus />}
                          </Button>
                          <span className="flex h-9 min-w-10 items-center justify-center border-x border-default px-3 font-mono text-base">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            color="secondary"
                            variant="ghost"
                            pill={false}
                            uniform
                            size="lg"
                            disabled={isUpdating || item.quantity >= 99}
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() =>
                              void updateQuantity(item, item.quantity + 1)
                            }
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>

                      <p className="col-start-2 font-mono text-base sm:col-auto sm:text-lg">
                        {formatPrice(
                          product.priceMinor * item.quantity,
                          product.currency,
                        )}
                      </p>
                    </article>
                  )
                })}
              </div>
            </section>

            <aside aria-label="Order summary" className="lg:self-start">
              <div className="rounded-xl border border-default p-5 sm:p-6">
                <h2 className="heading-md">Order summary</h2>
                <div className="mt-6 flex items-start justify-between gap-4 text-base">
                  <span>
                    Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="shrink-0 font-mono">
                    {formatPrice(subtotal, 'CAD')}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  Shipping and taxes are calculated at checkout.
                </p>
                <Button color="primary" size="xl" block className="mt-6">
                  Proceed to checkout
                </Button>
              </div>
            </aside>
          </div>
        )}
    </main>
  )
}
