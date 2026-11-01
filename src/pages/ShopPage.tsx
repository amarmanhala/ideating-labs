import { Image } from '@openai/apps-sdk-ui/components/Image'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { useGetProductsQuery } from '../features/catalog/catalogApi'
import {
  setCategory,
  type ShopCategory,
} from '../features/shop/shopSlice'
import { formatPrice } from '../utils/currency'

const categories: ShopCategory[] = [
  'All',
  'Tops',
  'Outerwear',
  'Objects',
  'Accessories',
]

export function ShopPage() {
  const activeCategory = useAppSelector((state) => state.shop.category)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryFromUrl =
    categories.find(
      (category) =>
        category.toLowerCase() === searchParams.get('category')?.toLowerCase(),
    ) ?? 'All'

  useEffect(() => {
    dispatch(setCategory(categoryFromUrl))
  }, [categoryFromUrl, dispatch])

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(
    categoryFromUrl === 'All' ? undefined : categoryFromUrl,
  )

  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 pb-20 pt-16 sm:pt-24">
          <div className="mb-6 flex justify-end sm:hidden">
            <label>
              <span className="sr-only">Product category</span>
              <select
                value={activeCategory}
                onChange={(event) => {
                  const category = event.target.value as ShopCategory
                  dispatch(setCategory(category))
                  navigate(
                    category === 'All'
                      ? '/shop'
                      : `/shop?category=${category.toLowerCase()}`,
                  )
                }}
                className="min-h-11 max-w-full rounded-md border border-default bg-surface px-3 py-2 font-mono text-sm text-primary"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All categories' : category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden sm:block">
              <nav
                aria-label="Product categories"
                className="flex flex-col items-start gap-2 text-sm uppercase"
              >
                {categories.map((category) => (
                  <TextLink
                    key={category}
                    to={
                      category === 'All'
                        ? '/shop'
                        : `/shop?category=${category.toLowerCase()}`
                    }
                    underline={category === activeCategory}
                    onClick={() => dispatch(setCategory(category))}
                    className={
                      category === activeCategory
                        ? 'font-mono text-primary'
                        : 'font-mono text-secondary'
                    }
                  >
                    {category === 'All' ? 'Shop all' : category}
                  </TextLink>
                ))}
              </nav>
            </aside>

            <section
              aria-label="Products"
              className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6"
            >
              {isLoading && (
                <div className="col-span-full">
                  <CatalogLoading label="Loading products…" />
                </div>
              )}
              {isError && (
                <div className="col-span-full">
                  <CatalogError onRetry={refetch} />
                </div>
              )}
              {!isLoading && !isError && products.length === 0 && (
                <p className="col-span-full py-12 text-center text-sm text-secondary">
                  No products are available in this category yet.
                </p>
              )}
              {products.map((product) => (
                <article key={product.name} className="min-w-0">
                  <Link
                    to={`/shop/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="block"
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name.toLowerCase()}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col items-center gap-1 text-center text-sm uppercase">
                    <TextLink
                      to={`/shop/${product.slug}`}
                      underline={false}
                      className="min-w-0 max-w-full wrap-anywhere font-mono"
                    >
                      {product.name}
                    </TextLink>
                    <span className="font-mono text-secondary">
                      {formatPrice(product.priceMinor, product.currency)}
                    </span>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
