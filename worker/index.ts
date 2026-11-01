import {
  productCategories,
  type ApiErrorResponse,
  type Product,
  type ProductCategory,
  type ProductDetailResponse,
  type ProductListResponse,
} from '../src/types/catalog'

type ProductRow = {
  id: number
  slug: string
  name: string
  category: ProductCategory
  price_minor: number
  currency: 'CAD'
  image_url: string
  description: string
  materials: string
  fit: string
  size: string | null
}

const selectProducts = `
  SELECT
    p.id,
    p.slug,
    p.name,
    p.category,
    p.price_minor,
    p.currency,
    p.image_url,
    p.description,
    p.materials,
    p.fit,
    ps.size
  FROM products AS p
  LEFT JOIN product_sizes AS ps ON ps.product_id = p.id
  WHERE p.is_active = 1
`

const responseHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=300',
}

function apiError(status: number, code: string, message: string) {
  return Response.json(
    { error: { code, message } } satisfies ApiErrorResponse,
    { status },
  )
}

function rowsToProducts(rows: ProductRow[]) {
  const products = new Map<number, Product>()

  for (const row of rows) {
    const current = products.get(row.id)
    if (current) {
      if (row.size) current.sizes.push(row.size)
      continue
    }

    products.set(row.id, {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      priceMinor: row.price_minor,
      currency: row.currency,
      imageUrl: row.image_url,
      description: row.description,
      materials: row.materials,
      fit: row.fit,
      sizes: row.size ? [row.size] : [],
    })
  }

  return [...products.values()]
}

function parseCategory(value: string | null) {
  if (!value) return undefined
  return productCategories.find(
    (category) => category.toLowerCase() === value.toLowerCase(),
  )
}

async function listProducts(request: Request, env: Env) {
  const url = new URL(request.url)
  const categoryValue = url.searchParams.get('category')
  const category = parseCategory(categoryValue)

  if (categoryValue && !category) {
    return apiError(
      400,
      'INVALID_CATEGORY',
      `Category must be one of: ${productCategories.join(', ')}.`,
    )
  }

  const categoryFilter = category ? ' AND p.category = ?' : ''
  const statement = env.DB.prepare(
    `${selectProducts}${categoryFilter}
     ORDER BY p.display_order, p.id, ps.display_order`,
  )
  const result = category
    ? await statement.bind(category).all<ProductRow>()
    : await statement.all<ProductRow>()

  return Response.json(
    { data: rowsToProducts(result.results) } satisfies ProductListResponse,
    { headers: responseHeaders },
  )
}

async function getProduct(slug: string, env: Env) {
  const result = await env.DB.prepare(
    `${selectProducts} AND p.slug = ?
     ORDER BY p.display_order, p.id, ps.display_order`,
  )
    .bind(slug)
    .all<ProductRow>()

  const product = rowsToProducts(result.results)[0]
  if (!product) {
    return apiError(404, 'PRODUCT_NOT_FOUND', 'Product not found.')
  }

  return Response.json(
    { data: product } satisfies ProductDetailResponse,
    { headers: responseHeaders },
  )
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method !== 'GET') {
      return apiError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')
    }

    try {
      if (
        env.CATALOG_API_ORIGIN &&
        (url.pathname === '/api/products' ||
          url.pathname.startsWith('/api/products/'))
      ) {
        const upstreamUrl = new URL(
          `${url.pathname}${url.search}`,
          env.CATALOG_API_ORIGIN,
        )
        return fetch(upstreamUrl, {
          headers: { Accept: 'application/json' },
        })
      }

      if (url.pathname === '/api/products' || url.pathname === '/api/products/') {
        return await listProducts(request, env)
      }

      const match = url.pathname.match(/^\/api\/products\/([^/]+)\/?$/)
      if (match) {
        let slug: string
        try {
          slug = decodeURIComponent(match[1])
        } catch {
          return apiError(400, 'INVALID_SLUG', 'Product slug is invalid.')
        }
        return await getProduct(slug, env)
      }

      return apiError(404, 'API_ROUTE_NOT_FOUND', 'API route not found.')
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'Product API request failed',
          method: request.method,
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      )
      return apiError(500, 'INTERNAL_ERROR', 'Unable to load products.')
    }
  },
} satisfies ExportedHandler<Env>
