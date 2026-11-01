import {
  productCategories,
  type ApiErrorResponse,
  type CreateProductInput,
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

const noStoreHeaders = {
  'Cache-Control': 'no-store',
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidImageUrl(value: string) {
  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function parseCreateProduct(value: unknown):
  | { data: CreateProductInput }
  | { error: string } {
  if (!isRecord(value)) {
    return { error: 'Product details are required.' }
  }

  const stringFields = [
    'slug',
    'name',
    'imageUrl',
    'description',
    'materials',
    'fit',
  ] as const

  for (const field of stringFields) {
    if (typeof value[field] !== 'string' || value[field].trim().length === 0) {
      return { error: `${field} is required.` }
    }
  }

  const slug = (value.slug as string).trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return {
      error: 'slug must use lowercase letters, numbers, and single hyphens.',
    }
  }

  const category = productCategories.find(
    (item) => item === value.category,
  )
  if (!category) {
    return {
      error: `category must be one of: ${productCategories.join(', ')}.`,
    }
  }

  if (
    typeof value.priceMinor !== 'number' ||
    !Number.isInteger(value.priceMinor) ||
    value.priceMinor < 0 ||
    value.priceMinor > 100_000_000
  ) {
    return { error: 'priceMinor must be a valid non-negative integer.' }
  }

  if (value.currency !== 'CAD') {
    return { error: 'currency must be CAD.' }
  }

  const imageUrl = (value.imageUrl as string).trim()
  if (!isValidImageUrl(imageUrl) || imageUrl.length > 500) {
    return { error: 'imageUrl must be a valid image path or HTTP URL.' }
  }

  if (!Array.isArray(value.sizes) || value.sizes.length > 20) {
    return { error: 'sizes must be a list containing no more than 20 sizes.' }
  }

  const sizes = value.sizes.map((size) =>
    typeof size === 'string' ? size.trim() : '',
  )
  if (sizes.some((size) => size.length === 0 || size.length > 24)) {
    return { error: 'Each size must contain between 1 and 24 characters.' }
  }
  if (new Set(sizes).size !== sizes.length) {
    return { error: 'Sizes must be unique.' }
  }

  const name = (value.name as string).trim()
  const description = (value.description as string).trim()
  const materials = (value.materials as string).trim()
  const fit = (value.fit as string).trim()
  if (name.length > 160) return { error: 'name is too long.' }
  if (description.length > 2_000) return { error: 'description is too long.' }
  if (materials.length > 1_000) return { error: 'materials is too long.' }
  if (fit.length > 1_000) return { error: 'fit is too long.' }

  return {
    data: {
      slug,
      name,
      category,
      priceMinor: value.priceMinor,
      currency: 'CAD',
      imageUrl,
      description,
      materials,
      fit,
      sizes,
    },
  }
}

async function isValidAdminKey(provided: string, expected: string) {
  const encoder = new TextEncoder()
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash)
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

async function createProduct(request: Request, env: Env) {
  if (!env.ADMIN_API_KEY) {
    return apiError(
      503,
      'ADMIN_API_NOT_CONFIGURED',
      'Product creation is not configured.',
    )
  }

  const authorization = request.headers.get('Authorization')
  const providedKey = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : ''
  if (!providedKey || !(await isValidAdminKey(providedKey, env.ADMIN_API_KEY))) {
    return apiError(401, 'UNAUTHORIZED', 'A valid admin key is required.')
  }

  const contentLength = Number(request.headers.get('Content-Length') ?? 0)
  if (contentLength > 32_768) {
    return apiError(413, 'PAYLOAD_TOO_LARGE', 'Product details are too large.')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(400, 'INVALID_JSON', 'Product details must be valid JSON.')
  }

  const parsed = parseCreateProduct(body)
  if ('error' in parsed) {
    return apiError(400, 'INVALID_PRODUCT', parsed.error)
  }

  const product = parsed.data
  const existing = await env.DB.prepare(
    'SELECT id FROM products WHERE slug = ? LIMIT 1',
  )
    .bind(product.slug)
    .first<{ id: number }>()
  if (existing) {
    return apiError(409, 'SLUG_ALREADY_EXISTS', 'That product slug already exists.')
  }

  const insertProduct = env.DB.prepare(
    `INSERT INTO products (
       slug, name, category, price_minor, currency, image_url,
       description, materials, fit, display_order
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
       COALESCE((SELECT MAX(display_order) + 1 FROM products), 1)
     )`,
  ).bind(
    product.slug,
    product.name,
    product.category,
    product.priceMinor,
    product.currency,
    product.imageUrl,
    product.description,
    product.materials,
    product.fit,
  )
  const insertSizes = product.sizes.map((size, index) =>
    env.DB.prepare(
      `INSERT INTO product_sizes (product_id, size, display_order)
       SELECT id, ?, ? FROM products WHERE slug = ?`,
    ).bind(size, index + 1, product.slug),
  )

  try {
    await env.DB.batch([insertProduct, ...insertSizes])
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      return apiError(409, 'PRODUCT_ALREADY_EXISTS', 'Product already exists.')
    }
    throw error
  }

  const result = await env.DB.prepare(
    `${selectProducts} AND p.slug = ?
     ORDER BY p.display_order, p.id, ps.display_order`,
  )
    .bind(product.slug)
    .all<ProductRow>()

  return Response.json(
    { data: rowsToProducts(result.results)[0] } satisfies ProductDetailResponse,
    { status: 201, headers: noStoreHeaders },
  )
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    try {
      if (
        env.CATALOG_API_ORIGIN &&
        (url.pathname === '/api/products' ||
          url.pathname.startsWith('/api/products/') ||
          url.pathname === '/api/admin/products')
      ) {
        const upstreamUrl = new URL(
          `${url.pathname}${url.search}`,
          env.CATALOG_API_ORIGIN,
        )
        return fetch(new Request(upstreamUrl, request))
      }

      if (url.pathname === '/api/products' || url.pathname === '/api/products/') {
        if (request.method !== 'GET') {
          return apiError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')
        }
        return await listProducts(request, env)
      }

      if (url.pathname === '/api/admin/products') {
        if (request.method !== 'POST') {
          return apiError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')
        }
        return await createProduct(request, env)
      }

      const match = url.pathname.match(/^\/api\/products\/([^/]+)\/?$/)
      if (match) {
        if (request.method !== 'GET') {
          return apiError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')
        }
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
      return apiError(500, 'INTERNAL_ERROR', 'Unable to process product request.')
    }
  },
} satisfies ExportedHandler<Env>
