import { Button, ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import {
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
  const [openSection, setOpenSection] = useState<'materials' | 'fit' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const galleryTreatments = [
    'p-8 sm:p-14',
    'scale-125',
    'p-4 sm:p-10',
  ]

  return (
    <div className="h-dvh overflow-y-auto bg-surface text-primary lg:overflow-hidden">
      <main className="grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.95fr)]">
        <section
          aria-label={`${product.name} image gallery`}
          className="lg:h-dvh lg:overflow-y-auto lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          {galleryTreatments.map((treatment, index) => (
            <figure
              key={treatment}
              className="flex min-h-[72dvh] items-center justify-center overflow-hidden sm:min-h-dvh"
            >
              <Image
                src={product.image}
                alt={`${product.name.toLowerCase()} ${index + 1} of ${galleryTreatments.length}`}
                className={`h-full max-h-dvh w-full object-contain ${treatment}`}
              />
            </figure>
          ))}
        </section>

        <section
          aria-labelledby="product-title"
          className="relative flex flex-col border-l border-default px-6 py-6 font-mono sm:px-10 sm:py-8 lg:h-dvh lg:overflow-y-auto xl:px-14 xl:py-10"
        >
          <ButtonLink
            to="/shop"
            color="secondary"
            variant="ghost"
            size="lg"
            aria-label="Close product details"
            className="absolute right-4 top-4 sm:right-6 sm:top-6"
          >
            <CloseBold />
          </ButtonLink>

          <div className="pr-14">
            <h1 id="product-title" className="text-xl uppercase sm:text-2xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-secondary">{product.price}</p>
          </div>

          <p className="mt-12 max-w-2xl font-sans text-lg leading-relaxed sm:mt-16 sm:text-xl">
            {product.description}
          </p>

          <div className="mt-10">
            <p className="mb-3 text-xs uppercase text-secondary">Select size</p>
            <SegmentedControl
              value={selectedSize}
              onChange={setSelectedSize}
              aria-label="Select product size"
              size="lg"
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
              <span className="max-w-xs truncate text-xs text-secondary">
                {fileNames}
              </span>
            </div>
          </div>

          <Button
            type="button"
            color="primary"
            size="lg"
            className="mt-8 self-start"
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
