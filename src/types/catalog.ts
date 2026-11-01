export const productCategories = [
  'Tops',
  'Outerwear',
  'Objects',
  'Accessories',
] as const

export type ProductCategory = (typeof productCategories)[number]

export type Product = {
  id: number
  slug: string
  name: string
  category: ProductCategory
  priceMinor: number
  currency: 'CAD'
  imageUrl: string
  description: string
  materials: string
  fit: string
  sizes: string[]
}

export type ProductListResponse = {
  data: Product[]
}

export type ProductDetailResponse = {
  data: Product
}

export type ApiErrorResponse = {
  error: {
    code: string
    message: string
  }
}
