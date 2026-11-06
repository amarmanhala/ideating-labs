import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
} from '@openai/apps-sdk-ui/components/Icon'
import { useRef, useState, type CSSProperties } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { useGetProductQuery } from '../features/catalog/catalogApi'
import { savePendingCartItem } from '../features/auth/pendingCart'
import { useAddCartItemMutation } from '../features/shop/cartApi'
import { replaceCart } from '../features/shop/shopSlice'
import type { Product } from '../types/catalog'
import { formatPrice } from '../utils/currency'

const disclosureButtonStyle = {
  '--button-background-color': 'transparent',
  '--button-background-color-active': 'transparent',
  '--button-text-color-hover': 'var(--color-text-primary)',
} as CSSProperties

export function ProductDetailPage() {
  const { slug } = useParams()
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(slug ?? '', { skip: !slug })

  if (!slug) {
    return <Navigate to="/shop" replace />
  }

  if (isLoading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <CatalogLoading label="Loading product…" />
      </main>
    )
  }

  if (error && 'status' in error && error.status === 404) {
    return <Navigate to="/shop" replace />
  }

  if (error) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-5">
        <CatalogError onRetry={refetch} />
      </main>
    )
  }

  if (!product) {
    return <Navigate to="/shop" replace />
  }

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authStatus = useAppSelector((state) => state.account.status)
  const [addCartItem, { isLoading: isAddingToCart }] = useAddCartItemMutation()
  const [cartError, setCartError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [openSection, setOpenSection] = useState<'materials' | 'fit' | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const galleryTreatments = [
    'p-8 sm:p-14',
    'scale-125',
    'p-4 sm:p-10',
  ]

  return (
      <main className="-mx-3 flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.95fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
        <section
          aria-label={`${product.name} image gallery`}
          className="relative min-h-0 min-w-0 shrink-0 lg:shrink"
        >
          <div
            ref={galleryRef}
            onScroll={(event) => {
              const gallery = event.currentTarget
              setActiveImage(Math.round(gallery.scrollLeft / gallery.clientWidth))
            }}
            className="grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:h-full lg:overflow-x-hidden lg:overflow-y-auto"
          >
            {galleryTreatments.map((treatment, index) => (
              <figure
                key={treatment}
                className="flex h-[min(100vw,65dvh)] min-w-0 snap-center items-center justify-center overflow-hidden lg:h-full"
              >
                <Image
                  src={product.imageUrl}
                  alt={`${product.name.toLowerCase()} ${index + 1} of ${galleryTreatments.length}`}
                  className={`h-full max-h-full w-full object-contain ${treatment}`}
                />
              </figure>
            ))}
          </div>
          <button
            type="button"
            aria-label="Previous product image"
            disabled={activeImage === 0}
            className="absolute left-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
            onClick={() =>
              galleryRef.current?.scrollTo({
                left: (activeImage - 1) * galleryRef.current.clientWidth,
                behavior: 'smooth',
              })
            }
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next product image"
            disabled={activeImage === galleryTreatments.length - 1}
            className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
            onClick={() =>
              galleryRef.current?.scrollTo({
                left: (activeImage + 1) * galleryRef.current.clientWidth,
                behavior: 'smooth',
              })
            }
          >
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </section>

        <section
          aria-labelledby="product-title"
          className="relative z-10 flex min-h-0 min-w-0 shrink-0 flex-col bg-surface px-6 pb-8 pt-5 sm:px-10 sm:py-8 lg:h-full lg:shrink lg:overflow-y-auto lg:border-l lg:border-default xl:px-14 xl:py-10"
        >
          <div>
            <h1 id="product-title" className="heading-md wrap-anywhere font-mono uppercase sm:heading-lg">
              {product.name}
            </h1>
            <p className="mt-2 font-mono text-lg text-secondary">
              {formatPrice(product.priceMinor, product.currency)}
            </p>
          </div>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed lg:mt-16 lg:text-xl">
            {product.description}
          </p>

          <fieldset className="mt-6 min-w-0 lg:mt-10">
            <legend className="mb-3 font-mono text-xs uppercase text-secondary">Select size</legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-3">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  color={selectedSize === size ? 'primary' : 'secondary'}
                  variant={selectedSize === size ? 'solid' : 'outline'}
                  size="3xl"
                  block
                  aria-pressed={selectedSize === size}
                  className="h-auto min-h-14 min-w-0 whitespace-normal py-3 font-mono text-lg"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6 min-w-0">
            <legend className="mb-3 font-mono text-xs uppercase text-secondary">Quantity</legend>
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] gap-3">
              <Button
                type="button"
                color="secondary"
                variant="outline"
                size="3xl"
                block
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                className="min-h-14"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                <Minus aria-hidden="true" className="size-5" />
              </Button>
              <Input
                aria-label="Quantity"
                type="number"
                min="1"
                max="99"
                step="1"
                value={quantity}
                size="3xl"
                pill
                className="min-w-0 font-mono text-lg [--input-size:3.5rem] [&>input]:text-center"
                onChange={(event) => {
                  const nextQuantity = Number(event.target.value)
                  setQuantity(
                    Number.isFinite(nextQuantity)
                      ? Math.min(99, Math.max(1, Math.floor(nextQuantity)))
                      : 1,
                  )
                }}
              />
              <Button
                type="button"
                color="secondary"
                variant="outline"
                size="3xl"
                block
                aria-label="Increase quantity"
                disabled={quantity >= 99}
                className="min-h-14"
                onClick={() => setQuantity((current) => Math.min(99, current + 1))}
              >
                <Plus aria-hidden="true" className="size-5" />
              </Button>
            </div>
          </fieldset>

          <Button
            type="button"
            color="primary"
            size="lg"
            loading={authStatus === 'initializing' || isAddingToCart}
            className="mt-8 w-full max-sm:min-h-14 max-sm:text-lg lg:w-auto lg:self-start"
            onClick={async () => {
              setCartError(null)
              if (authStatus !== 'authenticated') {
                savePendingCartItem({
                  slug: product.slug,
                  size: selectedSize,
                  quantity,
                })
                navigate('/login?next=%2Fcart')
                return
              }

              try {
                const cart = await addCartItem({
                  slug: product.slug,
                  size: selectedSize,
                  quantity,
                }).unwrap()
                dispatch(replaceCart(cart))
                navigate('/cart')
              } catch (error) {
                if (
                  typeof error === 'object' &&
                  error !== null &&
                  'status' in error &&
                  error.status === 401
                ) {
                  savePendingCartItem({
                    slug: product.slug,
                    size: selectedSize,
                    quantity,
                  })
                  navigate('/login?next=%2Fcart')
                  return
                }
                setCartError('We couldn’t add this item. Please try again.')
              }
            }}
          >
            Add to cart
          </Button>

          {cartError && (
            <Alert
              color="danger"
              title="Cart not updated"
              description={cartError}
              className="mt-4"
            />
          )}

          <div className="mt-auto pt-10 font-sans">
            <div className="border-t border-default py-2">
              <Button
                type="button"
                color="secondary"
                variant="ghost"
                size="xl"
                pill={false}
                block
                aria-expanded={openSection === 'materials'}
                aria-controls="materials-panel"
                className="font-sans [&>span]:w-full [&>span]:justify-between"
                style={disclosureButtonStyle}
                onClick={() =>
                  setOpenSection((current) =>
                    current === 'materials' ? null : 'materials',
                  )
                }
              >
                Materials &amp; Care
                {openSection === 'materials' ? (
                  <Minus className="size-5" />
                ) : (
                  <Plus className="size-5" />
                )}
              </Button>
              {openSection === 'materials' && (
                <p
                  id="materials-panel"
                  className="px-4 pb-4 pt-2 text-sm leading-relaxed text-secondary"
                >
                  {product.materials}
                </p>
              )}
            </div>

            <div className="border-y border-default py-2">
              <Button
                type="button"
                color="secondary"
                variant="ghost"
                size="xl"
                pill={false}
                block
                aria-expanded={openSection === 'fit'}
                aria-controls="fit-panel"
                className="font-sans [&>span]:w-full [&>span]:justify-between"
                style={disclosureButtonStyle}
                onClick={() =>
                  setOpenSection((current) =>
                    current === 'fit' ? null : 'fit',
                  )
                }
              >
                Size &amp; Fit
                {openSection === 'fit' ? (
                  <Minus className="size-5" />
                ) : (
                  <Plus className="size-5" />
                )}
              </Button>
              {openSection === 'fit' && (
                <p
                  id="fit-panel"
                  className="px-4 pb-4 pt-2 text-sm leading-relaxed text-secondary"
                >
                  {product.fit}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
  )
}
