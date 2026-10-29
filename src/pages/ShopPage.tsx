import { Image } from '@openai/apps-sdk-ui/components/Image'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { products } from '../data/products'
import {
  setCategory,
  type ShopCategory,
} from '../features/shop/shopSlice'

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
  const [searchParams] = useSearchParams()
  const categoryFromUrl =
    categories.find(
      (category) =>
        category.toLowerCase() === searchParams.get('category')?.toLowerCase(),
    ) ?? 'All'

  useEffect(() => {
    dispatch(setCategory(categoryFromUrl))
  }, [categoryFromUrl, dispatch])

  const visibleProducts = products.filter(
    (product) =>
      activeCategory === 'All' || product.category === activeCategory,
  )

  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 pb-20 pt-16 font-mono sm:pt-24">
          <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
            <aside>
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
              className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"
            >
              {visibleProducts.map((product) => (
                <article key={product.name}>
                  <Link
                    to={`/shop/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="block"
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name.toLowerCase()}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col items-center gap-1 text-center text-sm uppercase">
                    <TextLink
                      to={`/shop/${product.slug}`}
                      underline={false}
                      className="font-mono"
                    >
                      {product.name}
                    </TextLink>
                    <span className="text-secondary">{product.price}</span>
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
