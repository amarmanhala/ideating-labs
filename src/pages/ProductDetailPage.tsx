import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import {
  ArrowLeft,
  ArrowRight,
  CloseBold,
  Minus,
  Plus,
  UploadDocuments,
} from '@openai/apps-sdk-ui/components/Icon'
import { SegmentedControl } from '@openai/apps-sdk-ui/components/SegmentedControl'
import { useRef, useState, type CSSProperties } from 'react'
import { Navigate, useParams } from 'react-router'
import { useAppDispatch } from '../app/hooks'
import { products } from '../data/products'
import { addToCart } from '../features/shop/shopSlice'

const disclosureButtonStyle = {
  '--button-background-color': 'transparent',
  '--button-background-color-active': 'transparent',
  '--button-text-color-hover': 'var(--color-text-primary)',
} as CSSProperties

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return <Navigate to="/shop" replace />
  }

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: (typeof products)[number] }) {
  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [fileNames, setFileNames] = useState('No files selected')
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [openSection, setOpenSection] = useState<'materials' | 'fit' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const galleryTreatments = [
    'p-8 sm:p-14',
    'scale-125',
    'p-4 sm:p-10',
  ]

  return (
    <div className="min-h-dvh bg-surface text-primary lg:h-dvh lg:overflow-hidden">
      <main className="grid min-w-0 lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.95fr)]">
        <section
          aria-label={`${product.name} image gallery`}
          className="relative min-w-0"
        >
          <div
            ref={galleryRef}
            onScroll={(event) => {
              const gallery = event.currentTarget
              setActiveImage(Math.round(gallery.scrollLeft / gallery.clientWidth))
            }}
            className="grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:h-dvh lg:overflow-x-hidden lg:overflow-y-auto"
          >
            {galleryTreatments.map((treatment, index) => (
              <figure
                key={treatment}
                className="flex h-[min(100vw,65dvh)] min-w-0 snap-center items-center justify-center overflow-hidden lg:h-dvh"
              >
                <Image
                  src={product.image}
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
            className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
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
            className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
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
          className="relative flex min-w-0 flex-col px-5 pb-8 pt-5 font-mono sm:px-10 sm:py-8 lg:h-dvh lg:overflow-y-auto lg:border-l lg:border-default xl:px-14 xl:py-10"
        >
          <ButtonLink
            to="/shop"
            color="secondary"
            variant="ghost"
            size="lg"
            aria-label="Close product details"
            className="fixed right-4 top-4 z-20 bg-surface sm:right-6 sm:top-6 lg:absolute"
          >
            <CloseBold />
          </ButtonLink>

          <div className="lg:pr-14">
            <h1 id="product-title" className="wrap-anywhere text-xl uppercase sm:text-2xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-secondary">{product.price}</p>
          </div>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed lg:mt-16 lg:text-xl">
            {product.description}
          </p>

          <div className="mt-6 min-w-0 lg:mt-10">
            <p className="mb-3 text-xs uppercase text-secondary">Select size</p>
            <SegmentedControl
              value={selectedSize}
              onChange={setSelectedSize}
              aria-label="Select product size"
              size="lg"
              className="max-w-full"
            >
              {product.sizes.map((size) => (
                <SegmentedControl.Option key={size} value={size}>
                  {size}
                </SegmentedControl.Option>
              ))}
            </SegmentedControl>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase text-secondary">Upload files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={(event) => {
                const names = Array.from(event.target.files ?? []).map(
                  (file) => file.name,
                )
                setFileNames(names.length ? names.join(', ') : 'No files selected')
              }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                color="secondary"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadDocuments />
                Choose files
              </Button>
              <span className="min-w-0 max-w-full truncate text-xs text-secondary sm:max-w-xs">
                {fileNames}
              </span>
            </div>
          </div>

          <Button
            type="button"
            color="primary"
            size="lg"
            className="mt-8 w-full lg:w-auto lg:self-start"
            onClick={() => {
              dispatch(addToCart({ slug: product.slug, size: selectedSize }))
              setAdded(true)
            }}
          >
            {added ? `Added · ${selectedSize}` : 'Add to cart'}
          </Button>

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
    </div>
  )
}
